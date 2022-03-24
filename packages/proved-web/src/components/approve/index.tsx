import { useEffect, useState } from "react";
import { API } from "aws-amplify";
import { proofDetailGet } from "graphql/queries";
import { proofUpdate } from "graphql/mutations";
import { writeStorage } from "@rehooks/local-storage";

import {
  Proof,
  ProofDetail,
  ProofDetailGetQuery,
  ProofUpdateInput,
  ProofUpdateMutation,
  ProvedStatus,
} from "API";
import TicketVisual from "components/ticket-visual";
import { GradientBtn } from "components/ui/GradientBtn";
import { useUser } from "contexts/UserContext";
import { useRouter } from "next/router";
import { shortenName } from "utils/userName";
import { ContributionDetail } from "components/ui/ContributionDetail";
import { STORAGE_SIGNUP_REDIRECT } from "local-constants";
import Link from "next/link";
import { ChevronRightIcon } from "@heroicons/react/outline";

export const Approve = () => {
  const router = useRouter();
  const user = useUser();
  const [proof, setProof] = useState<ProofDetail | undefined>();
  const [validateError, setValidateError] = useState<string | undefined>();
  const { proofId } = router.query;

  useEffect(() => {
    if (proofId) {
      fetchData(proofId as string);
    }
  }, [proofId]);

  const fetchData = async (id: string) => {
    try {
      const r = (await API.graphql({
        query: proofDetailGet,
        variables: {
          id,
        },
      })) as { data: ProofDetailGetQuery };
      if (r.data.proofDetailGet) {
        setProof(r.data.proofDetailGet as ProofDetail);
      }
    } catch (e) {
      console.log("==== fetchdata", e);
    }
  };

  const handleProve = async () => {
    setValidateError("");
    if (user.isAuthenticated && user.data?.verified) {
      if (!user.data.orgs?.find((org) => org?.id === proof?.org?.id)) {
        setValidateError(
          `Error: You should be in the same Discord server${
            proof?.org?.name ? ` (${proof?.org?.name})` : ""
          } to approve this proposal`
        );
        return;
      }
      const proofInput: ProofUpdateInput = {
        id: proofId as string,
        prover: {
          id: user.data.address as string,
          name: user.data.name,
        },
        status: ProvedStatus.PROVED,
      };
      const r = (await API.graphql({
        query: proofUpdate,
        variables: {
          input: proofInput,
        },
      })) as { data: ProofUpdateMutation };
      const updatedProof = r.data.proofUpdate as Proof;
      setProof({ ...(proof as ProofDetail), provers: updatedProof.provers });
    } else {
      // keep path so that we can use it after signup
      writeStorage(STORAGE_SIGNUP_REDIRECT, {
        path: `/approve/${proofId}`,
        type: "PROVE",
      });
      router.push("/signup");
    }
  };

  const provers = proof?.provers || [];
  const firstProvername = provers
    ? `${provers[0]?.name}(${shortenName(provers[0]?.id)})`
    : "";
  const isOwner = user.data?.address === proof?.ownerId;
  const hasProved = !!provers.find(
    (prover) => prover?.id === user.data?.address
  );
  return (
    <div className="bg-proved-500 h-full flex flex-col">
      {isOwner && (
        <div className="m-6 block border-2 border-proved-100 bg-proved-300 hover:bg-gray-700 rounded-md p-4 text-left text-white">
          You can not prove your own contribution proposal.
        </div>
      )}
      <div className="inline-flex justify-center w-full pt-8">
        <div className="sm:mt-6 w-full sm:w-[525px]">
          <TicketVisual
            orgname={proof?.org?.name || ""}
            role={proof?.role || ""}
            name={proof?.owner?.name || ""}
            walletname={proof?.owner?.id || ""}
            prover={firstProvername}
            profileImage={proof?.owner?.profileImage || undefined}
          />
        </div>
      </div>

      {proof && <ContributionDetail proof={proof} />}
      <div className="mb-6">
        {!isOwner &&
          !hasProved &&
          (proof?.status === ProvedStatus.CLAIMED_PROPOSAL ||
            proof?.status === ProvedStatus.PROVED) && (
            <div className="mt-8 w-full flex-col inline-flex items-center justify-center">
              <p className="text-center pb-3 text-white">
                Once you approve, your wallet address will be signed on this NFT
                and the smart contract
              </p>
              <GradientBtn onClick={handleProve}>
                Prove contribution
              </GradientBtn>
            </div>
          )}
        {hasProved && (
          <div className="mt-8 w-full flex-col inline-flex items-center justify-center text-white pb-3 text-center">
            You proved this contribution!
            <Link href="/home" passHref>
              <a className="flex items-center text-gray-400 hover:text-gray-700 pt-5">
                <div className="font-medium px-2 sm:px-0 text-sm sm:text-base">
                  Go to Home and claim your contribution proposal
                </div>
                <ChevronRightIcon
                  className="flex-shrink-0 h-7 w-7 "
                  aria-hidden="true"
                />
              </a>
            </Link>
          </div>
        )}
        {proof?.status === ProvedStatus.MINTED && (
          <div className="mt-8 w-full inline-flex items-center justify-center text-gray-500 pb-2 px-2 sm:px-0 text-sm sm:text-base">
            {`This contribution is already minted by ${shortenName(
              proof?.ownerId || ""
            )}`}
          </div>
        )}
        {validateError && (
          <div className="text-red-400 text-center pt-4">{validateError}</div>
        )}
      </div>
    </div>
  );
};

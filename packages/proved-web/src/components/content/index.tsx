import { ProofDetail, ProofDetailGetQuery, S3Object } from "API";
import TicketVisual from "components/ticket-visual";
import { GradientBtn } from "components/ui/GradientBtn";
import { ProofHeader } from "components/ui/ProofHeader";
import { useRouter } from "next/router";
import { shortenName } from "utils/userName";
import { ContributionDetail } from "components/ui/ContributionDetail";
import { API } from "aws-amplify";
import { useEffect, useState } from "react";
import { proofDetailGet } from "graphql/queries";
import { useContractRead } from "wagmi";
import PoWABI from "contracts/PoW.json";

export const Content = () => {
  const router = useRouter();
  const [openseaLink, setOpenseaLink] = useState<string | undefined>();
  const [, read] = useContractRead(
    {
      addressOrName: process.env.NEXT_PUBLIC_POW_ADDRESS as string,
      contractInterface: PoWABI,
    },
    "tokenID"
  );
  const [proof, setProof] = useState<ProofDetail | undefined>();
  const { proofId } = router.query;

  useEffect(() => {
    if (proofId) {
      fetchData(proofId as string);
      fetchNFTLink(proofId as string);
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

  const fetchNFTLink = async (proofId: string) => {
    const result = await read({ args: proofId });
    if (result.data?.toString() !== "0") {
      const opensea =
        process.env.NEXT_PUBLIC_BUILD_ENV === "dev"
          ? "https://testnets.opensea.io/assets"
          : "https://opensea.io/assets/matic";
      setOpenseaLink(
        `${opensea}/${
          process.env.NEXT_PUBLIC_POW_ADDRESS
        }/${result.data?.toString()}`
      );
    }
  };

  const provers = proof?.provers;
  const firstProvername = provers
    ? `${provers[0]?.name}(${shortenName(provers[0]?.id)})`
    : "";

  return (
    <div className="bg-proved-500 h-full flex flex-col">
      <ProofHeader />
      <div className="inline-flex justify-center w-full">
        <div className="sm:mt-6 w-[525px]">
          <TicketVisual
            orgname={proof?.org?.name || ""}
            role={proof?.role || ""}
            name={proof?.owner?.name || ""}
            walletname={proof?.ownerId || ""}
            prover={firstProvername}
            profileImage={proof?.owner?.profileImage as S3Object}
          />
        </div>
      </div>
      {proof && <ContributionDetail proof={proof} />}
      <div className="w-full sm:w-[525px] self-center">
        {openseaLink && (
          <div className="mt-8 w-full flex-rol inline-flex items-center justify-center text-white pb-3 text-center">
            <p>Check Proved NFT on</p>
            <a href={openseaLink} target="_blank">
              <p className="pl-2 underline">OpenSea</p>
            </a>
            <p>!</p>
          </div>
        )}
        <div className="my-4 w-full inline-flex items-center justify-center">
          <GradientBtn
            onClick={() => {
              // Do nothing
            }}
          >
            Start claiming your role
          </GradientBtn>
        </div>
      </div>
    </div>
  );
};

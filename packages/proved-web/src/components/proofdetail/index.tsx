import { Proof, ProofGetQuery, ProvedStatus, S3Object } from "API";
import TicketVisual from "components/ticket-visual";
import { GradientBtn } from "components/ui/GradientBtn";
import { ProofHeader } from "components/ui/ProofHeader";
import { useUser } from "contexts/UserContext";
import { useRouter } from "next/router";
import { shortenName } from "utils/userName";
import { ShareForm } from "components/ui/ShareForm";
import { ContributionDetail } from "components/ui/ContributionDetail";
import { API } from "aws-amplify";
import { useEffect, useState } from "react";
import { proofGet } from "graphql/queries";
import { proofUpdate } from "graphql/mutations";
import { useContractRead } from "wagmi";
import PoWABI from "contracts/PoW.json";
import { ShareContent } from "components/ui/ShareContent";

export const ProofDetail = () => {
  const router = useRouter();
  const user = useUser();
  const [openseaLink, setOpenseaLink] = useState<string | undefined>();
  const [, read] = useContractRead(
    {
      addressOrName: process.env.NEXT_PUBLIC_POW_ADDRESS as string,
      contractInterface: PoWABI,
    },
    "tokenID"
  );
  const [loading, setLoading] = useState(false);
  const [proof, setProof] = useState<Proof | undefined>();
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
        query: proofGet,
        variables: {
          id,
        },
      })) as { data: ProofGetQuery };
      if (r.data.proofGet) {
        setProof(r.data.proofGet as Proof);
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
  const handleMint = async () => {
    setLoading(true);
    try {
      if (user.isAuthenticated && user.data?.verified) {
        const proofInput = {
          id: proofId as string,
          status: ProvedStatus.TRIGGERED_MINT,
        };
        await API.graphql({
          query: proofUpdate,
          variables: {
            input: proofInput,
          },
        });
        setProof({ ...(proof as Proof), status: ProvedStatus.TRIGGERED_MINT });
      }
    } catch (e) {
      console.log("==== mint", e);
    } finally {
      setLoading(false);
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
            name={user.data?.name as string}
            walletname={user.data?.address as string}
            prover={firstProvername}
            profileImage={user.data?.profileImage as S3Object}
          />
        </div>
      </div>
      {proof && <ContributionDetail proof={proof} />}
      <div className="w-full sm:w-[525px] self-center">
        {proof?.status === ProvedStatus.CANCELED && (
          <div className="mt-8 w-full inline-flex flex-col items-center justify-center text-center text-white">
            <p>NFT generation failed due to some issue on block chain. </p>
            <p className="mb-4">Please try again.</p>
            <div className="flex flex-row">
              <GradientBtn onClick={handleMint} disabled={loading}>
                Mint NFT
              </GradientBtn>
              {loading && (
                <div className="self-center ml-2">
                  <div className="animate-spin rounded-full px-2 self-center h-4 w-4 border-t-2 border-b-2 border-indigo-500" />
                </div>
              )}
            </div>
          </div>
        )}
        {proof?.status === ProvedStatus.PROVED && (
          <div className="mt-8 w-full inline-flex items-center justify-center">
            <GradientBtn onClick={handleMint} disabled={loading}>
              Mint NFT
            </GradientBtn>
            {loading && (
              <div className="self-center ml-2">
                <div className="animate-spin rounded-full px-2 self-center h-4 w-4 border-t-2 border-b-2 border-indigo-500" />
              </div>
            )}
          </div>
        )}
        {proof?.status === ProvedStatus.CLAIMED_PROPOSAL && (
          <div className="mt-8 w-full inline-flex items-center justify-center">
            <ShareForm
              proofId={proofId as string}
              orgName={proof?.org?.name as string}
              orgId={proof.org?.id as string}
            />
          </div>
        )}
        {proof?.status === ProvedStatus.TRIGGERED_MINT && (
          <div className="mt-8 w-full flex-col inline-flex items-center justify-center text-white pb-3 text-center">
            You have minted this NFT! It usually takes a couple of minutes. Come
            back later and check the update.
          </div>
        )}
        {proof?.status === ProvedStatus.MINTED && !openseaLink && (
          <div className="mt-8 w-full flex-col inline-flex items-center justify-center text-white pb-3 text-center">
            Your proof of contribution NFT will be available on Polygon network
            soon!
          </div>
        )}
        {openseaLink && (
          <div className="flex flex-col">
            <div className="mt-8 w-full flex-rol inline-flex items-center justify-center text-white pb-3 text-center">
              <p>Check your NFT on</p>
              <a href={openseaLink} target="_blank">
                <p className="pl-2 underline">OpenSea</p>
              </a>
              <p>!</p>
            </div>
            <div className="mt-8 mb-6 w-full inline-flex items-center justify-center">
              <ShareContent
                proofId={proofId as string}
                orgName={proof?.org?.name as string}
                orgId={proof?.org?.id as string}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

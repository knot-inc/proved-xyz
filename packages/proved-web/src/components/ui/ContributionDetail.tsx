import { CalendarIcon } from "@heroicons/react/outline";
import { Proof, ProofDetail } from "API";
import { formatDate } from "utils/formatDate";
import { shortenName } from "utils/userName";

interface ContributionDetailProps {
  proof: Proof | ProofDetail;
}

export const ContributionDetail = ({ proof }: ContributionDetailProps) => {
  // need to check txHash and nft tx hash are ready
  const minted = proof?.txHash && proof?.nftTxHash;
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full sm:w-[525px] text-white">
      <h2 className="text-3xl pt-6 text-center font-bold leading-tight ">
        Contribution Details
      </h2>
      <div className="my-4 text-xl">Start/End</div>
      <p className="mt-2 flex items-center  text-white sm:mt-0 sm:ml-4 ">
        <CalendarIcon
          className="flex-shrink-0 mr-1.5 h-5 w-5 text-white"
          aria-hidden="true"
        />
        {`${formatDate(proof?.startDate)} ~ ${formatDate(proof?.endDate)}`}
      </p>
      <div className="my-4 text-xl">Provers</div>
      {proof?.provers?.length ? (
        <ul role="list" className="bg-proved-500">
          {proof.provers?.map((prover) => (
            <li key={prover?.id} className="ml-4 mb-2">
              <div className="">
                <p>{`${prover?.name}(${shortenName(prover?.id)})`}</p>
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <div className="ml-4 mb-2">No provers yet!</div>
      )}
      {minted && (
        <>
          <div className="my-4 text-white text-xl">Transaction Hash</div>
          <div className="flex flex-row ml-4 mb-2">
            <p>{`NFT: ${shortenName(proof?.nftTxHash || undefined)}`}</p>
            <a href={`https://polygonscan.com/tx/${proof.nftTxHash}`}>
              <p className="pl-2 underline">(View on Polygon Scan)</p>
            </a>
          </div>
          <div className="flex flex-row ml-4">
            <p>{`Proof Contract: ${shortenName(
              proof?.txHash || undefined
            )}`}</p>
            <a href={`https://polygonscan.com/tx/${proof.txHash}`}>
              <p className="pl-2 underline">(View on Polygon Scan)</p>
            </a>
          </div>
        </>
      )}
    </div>
  );
};

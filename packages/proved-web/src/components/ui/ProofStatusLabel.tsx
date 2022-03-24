import { ProvedStatus } from "API";
const mapper = {
  [ProvedStatus.CANCELED]: "Cancelled",
  [ProvedStatus.CLAIMED_PROPOSAL]: "Awaiting prove",
  [ProvedStatus.MINTED]: "Minted",
  [ProvedStatus.PROVED]: "Proved",
  [ProvedStatus.TRIGGERED_MINT]: "Minting",
};
const colorMapper = {
  [ProvedStatus.CANCELED]: "bg-pink-300 text-pink-800",
  [ProvedStatus.CLAIMED_PROPOSAL]: "bg-green-300 text-green-800",
  [ProvedStatus.MINTED]: "bg-sky-300 text-sky-800",
  [ProvedStatus.PROVED]: "bg-indigo-300 text-indigo-800",
  [ProvedStatus.TRIGGERED_MINT]: "bg-lime-300 text-lime-800",
};

export const ProofStatusLabel = ({
  status,
}: {
  status?: ProvedStatus | null;
}) => (
  <p
    className={`px-4 py-3 inline-flex text-xl leading-5 font-semibold rounded-full ${
      colorMapper[status || ProvedStatus.CLAIMED_PROPOSAL]
    }`}
  >
    {status ? mapper[status] : ""}
  </p>
);

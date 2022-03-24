import Image from "next/image";
import TicketProfile from "./ticket-profile";
import TicketInfo from "./ticket-info";
import { S3Object } from "API";

type Props = {
  name?: string;
  orgname?: string;
  profileImage?: S3Object;
  prover?: string;
  role?: string;
  walletname?: string;
};

export default function TicketVisual({
  name,
  orgname,
  profileImage,
  prover,
  role,
  walletname,
}: Props) {
  return (
    <div className="flex justify-between flex-col bg-gradient-to-t from-purple-700 via-purple-800 to-purple-900 overflow-hidden rounded-2xl drop-shadow-xl text-gray-200">
      <div className="top-0 rounded-t-3xl h-14 overflow-hidden flex flex-row justify-between px-6">
        <div className="mt-4 h-8">
          <Image width={128} height={32} src="/card-logo.png" />
        </div>
        <div className="text-sm font-semibold self-center">
          PROOF OF CONTRIBUTION
        </div>
      </div>

      <div className="flex flex-row px-3 sm:px-6 pt-6 pb-3 sm:pb-9">
        <TicketProfile
          name={name}
          profileImage={profileImage}
          walletname={walletname}
        />
        <TicketInfo orgname={orgname} prover={prover} role={role} />
      </div>
      <div className="bottom-0 h-7 sm:h-10 overflow-hidden">
        <Image width={525} height={40} src="/card-bottom.png" />
      </div>
    </div>
  );
}

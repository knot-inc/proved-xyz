import { CalendarIcon } from "@heroicons/react/solid";
import { Proof } from "API";
import Link from "next/link";
import { formatDate } from "utils/formatDate";
import { shortenName } from "utils/userName";
import { ProofStatusLabel } from "./ProofStatusLabel";

interface ProofItemProps {
  proof: Proof;
}

export const ProofItem = ({ proof }: ProofItemProps) => {
  return (
    <Link href={`/proofdetail/${proof.id}`} passHref>
      <a className="block p-1 bg-gradient-to-r from-[#F8BCFF] via-[#9A96FF] to-[#A7DCFF] rounded-md">
        <div className="px-4 py-4 sm:px-6 bg-gray-900 hover:bg-gray-800 rounded-md">
          <div className="md:flex">
            <div className="flex-1">
              <div className="flex items-center justify-between">
                <p className=" text-xl font-medium text-white truncate">
                  {proof.org?.name}
                </p>
              </div>

              <div className="mt-2 sm:flex sm:justify-between ">
                <div className="sm:flex">
                  <p className="flex items-center  text-white mr-3 w-48 mb-2 md:mb-0">
                    {proof.role}
                  </p>
                  <p className="mt-2 flex items-center  text-white sm:mt-0 sm:ml-6 ">
                    <CalendarIcon
                      className="flex-shrink-0 mr-1.5 h-5 w-5 text-white"
                      aria-hidden="true"
                    />
                    {`${formatDate(proof.startDate)} ~ ${formatDate(
                      proof.endDate
                    )}`}
                  </p>
                </div>
              </div>
              {proof.provers ? (
                <div className="text-white mt-2">{`Proved by ${shortenName(
                  proof.provers[0]?.id
                )}`}</div>
              ) : (
                <div className="text-white mt-2">No one proved yet</div>
              )}
            </div>
            <div className="flex-shrink self-center justify-center items-center">
              <ProofStatusLabel status={proof.status} />
            </div>
          </div>
        </div>
      </a>
    </Link>
  );
};

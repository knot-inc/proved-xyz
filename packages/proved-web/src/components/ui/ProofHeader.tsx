import { ChevronLeftIcon } from "@heroicons/react/solid";
import Link from "next/link";

export const ProofHeader = () => {
  return (
    <header className="bg-proved-500 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 xl:flex xl:items-center xl:justify-between">
        <nav className="flex" aria-label="Breadcrumb">
          <Link href="/home" passHref>
            <a className="flex items-center text-gray-400 hover:text-gray-700">
              <ChevronLeftIcon
                className="flex-shrink-0 h-7 w-7 "
                aria-hidden="true"
              />
              <div className="font-medium ">Home</div>
            </a>
          </Link>
        </nav>
      </div>
    </header>
  );
};

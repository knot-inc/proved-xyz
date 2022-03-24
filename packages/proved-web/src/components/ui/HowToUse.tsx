import { Tab } from "@headlessui/react";
import { Fragment } from "react";
import Image from "next/image";

export const HowToUse = () => {
  return (
    <Tab.Group vertical>
      <div className="lg:grid lg:grid-cols-12 lg:gap-12">
        <Tab.Panels className="col-span-7 mb-4">
          <Tab.Panel>
            <Image
              src="/howToUse01.jpeg"
              alt="how to use"
              className="rounded-lg"
              height={488}
              width={734}
            />
          </Tab.Panel>
          <Tab.Panel>
            <Image
              src="/howToUse02.jpeg"
              alt="how to use"
              className="rounded-lg"
              height={488}
              width={734}
            />
          </Tab.Panel>
          <Tab.Panel>
            <Image
              src="/howToUse03.jpeg"
              alt="how to use"
              className="rounded-lg"
              height={488}
              width={734}
            />
          </Tab.Panel>
        </Tab.Panels>
        <Tab.List className="col-span-5 grid grid-rows-3">
          <Tab as={Fragment}>
            {({ selected }) => (
              <button
                className={
                  selected
                    ? "mb-4 p-0.5 bg-gradient-to-r from-[#F8BCFF] via-[#9A96FF] to-[#A7DCFF] rounded-[12px] w-full focus:outline-none "
                    : "mb-4 border-2 border-proved-100 rounded-[16px] w-full"
                }
              >
                <div className="flex flex-col justify-center p-8 h-full bg-proved-500 rounded-[10px] text-left">
                  <span className="uppercase">Step1</span>
                  <h3 className="lg:text-2xl font-bold">
                    Claim your contributions
                  </h3>
                </div>
              </button>
            )}
          </Tab>
          <Tab as={Fragment}>
            {({ selected }) => (
              <button
                className={
                  selected
                    ? "mb-4 p-0.5 bg-gradient-to-r from-[#F8BCFF] via-[#9A96FF] to-[#A7DCFF] rounded-[12px] w-full focus:outline-none "
                    : "mb-4 border-2 border-proved-100 rounded-[16px] w-full"
                }
              >
                <div className="flex flex-col justify-center p-8 h-full bg-proved-500 rounded-[10px] text-left">
                  <span className="uppercase">Step2</span>
                  <h3 className="lg:text-2xl font-bold">
                    Ask members to prove them
                  </h3>
                </div>
              </button>
            )}
          </Tab>
          <Tab as={Fragment}>
            {({ selected }) => (
              <button
                className={
                  selected
                    ? "mb-4 p-0.5 bg-gradient-to-r from-[#F8BCFF] via-[#9A96FF] to-[#A7DCFF] rounded-[12px] w-full focus:outline-none "
                    : "mb-4 border-2 border-proved-100 rounded-[16px] w-full"
                }
              >
                <div className="flex flex-col justify-center p-8 h-full bg-proved-500 rounded-[10px] text-left">
                  <span className="uppercase">Step3</span>
                  <h3 className="lg:text-2xl font-bold">
                    Mint your NFT for free
                  </h3>
                </div>
              </button>
            )}
          </Tab>
        </Tab.List>
      </div>
    </Tab.Group>
  );
};

import Image from "next/image";
import { useUser } from "contexts/UserContext";
import { useRouter } from "next/router";

import { ArrowRightIcon } from "@heroicons/react/solid";

import provedCard from "../../../public/card.png";
import { HowToUse } from "components/ui/HowToUse";

export const LandingPage = () => {
  const router = useRouter();
  const user = useUser();

  const handleClaim = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    e.preventDefault();
    if (user.isAuthenticated && user.data?.verified) {
      router.push("/claim");
    } else {
      router.push("/signup");
    }
  };

  return (
    <div className="flex flex-col min-h-screen overflow-hidden bg-proved-500 text-white">
      <main className="flex-grow">
        <section className="container max-w-7xl mx-auto px-6 lg:px-8">
          <div className="h-full pt-16 pb-8 lg:pt-32 lg:pb-16">
            {/* Hero content */}
            <div className="relative lg:grid lg:grid-cols-12 md:gap-12 lg:gap-8 items-center z-10">
              {/* Content */}
              <div className="md:col-span-6 lg:col-span-6 mb-8 md:mb-0 text-left relative z-10">
                <h1
                  className="text-4xl xl:text-5xl mb-2 md:mb-4 font-extrabold xl:leading-[4rem]"
                  data-aos="fade-down"
                >
                  <p>Prove your</p>
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#F8BCFF] via-[#9A96FF] to-[#A7DCFF]">
                    Discord roles {""}
                  </span>
                  with NFTs
                </h1>
                <div className="text-xl text-gray-400 mb-4 md:mb-8">
                  Demonstrate your DAO contributions on-chain to showcase your
                  credentials.
                </div>
                {/* CTA */}
                <button
                  className="w-1/2 md:w-64 border-transparent rounded-full p-0.5 bg-gradient-to-r from-[#F8BCFF] via-[#9A96FF] to-[#A7DCFF]"
                  onClick={handleClaim}
                >
                  <div className="w-full inline-flex items-center justify-between px-6 py-3 rounded-full text-base font-medium text-white bg-proved-500 hover:bg-proved-300 ">
                    Claim
                    <ArrowRightIcon
                      className="ml-3 -mr-1 h-5 w-5 text-white"
                      aria-hidden="true"
                    />
                  </div>
                </button>
              </div>

              <div className="relative md:col-span-6 lg:col-span-6">
                <Image
                  src={provedCard}
                  alt="Picture of the author"
                  className="rounded-2xl absolute z-10"
                  layout="intrinsic"
                  width={720}
                  height={864}
                  draggable="false"
                />
              </div>

              {/* Background illustration */}
              <svg
                className="absolute top-0 lg:-top-32 -left-1/2 lg:left-48 xl:left-96  pointer-events-none z-0l w-full"
                width="1152"
                height="1152"
                viewBox="0 0 1152 1152"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <g filter="url(#filter0_f_577_512)">
                  <rect
                    x="256"
                    y="256"
                    width="640"
                    height="640"
                    rx="320"
                    fill="url(#paint0_linear_577_512)"
                    fillOpacity="0.5"
                  />
                  <rect
                    x="256.5"
                    y="256.5"
                    width="639"
                    height="639"
                    rx="319.5"
                    stroke="black"
                  />
                </g>
                <defs>
                  <filter
                    id="filter0_f_577_512"
                    x="0"
                    y="0"
                    width="1152"
                    height="1152"
                    filterUnits="userSpaceOnUse"
                    colorInterpolationFilters="sRGB"
                  >
                    <feFlood floodOpacity="0" result="BackgroundImageFix" />
                    <feBlend
                      mode="normal"
                      in="SourceGraphic"
                      in2="BackgroundImageFix"
                      result="shape"
                    />
                    <feGaussianBlur
                      stdDeviation="128"
                      result="effect1_foregroundBlur_577_512"
                    />
                  </filter>
                  <linearGradient
                    id="paint0_linear_577_512"
                    x1="606.995"
                    y1="859.943"
                    x2="985.136"
                    y2="277.934"
                    gradientUnits="userSpaceOnUse"
                  >
                    <stop stopColor="#DF38FF" />
                    <stop offset="0.49763" stopColor="#5C56FF" />
                    <stop offset="1" stopColor="#47B6FF" />
                  </linearGradient>
                </defs>
              </svg>
            </div>
          </div>
        </section>

        <section className="pt-16 pb-8 md:pt-32 md:pb-32">
          <div className="container max-w-7xl mx-auto px-6 lg:px-8">
            {/* How to use */}
            <h2 className="mb-4 lg:mb-8 text-3xl lg:text-4xl font-bold">
              How to Use
            </h2>
            <HowToUse />
          </div>
        </section>

        <section>
          <div className="container max-w-7xl mx-auto px-6 lg:px-8">
            <div className="pt-10 sm:pt-32 pb-32 md:pt-40 md:pb-40">
              {/* Banner content */}
              <div className="md:grid md:grid-cols-12 md:gap-12 lg:gap-20 items-center">
                {/* Banner Content */}
                <div className="md:col-span-7 lg:col-span-7 mb-8 md:mb-0 text-left">
                  <h2
                    className="text-4xl lg:text-5xl mb-12 font-extrabold xl:leading-[4rem]"
                    data-aos="fade-down"
                  >
                    Start claiming your{" "}
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#F8BCFF] via-[#9A96FF] to-[#A7DCFF]">
                      {" "}
                      contributions
                    </span>
                  </h2>
                  {/* CTA */}
                  <button
                    className="border border-transparent rounded-full p-0.5 bg-gradient-to-r from-[#F8BCFF] via-[#9A96FF] to-[#A7DCFF]"
                    onClick={handleClaim}
                  >
                    <div className="w-64 inline-flex items-center justify-between px-6 py-3 rounded-full text-base font-medium text-white bg-proved-500 hover:bg-proved-300 ">
                      Claim
                      <ArrowRightIcon
                        className="ml-3 -mr-1 h-5 w-5 text-white hover:text-proved-500"
                        aria-hidden="true"
                      />
                    </div>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

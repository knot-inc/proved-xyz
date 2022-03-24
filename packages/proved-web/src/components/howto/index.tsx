import { useRouter } from "next/router";
import { GradientBtn } from "components/ui/GradientBtn";
import { HowToUse } from "components/ui/HowToUse";
import { ProofHeader } from "components/ui/ProofHeader";
import { useUser } from "contexts/UserContext";

export const HowTo = () => {
  const router = useRouter();
  const user = useUser();
  const handleClaim = () => {
    if (user.isAuthenticated && user.data?.verified) {
      router.push("/claim");
    } else {
      router.push("/signup");
    }
  };
  return (
    <div className="bg-proved-500 h-full flex flex-col text-white">
      <ProofHeader />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="mb-4 lg:mb-8 text-3xl lg:text-4xl font-bold">
          How to Use
        </h2>
        <HowToUse />
      </div>
      <div className="self-center pt-3">
        <GradientBtn onClick={handleClaim}>
          Claim your contributions
        </GradientBtn>
      </div>
    </div>
  );
};

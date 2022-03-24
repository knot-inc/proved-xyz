import { useRouter } from "next/router";
import { CheckCircleIcon } from "@heroicons/react/outline";
import { useEffect, useState } from "react";
import { useLocalStorage, deleteFromStorage } from "@rehooks/local-storage";
import { GradientBtn } from "components/ui/GradientBtn";
import { useVerify } from "hooks/useVerify";
import { useUser } from "contexts/UserContext";
import { useAuth } from "hooks/useAuth";
import { useConnect } from "wagmi";
import Link from "next/link";
import { STORAGE_SIGNUP_REDIRECT } from "local-constants";
import * as ga from "utils/ga";

enum Step {
  WALLET,
  DISCORD,
}

const content = {
  CLAIM: {
    title: "Verify yourself to start claiming",
    message: "We will use Wallet and Discord for verification",
  },
  PROVE: {
    title: "Verify yourself to prove contribution",
    message: "We will use Wallet and Discord for verification",
  },
};
export const Signup = () => {
  const [{ loading: verifyLoading }, verify] = useVerify();
  const [{ loading: authLoading }, login] = useAuth();
  const [{ data }, connect] = useConnect();
  const router = useRouter();

  const user = useUser();
  const userAddress = user.data?.address;

  const [step, setStep] = useState<Step>(Step.WALLET);
  const [walletConnected, setWalletConnected] = useState<boolean>(false);
  const [signupRedirect] = useLocalStorage<{ path: string; type: string }>(
    STORAGE_SIGNUP_REDIRECT
  );
  const type = signupRedirect?.type || "CLAIM";
  const mainContent = type === "CLAIM" ? content.CLAIM : content.PROVE;

  useEffect(() => {
    if (user.isAuthenticated) {
      setWalletConnected(true);
      setStep(Step.DISCORD);
    }
    if (user.data?.verified) {
      ga.event({
        action: "signup_complete",
        params: {
          type,
        },
      });
      switch (type) {
        case "CLAIM":
          router.push("/claim");
          return;
        case "PROVE": {
          // proofId should exist
          if (signupRedirect?.path) {
            router.push(signupRedirect.path);
            deleteFromStorage(STORAGE_SIGNUP_REDIRECT);
          } else {
            throw new Error("proofId does not exist!");
          }
          return;
        }
      }
    }
  }, [user]);

  const code = router.query.code as string;
  useEffect(() => {
    if (code && userAddress) {
      // start verification
      verify({ address: userAddress, code, path: 'signup' }).catch((e) => {
        console.log(e);
      });
    }
  }, [code, userAddress]);

  const handleWallectConnect = async (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    e.preventDefault();
    const connector = data.connectors.filter(
      (connector) => connector.name === "MetaMask"
    );
    const result = await connect(connector[0]);
    await login(result?.data?.account as string, connector[0]);
  };

  return (
    <div className="bg-proved-500 min-h-full ">
      <div className="max-w-7xl mx-auto text-center py-12 px-4 sm:px-6 lg:py-16 lg:px-8">
        <h2 className="text-3xl font-extrabold tracking-tight text-gray-200 sm:text-4xl">
          <span className="block">{mainContent.title}</span>
        </h2>
        <p className="mt-4 text-lg leading-6 text-indigo-200">
          {mainContent.message}
        </p>
        <div className="mt-8 flex justify-center sm:space-x-4 sm:grid sm:grid-cols-2">
          <div className="flex flex-col rounded-lg shadow-lg overflow-hidden">
            <div
              className={`flex-1  p-6 flex flex-col justify-between ${
                step === Step.WALLET ? "bg-proved-300" : "bg-proved-700"
              }`}
            >
              <p
                className={`text-xl font-semibold ${
                  step === Step.WALLET ? "text-gray-100" : "text-gray-500"
                } `}
              >
                Step 1. Connect your wallet
              </p>
              <p
                className={`mt-3 text-base
              ${step === Step.WALLET ? "text-gray-500" : "text-gray-700"}
               `}
              >
                We use wallet for authorization
              </p>
              <div className="mt-6 inline-flex rounded-md shadow self-center">
                <GradientBtn
                  onClick={handleWallectConnect}
                  disabled={step !== Step.WALLET}
                >
                  Wallet
                </GradientBtn>
                {authLoading && (
                  <div className="self-center ml-2">
                    <div className="animate-spin rounded-full px-2 self-center h-4 w-4 border-t-2 border-b-2 border-indigo-500" />
                  </div>
                )}
                {walletConnected && (
                  <div className="self-center ml-2">
                    <CheckCircleIcon
                      className="h-12 w-12 text-green-600"
                      aria-hidden="true"
                    />
                  </div>
                )}
              </div>
            </div>
          </div>
          <div className="flex flex-col rounded-lg shadow-lg overflow-hidden">
            <div
              className={`flex-1  p-6 flex flex-col justify-between ${
                step === Step.DISCORD ? "bg-proved-300" : "bg-proved-700"
              }`}
            >
              <p
                className={`text-xl font-semibold ${
                  step === Step.DISCORD ? "text-gray-100" : "text-gray-500"
                } `}
              >
                Step 2. Connect Discord
              </p>
              <p
                className={`mt-3 text-base
              ${step === Step.DISCORD ? "text-gray-500" : "text-gray-700"}
               `}
              >
                We use Discord to check your name and servers you've joined
              </p>
              <div className="mt-6 inline-flex rounded-md shadow self-center">
                <Link
                  href={process.env.NEXT_PUBLIC_DISCORD_AUTH_LINK as string}
                >
                  <a>
                    <GradientBtn
                      onClick={() => {
                        // Do nothing
                      }}
                      disabled={step !== Step.DISCORD}
                    >
                      Discord
                    </GradientBtn>
                  </a>
                </Link>
                {(verifyLoading || user.loading) && (
                  <div className="self-center ml-2">
                    <div className="animate-spin rounded-full px-2 self-center h-4 w-4 border-t-2 border-b-2 border-indigo-500" />
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

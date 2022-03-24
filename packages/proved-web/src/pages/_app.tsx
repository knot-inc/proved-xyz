import "../styles/globals.css";
import Amplify from "aws-amplify";
import { useEffect } from "react";
import { useRouter } from "next/router";
import type { AppProps } from "next/app";
import { providers } from "ethers";
import { InjectedConnector, Provider, chain } from "wagmi";
import awsconfig from "../aws-exports";
import { appSync } from "appsync-exports";
import { Seo } from "components/ui/Seo";
import { NotificationProvider } from "contexts/NotificationContext";
import { UserContextProvider } from "contexts/UserContext";
import { Networkish } from "@ethersproject/networks";
import * as ga from "utils/ga";

const config =
  process.env.NEXT_PUBLIC_BUILD_ENV === "dev" ? appSync.dev : appSync.prod;
Amplify.configure({
  ...awsconfig,
  ...config,
  Auth: {
    identityPoolId: process.env.NEXT_PUBLIC_IDENTITY_POOL_ID,
    region: awsconfig.aws_project_region,
    userPoolId: process.env.NEXT_PUBLIC_USER_POOL_ID,
    userPoolWebClientId: process.env.NEXT_PUBLIC_USER_POOL_WEB_CLIENT_ID,
  },
  API: {
    endpoints: [
      {
        name: "Proved Auth API",
        endpoint: process.env.NEXT_PUBLIC_AUTH_API,
      },
      {
        name: "Proved OpenGraph API",
        endpoint: process.env.NEXT_PUBLIC_OGP_API,
      },
    ],
  },
});

// Chains for connectors to support
const chains =
  process.env.NEXT_PUBLIC_BUILD_ENV === "dev"
    ? [chain.rinkeby]
    : [chain.polygonMainnet];
// const infuraId = process.env.NEXT_PUBLIC_INFURA_KEY;

const network: Networkish =
  process.env.NEXT_PUBLIC_BUILD_ENV === "dev" ? "rinkeby" : "matic";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const provider = ({ chainId }: { chainId?: number }) =>
  new providers.AlchemyProvider(network, process.env.NEXT_PUBLIC_ALCHEMY_KEY);

// Set up connectors
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const connectors = ({ chainId }: { chainId?: number }) => {
  return [new InjectedConnector({ chains })];
};
function MyApp({ Component, pageProps }: AppProps) {
  const router = useRouter();

  useEffect(() => {
    const handleRouteChange = (url: string) => {
      ga.pageview(url);
    };
    //When the component is mounted, subscribe to router changes
    //and log those page views
    router.events.on("routeChangeComplete", handleRouteChange);

    // If the component is unmounted, unsubscribe
    // from the event with the `off` method
    return () => {
      router.events.off("routeChangeComplete", handleRouteChange);
    };
  }, [router.events]);

  // request from /content path should render SEO contents on their page
  const isStaticContent = !router.asPath.startsWith("/content");

  return (
    <Provider connectors={connectors} provider={provider}>
      <UserContextProvider>
        <NotificationProvider>
          {isStaticContent && (
            <Seo
              imgHeight={768}
              imgWidth={1024}
              imgUrl="/proved-ogp.jpeg"
              path="https://proved.xyz"
              title="Proved"
              pageDescription="Prove your Discord roles with NFTs."
            />
          )}
          <Component {...pageProps} />
        </NotificationProvider>
      </UserContextProvider>
    </Provider>
  );
}

export default MyApp;

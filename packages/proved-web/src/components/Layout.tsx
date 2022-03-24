import { useState } from "react";
import { Header } from "./ui/Header";
import { Hub } from "aws-amplify";
import { useRouter } from "next/router";
import { Notification } from "./ui/Notification";
import { useNotificationState } from "contexts/NotificationContext";
import { useAuth } from "hooks/useAuth";
import { Connector } from "wagmi";

export const Layout = ({
  children,
  disableFooter,
}: {
  children: React.ReactNode;
  disableFooter?: boolean;
}) => {
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const router = useRouter();
  const notificationState = useNotificationState();
  const [{ loading }, login] = useAuth();

  const handleLoginRequest = async (address: string, connector: Connector) => {
    setIsLoggingIn(true);

    try {
      await login(address, connector);
    } catch {
    } finally {
      setIsLoggingIn(false);
    }
  };

  const handleSignOut = async () => {
    Hub.dispatch("user", { event: "signout" });
    router.replace("/");
  };

  return (
    <>
      <div className="flex flex-col h-screen justify-between">
        <Header
          isLoggingIn={isLoggingIn}
          onLoginRequested={handleLoginRequest}
          onSignOutRequested={handleSignOut}
        />
        <div className="flex-grow">{children}</div>
        {!disableFooter && (
          <footer className="bg-proved-500">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 flex items-center justify-between border-t-2 border-proved-300 text-gray-400 text-sm">
              <div>2022 Knot, inc</div>
              <div className="space-x-3">
                <a
                  className="hover:text-gray-200"
                  href="https://knotinc.notion.site/About-Knot-inc-4a4bcde74b5c46fcad6faed4d7662241"
                >
                  About us
                </a>
                <a
                  className="hover:text-gray-200"
                  href="https://knotinc.notion.site/Privacy-Policy-e61d861912db40f48ce17fa41ad6f23b"
                >
                  Privacy
                </a>
                <a
                  className="hover:text-gray-200"
                  href="https://knotinc.notion.site/Terms-of-Service-e661759ae9654a5cb4908f845bea23a1"
                >
                  Terms
                </a>
              </div>
            </div>
          </footer>
        )}
      </div>
      {notificationState.show && (
        <Notification content={notificationState.content} />
      )}
      {loading && (
        <div className="inline-block align-bottom bg-black rounded-lg text-left overflow-hidden shadow-xl transform sm:my-2 sm:align-middle sm:p-6">
          <div className="flex justify-center self-center">
            <div className="animate-spin rounded-full h-24 w-24 border-t-2 border-b-2 border-indigo-500" />
          </div>
        </div>
      )}
    </>
  );
};

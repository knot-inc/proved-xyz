/* This example requires Tailwind CSS v2.0+ */
import { Fragment, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { Disclosure, Menu, Transition } from "@headlessui/react";
import { MenuIcon, XIcon } from "@heroicons/react/outline";
import { Connector, useAccount, useConnect } from "wagmi";
import { useUser } from "contexts/UserContext";
import { shortenName } from "utils/userName";
import { GradientBtn } from "./GradientBtn";
import { DiscordLogo } from "./DiscordLogo";
import { LogoSize } from "types";
import { TwitterLogo } from "./TwitterLogo";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const userNavigation = [
  { name: "Profile", href: "/profile", id: "profile" },
  { name: "Disconnect", href: "/", id: "disconnect" }
];

function classNames(...classes: unknown[]) {
  return classes.filter(Boolean).join(" ");
}

export const Header = ({
  isLoggingIn,
  onLoginRequested,
  onSignOutRequested,
}: {
  isLoggingIn: boolean;
  onLoginRequested: (address: string, connector: Connector) => Promise<void>;
  onSignOutRequested: () => void;
}) => {
  const user = useUser();
  const [{ data, error }, connect] = useConnect();
  const [{ error: accountError }, disconnect] = useAccount();

  useEffect(() => {
    if (error) {
      console.log("====", error);
    }
  }, [error]);

  useEffect(() => {
    if (accountError) {
      console.log("====acc", accountError);
    }
  }, [accountError]);

  const handleConnectBtn = async () => {
    // TODO: handle this somewhere else
    // Metamask
    const connector = data.connectors.filter(
      (connector) => connector.name === "MetaMask"
    );
    console.log(connector);
    const result = await connect(connector[0]);
    console.log(result);
    if (result?.data?.account) {
      await onLoginRequested(result.data.account, connector[0]);
    }
  };

  const handleSignOut = (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    e.preventDefault();
    disconnect();
    onSignOutRequested();
  };

  return (
    <Disclosure as="nav" className="bg-proved-500">
      {({ open }) => (
        <>
          <div className="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between h-16">
              <div className="flex">
                <Link href={user?.isAuthenticated ? "/home" : "/"} passHref>
                  <a className="flex-shrink-0 flex items-center">
                    <Image
                      width={144}
                      height={39}
                      src="/proved-logo.svg"
                      alt="Logo"
                    />
                  </a>
                </Link>
              </div>
              <div className="flex items-center">
                <Link href="https://discord.gg/VQcZD6CsAF" passHref>
                  <a target="_blank" className="inline-block mx-4">
                    <DiscordLogo size={LogoSize.Large} />
                  </a>
                </Link>
                <Link href="https://twitter.com/proved_xyz" passHref>
                  <a target="_blank" className="inline-block mx-4">
                    <TwitterLogo size={LogoSize.Large} />
                  </a>
                </Link>
                <div className="ml-2 mr-2 flex items-center md:hidden">
                  {/* Mobile menu button */}
                  <Disclosure.Button className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-white hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white">
                    <span className="sr-only">Open main menu</span>
                    {open ? (
                      <XIcon className="block h-6 w-6" aria-hidden="true" />
                    ) : (
                      <MenuIcon className="block h-6 w-6" aria-hidden="true" />
                    )}
                  </Disclosure.Button>
                </div>
                {/** user.isAuthenticated */}
                {user.isAuthenticated ? (
                  <div className="hidden md:ml-4 md:flex-shrink-0 md:flex md:items-center">
                    {/* Profile dropdown */}
                    <Menu as="div" className="ml-3 relative">
                      <div>
                        <Menu.Button className="bg-gray-800 flex text-sm rounded-full ">
                          <GradientBtn
                            onClick={() => {
                              // Do nothing
                            }}
                          >
                            {shortenName(user.data?.address || "")}
                          </GradientBtn>
                        </Menu.Button>
                      </div>
                      <Transition
                        as={Fragment}
                        enter="transition ease-out duration-200"
                        enterFrom="transform opacity-0 scale-95"
                        enterTo="transform opacity-100 scale-100"
                        leave="transition ease-in duration-75"
                        leaveFrom="transform opacity-100 scale-100"
                        leaveTo="transform opacity-0 scale-95"
                      >
                        <Menu.Items className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg py-1 bg-white ring-1 ring-black ring-opacity-5 focus:outline-none">
                          {userNavigation.map((item) => (
                            <Menu.Item key={item.name}>
                              {({ active }) => {
                                if (item.id === "disconnect") {
                                  return (
                                    <button
                                      className={classNames(
                                        active ? "bg-gray-100" : "",
                                        "block px-4 py-2 text-sm text-gray-700 w-full text-left"
                                      )}
                                      onClick={handleSignOut}
                                    >
                                      {item.name}
                                    </button>
                                  );
                                }
                                return (
                                  <Link href={item.href} passHref>
                                    <a
                                      className={classNames(
                                        active ? "bg-gray-100 " : "",
                                        "block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                      )}
                                    >
                                      {item.name}
                                    </a>
                                  </Link>
                                );
                              }}
                            </Menu.Item>
                          ))}
                        </Menu.Items>
                      </Transition>
                    </Menu>
                  </div>
                ) : (
                  <div className="hidden md:flex md:items-center md:ml-4">
                    <GradientBtn
                      onClick={handleConnectBtn}
                      disabled={isLoggingIn}
                    >
                      Connect Wallet
                    </GradientBtn>
                    {isLoggingIn && (
                      <div className="self-center ml-2">
                        <div className="animate-spin rounded-full px-2 self-center h-4 w-4 border-t-2 border-b-2 border-indigo-500" />
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>

          <Disclosure.Panel className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
              {user.isAuthenticated ? (
                <div className="flex-shrink-0">
                  <GradientBtn
                    onClick={() => {
                      // Do nothing
                    }}
                  >
                    {shortenName(user.data?.name || "")}
                  </GradientBtn>

                  <div className="pt-4 pb-3 border-t border-gray-700">
                    <div className="flex items-center px-5 sm:px-6">
                      <div className="ml-3">
                        <div className="text-base font-medium text-white">
                          {shortenName(user.data?.id)}
                        </div>
                        <div className="text-sm font-medium text-gray-400">
                          {user.data?.email || ""}
                        </div>
                      </div>
                    </div>
                    <div className="mt-3 px-2 space-y-1 sm:px-3">
                      {userNavigation.map((item) => {
                        if (item.id === "disconnect") {
                          return (
                            <button
                              key={item.name}
                              onClick={handleSignOut}
                              className="block px-3 py-2 rounded-md text-base font-medium text-gray-400 hover:text-white hover:bg-gray-700"
                            >
                              {item.name}
                            </button>
                          );
                        }
                        return (
                          <Link key={item.name} href={item.href} passHref>
                            <button className="block px-3 py-2 rounded-md text-base font-medium text-gray-400 hover:text-white hover:bg-gray-700">
                              {item.name}
                            </button>
                          </Link>
                        );
                      })}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="flex-shrink-0">
                  <GradientBtn onClick={handleConnectBtn}>
                    Connect Wallet
                  </GradientBtn>
                </div>
              )}
            </div>
          </Disclosure.Panel>
        </>
      )}
    </Disclosure>
  );
};

import { useState } from "react";
import { TwitterShareButton, TwitterIcon } from "react-share";
import { DiscordLogo } from "./DiscordLogo";
import { event } from "utils/ga/index";
import { useRouter } from "next/router";

interface ShareFormProps {
  proofId: string;
  orgName: string;
  orgId: string;
}
const shareUrl = ({ proofId }: { proofId: string }) => {
  const host = `${
    process.env.NEXT_PUBLIC_BUILD_ENV === "dev"
      ? "https://dev.d2sndpe29tmpgb.amplifyapp.com"
      : "https://proved.xyz"
  }`;
  return host + `/content/${proofId}`;
};
export const ShareContent = ({ proofId, orgName, orgId }: ShareFormProps) => {
  const router = useRouter();
  const [copied, setCopied] = useState(false);
  const url = shareUrl({ proofId: proofId as string });
  const message = `Hey, check out my role at ${orgName} on Proved! ${url}`;
  const messageTwitter = `${message} @proved_xyz`;

  const handleCopy = async () => {
    if ("clipboard" in navigator) {
      await navigator.clipboard.writeText(message);
    } else {
      document.execCommand("copy", true, message);
    }
    setCopied(true);
    event({
      action: "copied",
      params: {
        screen: router.pathname,
      },
    });
  };

  const openDiscord = () => {
    trackShare("discord")();
    const discordLink = `https://discord.com/channels/${orgId}/`;
    window.open(discordLink);
  };
  const trackShare =
    (type: string) =>
    (
      e?: React.MouseEvent<
        HTMLButtonElement | HTMLAnchorElement | HTMLDivElement,
        MouseEvent
      >
    ) => {
      e?.preventDefault();
      event({
        action: "share",
        params: {
          type,
          screen: router.pathname,
        },
      });
    };

  return (
    <div className="w-full p-1 bg-gradient-to-r from-[#F8BCFF] via-[#9A96FF] to-[#A7DCFF] rounded-lg">
      <div className="px-4 py-4 sm:px-6 bg-gray-900  rounded-lg ">
        <p className="my-2 text-center text-white text-lg font-semibold">
          Share your NFT
        </p>
        <button
          onClick={handleCopy}
          className="my-2 border-2 border-proved-100 bg-proved-300 hover:bg-gray-700 rounded-md p-4 text-left text-white w-full break-words"
        >
          {message}
        </button>
        {copied && (
          <div className="my-2 block text-gray-500 text-center">Copied!</div>
        )}
        <div className="px-4 py-3 bg-transparent text-center sm:px-6">
          <a
            target="_blank"
            className="mr-2 text-center inline-block align-top"
            onClick={openDiscord}
          >
            <div className="rounded-full h-8 w-8 bg-[#5865F2] flex justify-center items-center">
              <DiscordLogo />
            </div>
          </a>
          <div className="mr-2 text-center inline-block align-top">
            <TwitterShareButton
              url={messageTwitter}
              title=""
              onClick={trackShare("twitter")}
            >
              <TwitterIcon size={32} round />
            </TwitterShareButton>
          </div>
        </div>
      </div>
    </div>
  );
};

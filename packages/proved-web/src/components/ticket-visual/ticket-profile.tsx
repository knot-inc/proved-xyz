import { S3Object } from "API";
import { ProfileImage } from "components/ui/ProfileImage";
import { WalletLogo } from "components/ui/WalletLogo";
import { shortenName } from "utils/userName";

type Props = {
  name?: string;
  walletname?: string;
  profileImage?: S3Object;
};

export default function TicketProfile({
  name = "Your Name",
  profileImage,
  walletname = "0x123456789",
}: Props) {
  const isLongName = name.length > 15;
  return (
    <div className="flex flex-col items-left ml-2 mr-10 sm:mr-20">
      <ProfileImage size={64} profileImage={profileImage} />
      <p
        className={`${
          isLongName ? "text-sm" : "text-base sm:text-xl"
        } font-semibold mb-2 mt-3`}
      >
        <span className={"flex items-center rounded relative"}>{name}</span>
      </p>
      <div className=" text-xs">
        <span className={"flex items-center relative"}>
          <WalletLogo />
          <div className="px-2">{shortenName(walletname)}</div>
        </span>
      </div>
    </div>
  );
}

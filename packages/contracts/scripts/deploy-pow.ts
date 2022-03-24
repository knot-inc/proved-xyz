import { ethers, upgrades } from "hardhat";
import * as PowCon from "@/typechain/Pow";

async function main() {
  // this is for
  const gnosisSafe =
    process.env.ENV === "prod"
      ? "0x8B80762e3b8A56E36a04a8DBF46eBCEF6e19cE3b"
      : "0x4BACf63107d0B56D6E0BD00945DFdd0ddfF49c45";

  const [deployer] = await ethers.getSigners();

  console.log("Deploying contracts with the account:", deployer.address);

  console.log("Account balance:", (await deployer.getBalance()).toString());
  // We get the contract to deploy
  const PowContract = await ethers.getContractFactory("PoW");
  const pow = (await upgrades.deployProxy(
    PowContract,
    [
      "Proved",
      "PROVED",
      process.env.ENV === "prod"
        ? "https://www.assetproved.com/public/proved/"
        : "https://provedcdkstack-dev-s3s3imagebucket90afec10-530s8rgn9kbj.s3.us-west-2.amazonaws.com/public/proved/",
    ],
    {
      initializer: "initialize",
    }
  )) as PowCon.PoW;

  console.log("Pow deployed to:", pow.address);

  // Required only once
  // The owner of the ProxyAdmin can upgrade our contracts
  // await upgrades.admin.transferProxyAdminOwnership(gnosisSafe);
  // console.log("Transferred ownership of ProxyAdmin to:", gnosisSafe);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});

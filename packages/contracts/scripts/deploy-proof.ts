import { ethers, upgrades } from "hardhat";
import * as ProofCon from "@/typechain/ProofContract";

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
  const ProofContract = await ethers.getContractFactory("ProofContract");
  const proof = (await upgrades.deployProxy(ProofContract, [], {
    initializer: "initialize",
  })) as ProofCon.ProofContract;

  console.log("Proof deployed to:", proof.address);

  // The owner of the ProxyAdmin can upgrade our contracts
  await upgrades.admin.transferProxyAdminOwnership(gnosisSafe);
  console.log("Transferred ownership of ProxyAdmin to:", gnosisSafe);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});

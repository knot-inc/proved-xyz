import { ethers } from "hardhat";

async function main() {
  const [deployer] = await ethers.getSigners();

  console.log("transaction Counts:", await deployer.getTransactionCount());
  const provider = ethers.provider;
  console.log(
    "Transaction receipt:",
    await provider.getTransaction(
      // Replace with an address of which you want to see the receipt
      "0xd1976f2de6f5547fbf875e18428f4029cb3ad47a54c92a27eea93a59d63ef661"
    )
  );
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});

import fs from "fs";

const typechainDir = `${__dirname}/../packages/contracts/typechain`;
const layerDir = `${__dirname}/../packages/cdk/functions/layers/web3/nodejs/typechain`;
async function main() {
  const contracts = fs.readdirSync(typechainDir);
  contracts.forEach((f) => {
    if (
      !fs.lstatSync(`${typechainDir}/${f}`).isDirectory() &&
      f !== "index.ts" &&
      f !== "hardhat.d.ts"
    ) {
      fs.copyFileSync(`${typechainDir}/${f}`, `${layerDir}/${f}`);
      console.log(`copied to ${layerDir}/${f}`);
    }
  });
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});

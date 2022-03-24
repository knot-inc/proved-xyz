import fs from "fs";

const contractDir = `${__dirname}/../packages/contracts/abi/contracts`;
const layerDir = `${__dirname}/../packages/cdk/functions/layers/web3/nodejs`;
async function main() {
  const contracts = fs.readdirSync(contractDir);
  contracts.forEach((f) => {
    const fileName = fs.readdirSync(`${contractDir}/${f}`);
    console.log("Contract: ", fileName);
    fs.copyFileSync(
      `${contractDir}/${f}/${fileName}`,
      `${layerDir}/${fileName}`
    );
    console.log(`copied to ${layerDir}/${fileName}`);
  });
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});

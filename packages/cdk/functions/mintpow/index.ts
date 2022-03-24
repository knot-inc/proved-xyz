import { powABI } from "/opt/nodejs/contractABIs";
import { BigNumber, ethers } from "/opt/nodejs/ethers-utils";
import { getSecret } from "/opt/nodejs/secretManager";
import { PoW } from "functions/layers/web3/nodejs/typechain";
import { StepEvent } from "@/stepTypes";
import { getFastestGas } from "/opt/nodejs/ethGasStation";
import { calcMaxFeePerGas } from "/opt/nodejs/calculateGas";

exports.handler = async function (event: StepEvent): Promise<StepEvent> {
  const address = event.address;
  const status = event.Status;
  const proofId = event.proofId;
  if (status === 0) {
    return {
      address: "x",
      proofId,
      Message: `previous function failed`,
      Status: 0,
    };
  }

  if (!address || !address?.startsWith("0x")) {
    return {
      address: "x",
      proofId: event.proofId,
      Message: `no address`,
      Status: 0,
    };
  }
  const walletKey = await getSecret(process.env.DEV_KEY as string);
  const alchemyKey = await getSecret(process.env.API_KEY as string);

  const provider = new ethers.providers.AlchemyProvider(
    process.env.NETWORK,
    alchemyKey
  );
  // https://github.com/ethers-io/ethers.js/issues/461
  // wallet should be in contract
  const wallet = new ethers.Wallet(walletKey).connect(provider);

  const contract = new ethers.Contract(
    process.env.POW_CONTRACT as string,
    powABI,
    wallet
  ) as PoW;

  let fastestGasFee;
  let maxPriorityFeePerGas: number | BigNumber | undefined;
  let maxFeePerGas: number | BigNumber | undefined;
  if (process.env.ENV !== "dev") {
    fastestGasFee = await getFastestGas();
    console.log("fastest fee", fastestGasFee);
  }
  if (fastestGasFee) {
    // should be in wei. increase tip 30 % more to make sure the transaction completes
    maxPriorityFeePerGas = calcMaxFeePerGas({ fastestGasFee, tipRate: 30 });
    maxFeePerGas = maxPriorityFeePerGas + 2_500_000_000;
    console.log("max fee", maxPriorityFeePerGas);
  } else {
    // fallback
    const fee = await provider.getFeeData();
    console.log("fallback fee", fee?.maxPriorityFeePerGas?.toNumber());
    maxPriorityFeePerGas = fee?.maxPriorityFeePerGas || undefined;
    maxFeePerGas = maxPriorityFeePerGas?.add(2_500_000_000);
  }

  try {
    const transaction = await contract.mintToken(address, event.proofId, {
      maxPriorityFeePerGas,
      maxFeePerGas,
    });
    const nonce = transaction.nonce;
    return {
      ...event,
      nftTxHash: transaction.hash,
      Message: `Success`,
      powNonce: nonce,
      Status: 1,
    };
  } catch (e) {
    return {
      ...event,
      Message: `Failed to Mint ${e}`,
      Status: 0,
    };
  }
};

import { proofABI } from "/opt/nodejs/contractABIs";
import { BigNumber, ethers } from "/opt/nodejs/ethers-utils";
import { ProofContract } from "functions/layers/web3/nodejs/typechain";
import { getSecret } from "/opt/nodejs/secretManager";
import { proofGet } from "/opt/nodejs/dynamodb-utils";
import { getFastestGas } from "/opt/nodejs/ethGasStation";
import { StepEvent, StepInput } from "@/stepTypes";
import { calcMaxFeePerGas } from "/opt/nodejs/calculateGas";
const { PROOF_TABLE_NAME } = process.env;

exports.handler = async function (event: StepInput): Promise<StepEvent> {
  const address = event.address;
  const proofId = event.proofId;
  if (!address || !address?.startsWith("0x")) {
    return {
      address: "x",
      proofId,
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
    process.env.PROOF_CONTRACT as string,
    proofABI,
    wallet
  ) as ProofContract;

  try {
    const item = await proofGet(proofId as string, PROOF_TABLE_NAME as string);
    console.log(item);
    if (!item) {
      return {
        address,
        proofId,
        Message: `Failed Get item with proofId ${proofId}`,
        Status: 0,
      };
    }

    if (item.txHash && item.txHash.length > 0) {
      // If it's cancelled we can assume proof has been committed
      return {
        ...event,
        txHash: item.txHash,
        Message: `Success`,
        Status: 1,
      };
    }
    const startDate = Date.parse(item.startDate || "");
    const endDate = Date.parse(item.endDate || "");
    const firstProver = item.provers![0]?.id as string;
    console.log("====", startDate, endDate);

    let fastestGasFee;
    let maxPriorityFeePerGas: number | BigNumber | undefined;
    let maxFeePerGas: number | BigNumber | undefined;
    if (process.env.ENV !== "dev") {
      fastestGasFee = await getFastestGas();
    }
    console.log("fastest fee", fastestGasFee);
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

    const tx = await contract.addProof(
      proofId as string,
      firstProver,
      Number.isNaN(startDate) ? 0 : startDate,
      Number.isNaN(endDate) ? 0 : endDate,
      "",
      address,
      { maxPriorityFeePerGas, maxFeePerGas }
    );
    const nonce = tx.nonce;
    return {
      ...event,
      txHash: tx.hash,
      Message: `Success`,
      proofClaimNonce: nonce,
      Status: 1,
    };
  } catch (e) {
    return {
      address,
      proofId,
      Message: `Failed to Claim ${e}`,
      Status: 0,
    };
  }
};

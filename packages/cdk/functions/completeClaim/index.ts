import { proofUpdate } from "/opt/nodejs/dynamodb-utils";
import { ProofUpdateInput, ProvedStatus } from "@/graphql";
import { StepEvent } from "@/stepTypes";
const { PROOF_TABLE_NAME } = process.env;

const headers = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Credentials": true,
  "Content-Type": "text/plain",
};

export const handler = async function (event: StepEvent): Promise<StepEvent> {
  const proofId = event.proofId;

  if (!proofId) {
    return {
      address: "x",
      proofId: "x",
      Message: `no proofId`,
      Status: 0,
    };
  }

  const input: ProofUpdateInput = {
    id: proofId,
    status: ProvedStatus.Minted,
    nftTxHash: event.nftTxHash,
    txHash: event.txHash,
  };

  await proofUpdate(input, PROOF_TABLE_NAME as string);

  return {
    address: event.address,
    proofId,
    Message: `Success`,
    Status: 1,
  };
};

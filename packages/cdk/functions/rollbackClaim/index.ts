import { proofUpdate } from "/opt/nodejs/dynamodb-utils";
import { ProofUpdateInput, ProvedStatus } from "@/graphql";
import { StepEvent } from "@/stepTypes";
const { PROOF_TABLE_NAME } = process.env;

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
    status: ProvedStatus.Canceled,
    txHash: event.txHash || "",
  };

  await proofUpdate(input, PROOF_TABLE_NAME as string);

  return {
    ...event,
    Message: `Success`,
    Status: 1,
  };
};

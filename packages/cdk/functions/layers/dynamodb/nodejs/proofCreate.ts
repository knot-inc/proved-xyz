import * as AWS from "aws-sdk";
import crypto from "crypto";
import { Proof, ProofCreateInput, ProvedStatus } from "@/graphql";
const docClient = new AWS.DynamoDB.DocumentClient();

export const proofCreate = async (
  input: ProofCreateInput,
  TableName: string
) => {
  const id = crypto.randomBytes(16).toString("hex");
  const orgInput = AWS.DynamoDB.Converter.input(input.org);
  const Item = {
    createdAt: new Date().toISOString(),
    endDate: input.endDate,
    id,
    org: orgInput,
    ownerId: input.ownerId,
    role: input.role,
    startDate: input.startDate,
    status: ProvedStatus.ClaimedProposal,
  };
  const putParams: AWS.DynamoDB.DocumentClient.PutItemInput = {
    TableName,
    Item,
  };
  await docClient.put(putParams).promise();
  return {
    ...Item,
    org: input.org,
  };
};

import { Proof } from "@/graphql";
import * as AWS from "aws-sdk";
const docClient = new AWS.DynamoDB.DocumentClient();

export const proofGet = async (
  id: string,
  TableName: string
): Promise<Proof> => {
  const params: AWS.DynamoDB.DocumentClient.GetItemInput = {
    TableName,
    Key: {
      id,
    },
  };
  const r = await docClient.get(params).promise();
  const provers = AWS.DynamoDB.Converter.output(r.Item?.provers) || [];
  const org = AWS.DynamoDB.Converter.output(r.Item?.org);
  const data = {
    ...r.Item,
    provers,
    org,
  };
  return data as Proof;
};

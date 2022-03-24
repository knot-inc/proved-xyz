import { ProofDetail, User } from "@/graphql";
import * as AWS from "aws-sdk";
const docClient = new AWS.DynamoDB.DocumentClient();

export const proofDetailGet = async (
  id: string,
  ProofTableName: string,
  UserTableName: string
): Promise<ProofDetail> => {
  const params: AWS.DynamoDB.DocumentClient.GetItemInput = {
    TableName: ProofTableName,
    Key: {
      id,
    },
  };
  const r = await docClient.get(params).promise();
  const provers = AWS.DynamoDB.Converter.output(r.Item?.provers) || [];
  const org = AWS.DynamoDB.Converter.output(r.Item?.org);

  // OwnerInfo
  const userParams: AWS.DynamoDB.DocumentClient.GetItemInput = {
    TableName: UserTableName,
    Key: {
      id: r.Item?.ownerId,
    },
  };
  const result = await docClient.get(userParams).promise();
  const profileImage = AWS.DynamoDB.Converter.output(result.Item?.profileImage);

  const { orgs, nonce, ...omitOrgs } = result.Item as User;
  const owner = {
    ...omitOrgs,
    profileImage,
  };
  const data = {
    ...r.Item,
    provers,
    org,
    owner,
  } as ProofDetail;
  return data;
};

import * as AWS from "aws-sdk";
import { User } from "@/graphql";

const docClient = new AWS.DynamoDB.DocumentClient();

export const userGet = async (
  address: string,
  TableName: string
): Promise<User> => {
  const params: AWS.DynamoDB.DocumentClient.GetItemInput = {
    TableName,
    Key: {
      id: address,
    },
  };
  const result = await docClient.get(params).promise();
  const profileImage = AWS.DynamoDB.Converter.output(result.Item?.profileImage);
  const orgs = AWS.DynamoDB.Converter.output(result?.Item?.orgs);
  return {
    ...result.Item,
    profileImage,
    orgs,
  } as User;
};

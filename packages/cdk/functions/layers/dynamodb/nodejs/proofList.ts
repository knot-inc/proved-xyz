import { Proof } from "@/graphql";
import * as AWS from "aws-sdk";
const docClient = new AWS.DynamoDB.DocumentClient();

export const proofList = async (
  id: string,
  TableName: string
): Promise<Proof[] | undefined> => {
  const params: AWS.DynamoDB.DocumentClient.QueryInput = {
    TableName,
    IndexName: "ownerIndex",
    KeyConditionExpression: "ownerId = :id",
    ExpressionAttributeValues: {
      ":id": id,
    },
  };
  const r = await docClient.query(params).promise();
  const convertedData = r.Items?.map((item) => {
    const provers = AWS.DynamoDB.Converter.output(item?.provers) || [];
    const org = AWS.DynamoDB.Converter.output(item?.org);
    return {
      ...item,
      provers,
      org,
    } as Proof;
  });
  return convertedData;
};

import { UserUpdateInput } from "@/graphql";
import * as AWS from "aws-sdk";
const docClient = new AWS.DynamoDB.DocumentClient();

export const userUpdate = async (input: UserUpdateInput, TableName: string) => {
  let orgsInput;
  if (input.orgs) {
    orgsInput = AWS.DynamoDB.Converter.input(input.orgs);
  }
  const params: AWS.DynamoDB.DocumentClient.UpdateItemInput = {
    TableName,
    Key: {
      id: input.id,
    },
    ExpressionAttributeValues: {},
    ExpressionAttributeNames: {},
    UpdateExpression: "",
    ReturnValues: "ALL_NEW",
  };

  let prefix = "set ";
  let attributes = Object.keys(input);
  let ExpressionAttributeValues: { [key: string]: string } = {};
  let ExpressionAttributeNames: { [key: string]: string } = {};
  for (let i = 0; i < attributes.length; i++) {
    let attribute = attributes[i];
    if (
      attribute !== "id" &&
      attribute !== "profileImage" &&
      attribute !== "orgs"
    ) {
      params["UpdateExpression"] +=
        prefix + "#" + attribute + " = :" + attribute;
      // @ts-ignore
      ExpressionAttributeValues[":" + attribute] = input[`${attribute}`];
      ExpressionAttributeNames["#" + attribute] = attribute;
      prefix = ", ";
    }
    if (attribute == "profileImage") {
      const profileImageInput = AWS.DynamoDB.Converter.input(
        input.profileImage
      );
      params["UpdateExpression"] += prefix + "#profileImage = :profileImage";
      // @ts-ignore
      ExpressionAttributeValues[":profileImage"] = profileImageInput;
      ExpressionAttributeNames["#profileImage"] = "profileImage";
      prefix = ", ";
    }
    if (attribute == "orgs") {
      params["UpdateExpression"] += prefix + "#orgs = :orgs";
      // @ts-ignore
      ExpressionAttributeValues[":orgs"] = orgsInput;
      ExpressionAttributeNames["#orgs"] = "orgs";
      prefix = ", ";
    }
  }
  params.ExpressionAttributeNames = ExpressionAttributeNames;
  params.ExpressionAttributeValues = ExpressionAttributeValues;
  const r = await docClient.update(params).promise();
  const profileImage = AWS.DynamoDB.Converter.output(
    r.Attributes?.profileImage
  );
  return {
    ...r.Attributes,
    profileImage,
    orgs: input.orgs,
  };
};

import * as AWS from "aws-sdk";
import { ProofUpdateInput, UserInput } from "@/graphql";
const docClient = new AWS.DynamoDB.DocumentClient();

export const proofUpdate = async (
  input: ProofUpdateInput,
  TableName: string
) => {
  // provers is array; requires special update
  let proversInput;
  let orgInput;
  if (input.prover) {
    const params: AWS.DynamoDB.DocumentClient.GetItemInput = {
      TableName,
      Key: {
        id: input.id,
      },
    };
    const result = await docClient.get(params).promise();
    const provers: UserInput[] =
      AWS.DynamoDB.Converter.output(result.Item?.provers) || [];
    // check duplication
    const hasNoDup =
      provers.find((p) => p.id === input.prover?.id) === undefined;
    if (hasNoDup) {
      provers.push(input.prover);
    }
    proversInput = AWS.DynamoDB.Converter.input(provers);
  }
  if (input.org) {
    orgInput = AWS.DynamoDB.Converter.input(input.org);
  }
  let params: AWS.DynamoDB.DocumentClient.UpdateItemInput = {
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
    if (attribute !== "id" && attribute !== "prover" && attribute != "org") {
      params["UpdateExpression"] +=
        prefix + "#" + attribute + " = :" + attribute;
      // @ts-ignore
      ExpressionAttributeValues[":" + attribute] = input[`${attribute}`];
      ExpressionAttributeNames["#" + attribute] = attribute;
      prefix = ", ";
    }
    if (attribute == "prover") {
      params["UpdateExpression"] += prefix + "#provers = :provers";
      // @ts-ignore
      ExpressionAttributeValues[":provers"] = proversInput;
      ExpressionAttributeNames["#provers"] = "provers";
      prefix = ", ";
    }
    if (attribute == "org") {
      params["UpdateExpression"] += prefix + "#org = :org";
      // @ts-ignore
      ExpressionAttributeValues[":org"] = orgInput;
      ExpressionAttributeNames["#org"] = "org";
      prefix = ", ";
    }
  }
  params.ExpressionAttributeNames = ExpressionAttributeNames;
  params.ExpressionAttributeValues = ExpressionAttributeValues;
  const r = await docClient.update(params).promise();
  const provers = AWS.DynamoDB.Converter.output(r.Attributes?.provers) || [];
  const org = AWS.DynamoDB.Converter.output(r.Attributes?.org) || [];
  const data = {
    ...r.Attributes,
    provers,
    org,
  };
  return data;
};

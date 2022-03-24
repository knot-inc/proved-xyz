import * as AWS from "aws-sdk";
import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import * as crypto from "crypto";

const { USER_TABLE_NAME } = process.env;
const docClient = new AWS.DynamoDB.DocumentClient();

const headers = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Credentials": true,
  "Content-Type": "text/plain",
};
exports.handler = async function (
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> {
  const address = event.queryStringParameters?.address;
  console.log("===== address", { address });
  if (!address) {
    return {
      statusCode: 404,
      headers,
      body: `no address`,
    };
  }
  const params: AWS.DynamoDB.DocumentClient.QueryInput = {
    TableName: USER_TABLE_NAME as string,
    KeyConditionExpression: "id = :address",
    ExpressionAttributeValues: {
      ":address": address,
    },
  };
  try {
    const result = await docClient.query(params).promise();
    const { Items } = result;
    console.log("===== Items", Items);
    if (Items && Items.length > 0) {
      return {
        statusCode: 200,
        headers,
        body: JSON.stringify(Items[0]),
      };
    }

    // Create New nonce
    const nonce = crypto.randomBytes(16).toString("hex");
    const createdAt = new Date().toISOString();
    const putParams: AWS.DynamoDB.DocumentClient.PutItemInput = {
      TableName: USER_TABLE_NAME as string,
      Item: {
        id: address,
        nonce,
        createdAt,
      },
    };
    await docClient.put(putParams).promise();

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        nonce,
        createdAt,
        id: address,
      }),
    };
  } catch (e) {
    return {
      statusCode: 404,
      headers,
      body: `Failed Get: ${e}`,
    };
  }
};

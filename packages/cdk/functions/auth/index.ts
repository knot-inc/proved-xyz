import * as AWS from "aws-sdk";
import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import { validateSign } from "./validateSign";

const { USER_TABLE_NAME } = process.env;
const docClient = new AWS.DynamoDB.DocumentClient();
const cognitoIdentity = new AWS.CognitoIdentity();
const headers = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Credentials": true,
};

interface User {
  id: string;
  nonce: string;
}
exports.handler = async function (
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> {
  const requestBody = JSON.parse(event.body || "");
  const address = requestBody?.address;
  const signature = requestBody?.signature;
  console.log("===== request", event.body);
  try {
    const result = await queryUser(address);
    if (!result.Items || result.Items.length == 0) {
      return {
        statusCode: 404,
        headers,
        body: "No nonce",
      };
    }

    const user = result.Items[0] as User;
    if (!validateSign({ address, signature, nonce: user.nonce })) {
      return {
        statusCode: 404,
        headers,
        body: "Signature mismatch",
      };
    }

    const IdToken = await getIdToken(address);

    console.log("identityId", IdToken.IdentityId);
    console.log("token", IdToken.Token);

    // TODO: consider updating nonce after federatedSignIn

    return {
      headers,
      statusCode: 200,
      body: JSON.stringify(IdToken),
    };
  } catch (e) {
    return {
      headers,
      statusCode: 404,
      body: `Unknown error: ${e}`,
    };
  }
};

const queryUser = async (
  address: string
): Promise<AWS.DynamoDB.DocumentClient.QueryOutput> => {
  const params: AWS.DynamoDB.DocumentClient.QueryInput = {
    TableName: USER_TABLE_NAME as string,
    KeyConditionExpression: "id = :address",
    ExpressionAttributeValues: {
      ":address": address,
    },
  };
  return await docClient.query(params).promise();
};

const getIdToken = async (address: string) => {
  const providerName = process.env.DEVELOPER_PROVIDER_NAME as string;
  const param = {
    IdentityPoolId: process.env.IDENTITY_POOL_ID as string,
    Logins: {
      [`${providerName}`]: address,
    },
  };
  return cognitoIdentity.getOpenIdTokenForDeveloperIdentity(param).promise();
};

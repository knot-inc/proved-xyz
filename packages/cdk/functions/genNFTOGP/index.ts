import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import { proofGet } from "/opt/nodejs/dynamodb-utils";
const { PROOF_TABLE_NAME } = process.env;

const headers = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Credentials": true,
};

export const handler = async function (
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> {
  const proofId = event.queryStringParameters?.proofId;

  if (!proofId) {
    return {
      statusCode: 404,
      headers,
      body: "No proofId specified",
    };
  }

  const proof = await proofGet(proofId, PROOF_TABLE_NAME as string);
  if (!proof) {
    return {
      statusCode: 404,
      headers,
      body: "proof does not exist",
    };
  }
  const imagePath = `public/nft-image/${proof.ownerId}/${proofId}.png`;
  const imageUrl = `https://${
    process.env.BUCKET as string
  }.s3.us-west-2.amazonaws.com/${imagePath}`;
  if (imageUrl) {
    return {
      headers,
      statusCode: 200,
      body: JSON.stringify({
        imageUrl,
      }),
    };
  }
  return {
    statusCode: 404,
    headers,
    body: "image does not exist",
  };
};

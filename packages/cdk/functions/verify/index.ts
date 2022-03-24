import * as AWS from "aws-sdk";
import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import fetch from "node-fetch";
import { getSecret } from "/opt/nodejs/secretManager";
import { userUpdate, userGet } from "/opt/nodejs/dynamodb-utils";
import { OrgInput, UserUpdateInput } from "@/graphql";
const s3 = new AWS.S3();
const { USER_TABLE_NAME } = process.env;

const headers = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Credentials": true,
};

interface OAuth {
  token_type: string;
  access_token: string;
  error?: string;
  error_description?: string;
}

interface UserResult {
  avatar: string;
  email: string;
  id: string;
  username: string;
}
interface Guild {
  id: string;
  icon: string;
  owner: boolean;
  name: string;
}

export const handler = async function (
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> {
  const requestBody = JSON.parse(event.body || "");
  const code = requestBody?.code;
  const address = requestBody?.address;
  const isLocal = requestBody?.isLocal;
  const path = requestBody?.path;

  if (!code) {
    return {
      statusCode: 404,
      headers,
      body: "No code specified",
    };
  }
  const clientId = await getSecret(process.env.DISCORD_CLIENT as string);
  const clientSecret = await getSecret(
    process.env.DISCORD_CLIENT_SECRET as string
  );
  const redirect_uri = isLocal
    ? `http://localhost:3000/${path}`
    : (process.env.REDIRECT_URL as string) + path;

  try {
    const oauthResult = await fetch("https://discord.com/api/oauth2/token", {
      method: "POST",
      body: new URLSearchParams({
        client_id: clientId,
        client_secret: clientSecret,
        code,
        grant_type: "authorization_code",
        redirect_uri,
        scope: "identify",
      }),
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
    });

    const oauthData = (await oauthResult.json()) as OAuth;
    if (oauthData.error) {
      throw Error(oauthData.error_description);
    }

    const userResult = (await (
      await fetch("https://discord.com/api/users/@me", {
        headers: {
          authorization: `${oauthData.token_type} ${oauthData.access_token}`,
        },
      })
    ).json()) as UserResult;

    const guildsResult = (await (
      await fetch("https://discord.com/api/users/@me/guilds", {
        headers: {
          authorization: `${oauthData.token_type} ${oauthData.access_token}`,
        },
      })
    ).json()) as Guild[];

    const user = await userGet(address, USER_TABLE_NAME as string);
    // Upload user avatar
    const imageUrl = `https://cdn.discordapp.com/avatars/${userResult.id}/${userResult.avatar}`;
    const image = await fetch(imageUrl);

    const s3Result = await s3
      .upload({
        Bucket: process.env.BUCKET as string,
        Body: Buffer.from(await image.arrayBuffer()),
        Key: `public/avatar/${user.id}.png`,
      })
      .promise();

    const orgsInput: OrgInput[] = guildsResult.map(
      (guild: { id: string; icon: string; owner: boolean; name: string }) => ({
        id: guild.id,
        discordIcon: guild.icon,
        isOwner: guild.owner,
        name: guild.name,
      })
    );
    const userUpdateInput: UserUpdateInput = {
      id: address,
      name: userResult.username,
      email: userResult?.email || "",
      verified: true,
      subscribeMessage: true,
      profileImage: {
        bucket: s3Result.Bucket,
        key: s3Result.Key,
        region: "us-west-2",
      },
      orgs: orgsInput,
    };

    // Store data
    const r = await userUpdate(userUpdateInput, USER_TABLE_NAME as string);
    return {
      headers,
      statusCode: 200,
      body: JSON.stringify({
        name: userResult.username,
        email: userResult?.email || "",
        profileImage: r.profileImage,
      }),
    };
  } catch (e) {
    return {
      headers,
      statusCode: 404,
      body: `Unknown error: ${e}`,
    };
  }
};

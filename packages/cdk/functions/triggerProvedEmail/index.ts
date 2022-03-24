import { ProvedStatus } from "@/graphql";
import { DynamoDBStreamEvent } from "aws-lambda";
import * as AWS from "aws-sdk";
import { escapeHTML } from "./escapeHTML";
import { sendEmail } from "./sendEmail";
import { userGet } from "/opt/nodejs/dynamodb-utils";
export const handler = async function (
  event: DynamoDBStreamEvent
): Promise<unknown> {
  const link =
    process.env.ENV === "prod"
      ? "https://www.proved.xyz"
      : "https://dev.d2sndpe29tmpgb.amplifyapp.com";
  await Promise.all(
    event.Records.map(async (record) => {
      if (record.eventName === "MODIFY") {
        const oldStatus = AWS.DynamoDB.Converter.output(
          record.dynamodb?.OldImage?.status as AWS.DynamoDB.AttributeMap
        );
        const newStatus = AWS.DynamoDB.Converter.output(
          record.dynamodb?.NewImage?.status as AWS.DynamoDB.AttributeMap
        );
        // When proved by someone
        if (
          newStatus === ProvedStatus.Proved &&
          oldStatus === ProvedStatus.ClaimedProposal
        ) {
          const ownerId = AWS.DynamoDB.Converter.output(
            record.dynamodb?.NewImage?.ownerId as AWS.DynamoDB.AttributeMap
          );
          const user = await userGet(
            ownerId,
            process.env.USER_TABLE_NAME as string
          );

          if (!user?.subscribeMessage) {
            return;
          }

          const id = AWS.DynamoDB.Converter.output(
            record.dynamodb?.NewImage?.id as AWS.DynamoDB.AttributeMap
          );
          const data = AWS.DynamoDB.Converter.unmarshall(
            record.dynamodb?.NewImage as AWS.DynamoDB.AttributeMap
          );
          const provers = AWS.DynamoDB.Converter.output(data.provers);
          try {
            if (user.email && user.name && provers[0]) {
              const email = escapeHTML(user.email);
              const name = escapeHTML(user.name);
              const proverName = escapeHTML(provers[0].name);
              const textMessage = `Congrats! ${proverName} proved your contribution. Access the following link to mint your NFT: ${link}/proofdetail/${id}`;
              const htmlMessage = `<p>Congrats! ${proverName} proved your contribution.</p><p>Access the following link to mint your NFT:</p><a class="ulink" href="${link}/proofdetail/${id}" target="_blank">${link}/proofdetail/${id}</a>`;
              await sendEmail({
                baseUrl: link,
                email,
                htmlMessage,
                id: user.id,
                name,
                textMessage,
                title: "Your contribution is approved!",
              });
            }
          } catch (e) {
            console.log("message error", e);
          }
        }
      }
    })
  ).catch((e) => {
    console.log("Error Promise.all", e);
  });

  return {};
};

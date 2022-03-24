import { ProvedStatus } from "@/graphql";
import { DynamoDBStreamEvent } from "aws-lambda";
import * as AWS from "aws-sdk";
export const handler = async function (
  event: DynamoDBStreamEvent
): Promise<unknown> {
  await Promise.all(
    event.Records.map(async (record) => {
      if (record.eventName === "MODIFY") {
        const oldStatus = AWS.DynamoDB.Converter.output(
          record.dynamodb?.OldImage?.status as AWS.DynamoDB.AttributeMap
        );
        const newStatus = AWS.DynamoDB.Converter.output(
          record.dynamodb?.NewImage?.status as AWS.DynamoDB.AttributeMap
        );
        console.log("==== status", newStatus, oldStatus);
        if (
          newStatus === ProvedStatus.TriggeredMint &&
          oldStatus !== ProvedStatus.TriggeredMint
        ) {
          const id = AWS.DynamoDB.Converter.output(
            record.dynamodb?.NewImage?.id as AWS.DynamoDB.AttributeMap
          );
          const ownerId = AWS.DynamoDB.Converter.output(
            record.dynamodb?.NewImage?.ownerId as AWS.DynamoDB.AttributeMap
          );
          console.log(
            "=== start minting",
            id,
            ownerId,
            process.env.STATE_MACHINE_ARN as string
          );
          const params: AWS.StepFunctions.StartExecutionInput = {
            stateMachineArn: process.env.STATE_MACHINE_ARN as string,
            input: JSON.stringify({
              address: ownerId,
              proofId: id,
            }),
          };
          try {
            const stepfunctions = new AWS.StepFunctions();
            const result = await stepfunctions.startExecution(params).promise();
            console.log(result.$response);
          } catch (e) {
            console.log("==== step error", e);
          }
        }
      }
    })
  ).catch((e) => {
    console.log("==== error Promise.all", e);
  });

  return {};
};

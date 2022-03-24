import {
  Aws,
  aws_lambda_nodejs as lambda_nodejs,
  aws_dynamodb as dynamodb,
  aws_iam as iam,
  aws_lambda as lambda,
} from "aws-cdk-lib";
import { DynamoEventSource } from "aws-cdk-lib/aws-lambda-event-sources";
import { Construct } from "constructs";
import * as path from "path";
import { deployEnv } from "./envSpecific";

export interface MailDeliverySetupProp {
  dbUtilLayer: lambda.LayerVersion;
  proofTable: dynamodb.ITable;
  userTable: dynamodb.ITable;
}
export class MailDeliverySetup extends Construct {
  public readonly triggerProvedEmailLambda: lambda_nodejs.NodejsFunction;

  constructor(scope: Construct, id: string, props: MailDeliverySetupProp) {
    super(scope, id);

    // Mail handler
    const triggerProvedEmailLambda = new lambda_nodejs.NodejsFunction(
      this,
      "Trigger Email",
      {
        runtime: lambda.Runtime.NODEJS_14_X,
        handler: "handler",
        entry: path.join(
          `${__dirname}/../`,
          "functions",
          "triggerProvedEmail/index.ts"
        ),
        environment: {
          ENV: deployEnv(),
          USER_TABLE_NAME: props.userTable.tableName,
        },
        bundling: {
          externalModules: [
            "aws-sdk", // Use the 'aws-sdk' available in the Lambda runtime
          ],
        },
        layers: [props.dbUtilLayer],
      }
    );

    props.userTable.grantReadData(triggerProvedEmailLambda);

    triggerProvedEmailLambda.addToRolePolicy(
      new iam.PolicyStatement({
        effect: iam.Effect.ALLOW,
        actions: [
          "ses:SendEmail",
          "ses:SendRawEmail",
          "ses:SendTemplatedEmail",
        ],
        resources: [
          `arn:aws:ses:${Aws.REGION}:${Aws.ACCOUNT_ID}:identity/proved.xyz`,
        ],
      })
    );

    triggerProvedEmailLambda.addEventSource(
      new DynamoEventSource(props.proofTable, {
        startingPosition: lambda.StartingPosition.LATEST,
      })
    );
  }
}

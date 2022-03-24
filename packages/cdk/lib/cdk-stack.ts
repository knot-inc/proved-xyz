import { App, Aws, Stack, StackProps } from "aws-cdk-lib";
import { Effect, PolicyStatement } from "aws-cdk-lib/aws-iam";
import { Construct } from "constructs";
import { AppSyncSetup } from "./appsync-stack";
import { AuthLambdaSetup } from "./auth-lambda-stack";
import { AuthApiSetup } from "./authapi-stack";
import { CloudFrontSetup } from "./cloud-front-stack";
import { CognitoSetup } from "./cognito-stack";
import { DynamoDBSetup } from "./dynamodb-stack";
import { deployEnv, envSpecific } from "./envSpecific";
import { LambdaLayerSetup } from "./layer-stack";
import { S3Setup } from "./s3-stack";
import { Web3LambdaSetup } from "./web3-lambda-stack";
import { MailDeliverySetup } from "./maildelivery-stack";
import { OGPLambdaSetup } from "./ogp-stack";
import { OpenGraphApiSetup } from "./open-image-api-stack";

export class ProvedCdkStack extends Stack {
  constructor(scope: Construct | App, id: string, props?: StackProps) {
    super(scope, id, props);

    // Cognito
    const cognitoStack = new CognitoSetup(this, envSpecific("Proved-Cognito"));

    // DynamoDB
    const dynamoDBStack = new DynamoDBSetup(this, "DynamoDB");

    // S3
    const s3Stack = new S3Setup(this, "S3");

    // Cloud Front setup

    if (deployEnv() === "prod") {
      new CloudFrontSetup(this, "CloudFront", {
        imageBucket: s3Stack.imageBucket,
      });
    }
    // secret manager policy
    const secretManagerPolicy = new PolicyStatement({
      effect: Effect.ALLOW,
      actions: ["secretsmanager:GetSecretValue"],
      resources: [
        `arn:aws:secretsmanager:${Aws.REGION}:${Aws.ACCOUNT_ID}:secret:*`,
      ],
    });

    // LambdaLayer

    const layerStack = new LambdaLayerSetup(this, "LambdaLayer");

    // Lambda
    const authLambdaStack = new AuthLambdaSetup(this, "AuthLambda", {
      dbUtilLayer: layerStack.dbUtilLayer,
      identityPool: cognitoStack.identityPool,
      s3Bucket: s3Stack.imageBucket,
      secretManagerPolicy,
      userTable: dynamoDBStack.userTableV2,
      web3Layer: layerStack.web3Layer,
    });

    new Web3LambdaSetup(this, "Web3Lambda", {
      proofTable: dynamoDBStack.proofTable,
      userTable: dynamoDBStack.userTableV2,
      s3Bucket: s3Stack.imageBucket,
      secretManagerPolicy,
      chromeLayer: layerStack.chromeLayer,
      dbUtilLayer: layerStack.dbUtilLayer,
      web3Layer: layerStack.web3Layer,
    });

    new MailDeliverySetup(this, "MailDelivery", {
      proofTable: dynamoDBStack.proofTable,
      userTable: dynamoDBStack.userTableV2,
      dbUtilLayer: layerStack.dbUtilLayer,
    });

    const ogplambda = new OGPLambdaSetup(this, "OGPLambda", {
      proofTable: dynamoDBStack.proofTable,
      s3Bucket: s3Stack.imageBucket,
      dbUtilLayer: layerStack.dbUtilLayer,
    });

    // API gateway
    new AuthApiSetup(this, "AuthApi", {
      auth: authLambdaStack.authLambda,
      getNonce: authLambdaStack.getNonceLambda,
      verify: authLambdaStack.verifyLambda,
    });

    new OpenGraphApiSetup(this, "OpenGraphApi", {
      genNFTOGP: ogplambda.genNFTOGP,
    });

    // AppSync
    new AppSyncSetup(this, "AppSync", {
      proofTable: dynamoDBStack.proofTable,
      userTable: dynamoDBStack.userTableV2,
      authRole: cognitoStack.userCognitoGroupRole,
      unauthRole: cognitoStack.anonymousCognitoGroupRole,
    });
  }
}

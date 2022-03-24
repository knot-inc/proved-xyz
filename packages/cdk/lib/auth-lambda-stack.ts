import {
  Aws,
  aws_lambda_nodejs as lambda_nodejs,
  aws_dynamodb as dynamodb,
  aws_cognito as cognito,
  aws_lambda as lambda,
  aws_s3 as s3,
  Duration,
} from "aws-cdk-lib";
import { Effect, PolicyStatement } from "aws-cdk-lib/aws-iam";
import { Construct } from "constructs";
import * as path from "path";
import { deployEnv } from "./envSpecific";

export interface AuthLambdaSetupProp {
  identityPool: cognito.CfnIdentityPool;
  s3Bucket: s3.Bucket;
  web3Layer: lambda.LayerVersion;
  dbUtilLayer: lambda.LayerVersion;
  userTable: dynamodb.ITable;
  secretManagerPolicy: PolicyStatement;
}
export class AuthLambdaSetup extends Construct {
  public readonly getNonceLambda: lambda_nodejs.NodejsFunction;
  public readonly authLambda: lambda_nodejs.NodejsFunction;
  public readonly verifyLambda: lambda_nodejs.NodejsFunction;

  constructor(scope: Construct, id: string, props: AuthLambdaSetupProp) {
    super(scope, id);
    this.getNonceLambda = new lambda_nodejs.NodejsFunction(this, "GetNonce", {
      runtime: lambda.Runtime.NODEJS_14_X,
      handler: "handler",
      entry: path.join(`${__dirname}/../`, "functions", "getNonce/index.ts"),
      environment: {
        USER_TABLE_NAME: props.userTable.tableName,
      },
      bundling: {
        externalModules: [
          "aws-sdk", // Use the 'aws-sdk' available in the Lambda runtime
        ],
      },
    });
    props.userTable.grantReadWriteData(this.getNonceLambda);

    this.authLambda = new lambda_nodejs.NodejsFunction(this, "auth", {
      runtime: lambda.Runtime.NODEJS_14_X,
      handler: "handler",
      entry: path.join(`${__dirname}/../`, "functions", "auth/index.ts"),
      environment: {
        USER_TABLE_NAME: props.userTable.tableName,
        IDENTITY_POOL_ID: props.identityPool.ref,
        DEVELOPER_PROVIDER_NAME: props.identityPool
          .developerProviderName as string,
      },
      timeout: Duration.seconds(10),
      bundling: {
        externalModules: [
          "aws-sdk", // Use the 'aws-sdk' available in the Lambda runtime
          "ethers",
        ],
      },
      layers: [props.web3Layer],
    });
    props.userTable.grantReadWriteData(this.authLambda);

    // Cognito access
    this.authLambda.addToRolePolicy(
      new PolicyStatement({
        effect: Effect.ALLOW,
        actions: ["cognito-identity:GetOpenIdTokenForDeveloperIdentity"],
        resources: [
          `arn:aws:cognito-identity:${Aws.REGION}:${Aws.ACCOUNT_ID}:identitypool/${Aws.REGION}:*`,
        ],
      })
    );

    this.verifyLambda = new lambda_nodejs.NodejsFunction(this, "verify", {
      runtime: lambda.Runtime.NODEJS_14_X,
      handler: "handler",
      entry: path.join(`${__dirname}/../`, "functions", "verify/index.ts"),
      environment: {
        BUCKET: props.s3Bucket.bucketName,
        DISCORD_CLIENT: `discord_client_${deployEnv()}`,
        DISCORD_CLIENT_SECRET: `discord_client_secret_${deployEnv()}`,
        REDIRECT_URL:
          deployEnv() === "dev"
            ? "https://dev.d2sndpe29tmpgb.amplifyapp.com/"
            : "https://www.proved.xyz/",
        USER_TABLE_NAME: props.userTable.tableName,
      },
      timeout: Duration.seconds(10),
      memorySize: 256,
      bundling: {
        externalModules: [
          "aws-sdk", // Use the 'aws-sdk' available in the Lambda runtime
        ],
      },
      layers: [props.dbUtilLayer, props.web3Layer],
    });

    this.verifyLambda.addToRolePolicy(props.secretManagerPolicy);
    props.userTable.grantReadWriteData(this.verifyLambda);
    props.s3Bucket.grantReadWrite(this.verifyLambda);
  }
}

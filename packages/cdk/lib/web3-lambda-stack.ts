import {
  aws_dynamodb as ddb,
  aws_iam as iam,
  aws_lambda_nodejs as lambda_nodejs,
  aws_lambda as lambda,
  aws_s3 as s3,
  Duration,
} from "aws-cdk-lib";
import { Effect, PolicyStatement } from "aws-cdk-lib/aws-iam";
import { DynamoEventSource } from "aws-cdk-lib/aws-lambda-event-sources";
import { StateMachine } from "aws-cdk-lib/aws-stepfunctions";
import { Construct } from "constructs";
import * as path from "path";
import { ClaimStateMachineSetup } from "./claim-statemachine-stack";
import { deployEnv } from "./envSpecific";
interface Web3LambdaSetupProps {
  proofTable: ddb.Table;
  userTable: ddb.Table;
  s3Bucket: s3.Bucket;
  chromeLayer: lambda.LayerVersion;
  dbUtilLayer: lambda.LayerVersion;
  web3Layer: lambda.LayerVersion;
  secretManagerPolicy: PolicyStatement;
}
export class Web3LambdaSetup extends Construct {
  public readonly mintLambda: lambda_nodejs.NodejsFunction;
  public readonly claimProofLambda: lambda_nodejs.NodejsFunction;
  public readonly generateImageLambda: lambda_nodejs.NodejsFunction;
  public readonly completeClaimLambda: lambda_nodejs.NodejsFunction;
  public readonly rollbackClaimLambda: lambda_nodejs.NodejsFunction;
  public readonly claimStateMachine: StateMachine;

  constructor(scope: Construct, id: string, props: Web3LambdaSetupProps) {
    super(scope, id);

    const network = deployEnv() === "dev" ? "rinkeby" : "matic"; // Should point to Polgyon on production
    const powContract =
      deployEnv() === "dev"
        ? "0xD4F88515e74d57d09362177dac10017D98a1436c"
        : "0x6bbF732B5d9d364116a10B248b3E09B9ce580C54";
    this.mintLambda = new lambda_nodejs.NodejsFunction(this, "Mint", {
      runtime: lambda.Runtime.NODEJS_14_X,
      handler: "handler",
      entry: path.join(`${__dirname}/../`, "functions", "mintpow/index.ts"),
      environment: {
        ENV: deployEnv(),
        API_KEY: `proved_alchemy_key_${deployEnv()}`,
        DEV_KEY: "proved_dev_pk",
        NETWORK: network,
        POW_CONTRACT: powContract,
      },
      timeout: Duration.seconds(30),
      memorySize: 256,
      bundling: {
        externalModules: [
          "aws-sdk", // Use the 'aws-sdk' available in the Lambda runtime
          "ethers",
        ],
      },
      layers: [props.web3Layer],
    });

    const proofContract =
      deployEnv() === "dev"
        ? "0x2BcAe249AcD9282E050E07009a1B4a7EbA46004C"
        : "0xCe46966A5563e7A4b67118D6634f35d5e33d50e8";
    this.claimProofLambda = new lambda_nodejs.NodejsFunction(
      this,
      "ClaimProof",
      {
        runtime: lambda.Runtime.NODEJS_14_X,
        handler: "handler",
        entry: path.join(
          `${__dirname}/../`,
          "functions",
          "claimProof/index.ts"
        ),
        environment: {
          ENV: deployEnv(),
          API_KEY: `proved_alchemy_key_${deployEnv()}`,
          DEV_KEY: "proved_dev_pk",
          NETWORK: network,
          PROOF_CONTRACT: proofContract,
          PROOF_TABLE_NAME: props.proofTable.tableName,
        },
        timeout: Duration.seconds(30),
        memorySize: 256,
        bundling: {
          externalModules: [
            "aws-sdk", // Use the 'aws-sdk' available in the Lambda runtime
            "ethers",
          ],
        },
        layers: [props.web3Layer, props.dbUtilLayer],
      }
    );

    props.proofTable.grantReadWriteData(this.claimProofLambda);

    // secretmanager access
    this.mintLambda.addToRolePolicy(props.secretManagerPolicy);
    this.claimProofLambda.addToRolePolicy(props.secretManagerPolicy);

    this.generateImageLambda = new lambda_nodejs.NodejsFunction(
      this,
      "GenImage",
      {
        runtime: lambda.Runtime.NODEJS_14_X,
        handler: "handler",
        entry: path.join(`${__dirname}/../`, "functions", "genImage/index.ts"),
        environment: {
          BUCKET: props.s3Bucket.bucketName,
          BUCKET_URL:
            deployEnv() === "dev"
              ? "https://provedcdkstack-dev-s3s3imagebucket90afec10-530s8rgn9kbj.s3.us-west-2.amazonaws.com"
              : "https://www.assetproved.com",
          SITE_URL:
            deployEnv() === "dev"
              ? "https://dev.d2sndpe29tmpgb.amplifyapp.com"
              : "https://www.proved.xyz",
          TX_URL:
            deployEnv() === "dev"
              ? "https://rinkeby.etherscan.io/tx"
              : "https://polygonscan.com/tx",
          PROOF_TABLE_NAME: props.proofTable.tableName,
          USER_TABLE_NAME: props.userTable.tableName,
        },
        timeout: Duration.seconds(30),
        memorySize: 1536,
        bundling: {
          externalModules: [
            "aws-sdk", // Use the 'aws-sdk' available in the Lambda runtime
            "chrome-aws-lambda", // Do not include this to prevent `/var/bin/chrome.br` does not exist error
          ],
        },
        layers: [props.chromeLayer, props.dbUtilLayer],
      }
    );
    props.proofTable.grantReadWriteData(this.generateImageLambda);
    props.userTable.grantReadWriteData(this.generateImageLambda);

    props.s3Bucket.grantReadWrite(this.generateImageLambda);

    this.completeClaimLambda = new lambda_nodejs.NodejsFunction(
      this,
      "CompleteClaim",
      {
        runtime: lambda.Runtime.NODEJS_14_X,
        handler: "handler",
        entry: path.join(
          `${__dirname}/../`,
          "functions",
          "completeClaim/index.ts"
        ),
        environment: {
          PROOF_TABLE_NAME: props.proofTable.tableName,
        },
        bundling: {
          externalModules: [
            "aws-sdk", // Use the 'aws-sdk' available in the Lambda runtime
          ],
        },
        layers: [props.dbUtilLayer],
      }
    );
    props.proofTable.grantReadWriteData(this.completeClaimLambda);

    this.rollbackClaimLambda = new lambda_nodejs.NodejsFunction(
      this,
      "RollbackClaim",
      {
        runtime: lambda.Runtime.NODEJS_14_X,
        handler: "handler",
        entry: path.join(
          `${__dirname}/../`,
          "functions",
          "rollbackClaim/index.ts"
        ),
        environment: {
          PROOF_TABLE_NAME: props.proofTable.tableName,
        },
        bundling: {
          externalModules: [
            "aws-sdk", // Use the 'aws-sdk' available in the Lambda runtime
          ],
        },
        layers: [props.dbUtilLayer],
      }
    );
    props.proofTable.grantReadWriteData(this.rollbackClaimLambda);

    // Step function
    const claimStateMachineSetup = new ClaimStateMachineSetup(
      this,
      "ClaimStateMachineStack",
      {
        claimProofLambda: this.claimProofLambda,
        completeClaimLambda: this.completeClaimLambda,
        generateImageLambda: this.generateImageLambda,
        mintLambda: this.mintLambda,
        rollbackClaimLambda: this.rollbackClaimLambda,
      }
    );

    this.claimStateMachine = claimStateMachineSetup.stateMachine;

    // claim stream handler
    const claimStreamHandler = new lambda_nodejs.NodejsFunction(
      this,
      "ClaimStream Handler",
      {
        runtime: lambda.Runtime.NODEJS_14_X,
        handler: "handler",
        entry: path.join(
          `${__dirname}/../`,
          "functions",
          "claimStream/index.ts"
        ),
        environment: {
          STATE_MACHINE_ARN: this.claimStateMachine.stateMachineArn,
        },
        bundling: {
          externalModules: [
            "aws-sdk", // Use the 'aws-sdk' available in the Lambda runtime
          ],
        },
      }
    );

    // Lambda to trigger step function
    // Executing Claim StateMachine
    claimStreamHandler.addToRolePolicy(
      new PolicyStatement({
        effect: Effect.ALLOW,
        actions: ["states:StartExecution"],
        resources: [this.claimStateMachine.stateMachineArn],
      })
    );

    claimStreamHandler.addEventSource(
      new DynamoEventSource(props.proofTable, {
        startingPosition: lambda.StartingPosition.LATEST,
      })
    );
  }
}

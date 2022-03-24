import {
  aws_lambda_nodejs as lambda_nodejs,
  aws_dynamodb as dynamodb,
  aws_lambda as lambda,
  aws_s3 as s3,
} from "aws-cdk-lib";
import { Construct } from "constructs";
import * as path from "path";

export interface OGPLambdaSetupProp {
  s3Bucket: s3.Bucket;
  dbUtilLayer: lambda.LayerVersion;
  proofTable: dynamodb.ITable;
}
export class OGPLambdaSetup extends Construct {
  public readonly genNFTOGP: lambda_nodejs.NodejsFunction;

  constructor(scope: Construct, id: string, props: OGPLambdaSetupProp) {
    super(scope, id);
    this.genNFTOGP = new lambda_nodejs.NodejsFunction(this, "GenNFTOGP", {
      runtime: lambda.Runtime.NODEJS_14_X,
      handler: "handler",
      entry: path.join(`${__dirname}/../`, "functions", "genNFTOGP/index.ts"),
      environment: {
        BUCKET: props.s3Bucket.bucketName,
        PROOF_TABLE_NAME: props.proofTable.tableName,
      },
      bundling: {
        externalModules: [
          "aws-sdk", // Use the 'aws-sdk' available in the Lambda runtime
        ],
      },
      layers: [props.dbUtilLayer],
    });
    props.proofTable.grantReadData(this.genNFTOGP);
  }
}

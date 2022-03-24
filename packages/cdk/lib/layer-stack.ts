import { aws_lambda as lambda } from "aws-cdk-lib";

import { Construct } from "constructs";

export class LambdaLayerSetup extends Construct {
  public readonly web3Layer: lambda.LayerVersion;
  public readonly chromeLayer: lambda.LayerVersion;
  public readonly dbUtilLayer: lambda.LayerVersion;
  constructor(scope: Construct, id: string) {
    super(scope, id);

    this.web3Layer = new lambda.LayerVersion(this, "Web3Layer", {
      compatibleRuntimes: [
        lambda.Runtime.NODEJS_12_X,
        lambda.Runtime.NODEJS_14_X,
      ],
      code: lambda.Code.fromAsset("functions/layers/web3"),
      description: "web3 components",
    });

    this.chromeLayer = new lambda.LayerVersion(this, "ChromeLayer", {
      compatibleRuntimes: [
        lambda.Runtime.NODEJS_12_X,
        lambda.Runtime.NODEJS_14_X,
      ],
      code: lambda.Code.fromAsset("functions/layers/chrome"),
      description: "chrome components",
    });

    this.dbUtilLayer = new lambda.LayerVersion(this, "DBUtilLayer", {
      compatibleRuntimes: [
        lambda.Runtime.NODEJS_12_X,
        lambda.Runtime.NODEJS_14_X,
      ],
      code: lambda.Code.fromAsset("functions/layers/dynamodb"),
      description: "dynamodb utility components",
    });
  }
}

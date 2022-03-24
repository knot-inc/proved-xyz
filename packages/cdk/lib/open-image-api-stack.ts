import { Construct } from "constructs";
import {
  aws_apigateway as apigateway,
  aws_lambda_nodejs as lambda,
  CfnOutput,
} from "aws-cdk-lib";
import { deployEnv } from "./envSpecific";

interface OpenGraphApiSetupProps {
  genNFTOGP: lambda.NodejsFunction;
}

export class OpenGraphApiSetup extends Construct {
  constructor(scope: Construct, id: string, props: OpenGraphApiSetupProps) {
    super(scope, id);

    const api = new apigateway.RestApi(this, "OpenGraphApi", {
      restApiName: "Proved OpenGraph API",
      description: "for open graph protocol",
      deployOptions: {
        stageName: deployEnv(),
      },
      // 👇 enable CORS
      defaultCorsPreflightOptions: {
        allowHeaders: [
          "Content-Type",
          "X-Amz-Date",
          "Authorization",
          "X-Api-Key",
        ],
        allowMethods: ["OPTIONS", "GET", "POST", "PUT", "PATCH", "DELETE"],
        allowCredentials: true,
        allowOrigins: ["http://localhost:3000"],
      },
    });

    const { genNFTOGP } = props;
    const genNFTOGPResource = api.root.addResource("gen-nft-ogp");
    genNFTOGPResource.addMethod(
      "GET",
      new apigateway.LambdaIntegration(genNFTOGP)
    );

    new CfnOutput(this, "OpenGraphApiUrl", { value: api.url });
  }
}

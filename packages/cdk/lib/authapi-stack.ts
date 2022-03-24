import { Construct } from "constructs";
import {
  aws_apigateway as apigateway,
  aws_lambda_nodejs as lambda,
  CfnOutput,
} from "aws-cdk-lib";
import { deployEnv } from "./envSpecific";

interface AuthApiSetupProps {
  getNonce: lambda.NodejsFunction;
  auth: lambda.NodejsFunction;
  verify: lambda.NodejsFunction;
}

export class AuthApiSetup extends Construct {
  constructor(scope: Construct, id: string, props: AuthApiSetupProps) {
    super(scope, id);

    const api = new apigateway.RestApi(this, "AuthApi", {
      restApiName: "Proved Auth API",
      description: "for authentication",
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

    const { auth, getNonce, verify } = props;
    const nonceResource = api.root.addResource("nonce");
    nonceResource.addMethod("GET", new apigateway.LambdaIntegration(getNonce));
    const authResource = api.root.addResource("auth");
    authResource.addMethod("POST", new apigateway.LambdaIntegration(auth));
    const verifyResource = api.root.addResource("verify");
    verifyResource.addMethod("POST", new apigateway.LambdaIntegration(verify));

    new CfnOutput(this, "AuthApiUrl", { value: api.url });
  }
}

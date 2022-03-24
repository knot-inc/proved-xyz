import {
  aws_dynamodb as ddb,
  aws_iam as iam,
  aws_lambda_nodejs as lambda_nodejs,
  aws_lambda as lambda,
  CfnOutput,
  Expiration,
  Duration,
} from "aws-cdk-lib";
import * as appsync from "@aws-cdk/aws-appsync-alpha";
import { Construct } from "constructs";
import * as path from "path";
import { proofGetResolver } from "./resolvers/proofGet";
import { userGetResolver } from "./resolvers/userGet";
import { proofCreateResolver } from "./resolvers/proofCreate";
import { envSpecific } from "./envSpecific";
import { proofUpdateResolver } from "./resolvers/proofUpdate";
import { userUpdateResolver } from "./resolvers/userUpdate";
import { proofListResolver } from "./resolvers/proofList";
import { proofDetailGetResolver } from "./resolvers/proofDetailGet";

interface AppSyncSetupProps {
  proofTable: ddb.Table;
  userTable: ddb.Table;
  authRole: iam.Role;
  unauthRole: iam.Role;
}

export class AppSyncSetup extends Construct {
  constructor(scope: Construct, id: string, props: AppSyncSetupProps) {
    super(scope, id);

    // cloud watch role
    const cloudwatchRole = new iam.Role(this, "ApiCloudWatchRole", {
      assumedBy: new iam.ServicePrincipal("appsync.amazonaws.com"),
      managedPolicies: [
        iam.ManagedPolicy.fromAwsManagedPolicyName(
          "service-role/AWSAppSyncPushToCloudWatchLogs"
        ),
      ],
    });

    // Creates the AppSync API
    const api = new appsync.GraphqlApi(this, "GraphqlApi", {
      name: envSpecific("ProveGraphql"),
      authorizationConfig: {
        defaultAuthorization: {
          authorizationType: appsync.AuthorizationType.IAM,
        },
        additionalAuthorizationModes: [
          {
            authorizationType: appsync.AuthorizationType.API_KEY,
            apiKeyConfig: {
              expires: Expiration.after(Duration.days(365)),
            },
          },
        ],
      },
      schema: appsync.Schema.fromAsset(
        path.join(`${__dirname}/../`, "graphql", "schema.graphql")
      ),
      logConfig: {
        fieldLogLevel: appsync.FieldLogLevel.ERROR,
        role: cloudwatchRole,
      },
      xrayEnabled: true,
    });

    // Access management
    // Auth can read and write
    api.grantMutation(props.authRole);
    api.grantQuery(props.authRole);

    // UnAuth can read (should be guranual)
    api.grant(
      props.unauthRole,
      appsync.IamResource.ofType("Query", "proofGet"),
      "appsync:GraphQL"
    );
    api.grant(
      props.unauthRole,
      appsync.IamResource.ofType("Query", "proofDetailGet"),
      "appsync:GraphQL"
    );

    // API Key

    // lambda that handles appsync request
    // requires access to
    // - tables

    const appSyncHandlerLambda = new lambda_nodejs.NodejsFunction(
      this,
      "AppSyncHandler",
      {
        runtime: lambda.Runtime.NODEJS_12_X,
        memorySize: 512,
        handler: "handler",
        entry: path.join(`${__dirname}/../`, "functions", "appSync/index.ts"),
        environment: {
          USER_TABLE_NAME: props.userTable.tableName,
          PROOF_TABLE_NAME: props.proofTable.tableName,
        },
        bundling: {
          externalModules: [
            "aws-sdk", // Use the 'aws-sdk' available in the Lambda runtime
          ],
        },
      }
    );

    props.userTable.grantReadWriteData(appSyncHandlerLambda);
    props.proofTable.grantReadWriteData(appSyncHandlerLambda);

    // DataSource: Allow AppSync invoke Lambda function
    const dataSourceIamRole = new iam.Role(this, "DataSourceIamRole", {
      assumedBy: new iam.ServicePrincipal("appsync.amazonaws.com"),
    });

    const lambdaInvokePolicy = new iam.Policy(this, "LambdaInvokePolicy", {
      policyName: "LambdaInvokePolicy",
      statements: [
        new iam.PolicyStatement({
          effect: iam.Effect.ALLOW,
          actions: ["lambda:InvokeFunction"],
          resources: [appSyncHandlerLambda.functionArn],
        }),
      ],
    });

    dataSourceIamRole.attachInlinePolicy(lambdaInvokePolicy);

    const lambdaDs = new appsync.LambdaDataSource(this, "LambdaDs", {
      api,
      lambdaFunction: appSyncHandlerLambda,
      name: "LambdaDs",
      serviceRole: dataSourceIamRole,
    });

    // Attach resolver

    proofGetResolver(lambdaDs);
    proofDetailGetResolver(lambdaDs);
    proofCreateResolver(lambdaDs);
    proofUpdateResolver(lambdaDs);
    proofListResolver(lambdaDs);
    userGetResolver(lambdaDs);
    userUpdateResolver(lambdaDs);

    // Prints out the AppSync GraphQL endpoint to the terminal
    new CfnOutput(this, "GraphQLAPIURL", {
      value: api.graphqlUrl,
    });

    new CfnOutput(this, "GraphQLAPIKey", {
      value: api.apiKey || "",
    });
  }
}

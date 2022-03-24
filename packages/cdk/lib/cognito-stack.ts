import { CfnOutput, aws_iam as iam, aws_cognito as cognito } from "aws-cdk-lib";
import { Construct } from "constructs";
import { deployEnv, envSpecific } from "./envSpecific";
export class CognitoSetup extends Construct {
  public readonly identityPool: cognito.CfnIdentityPool;
  public readonly userPool: cognito.UserPool;
  public readonly userPoolClient: cognito.UserPoolClient;
  public readonly userCognitoGroupRole: iam.Role;
  public readonly anonymousCognitoGroupRole: iam.Role;

  constructor(scope: Construct, id: string) {
    super(scope, id);

    // 👇 User Pool
    this.userPool = new cognito.UserPool(this, envSpecific("proved-userpool"), {
      userPoolName: envSpecific("proved-userpool"),
      selfSignUpEnabled: true,
      signInAliases: {
        email: true,
      },
      autoVerify: {
        email: true,
      },
      passwordPolicy: {
        minLength: 6,
        requireLowercase: false,
        requireDigits: false,
        requireUppercase: false,
        requireSymbols: false,
      },
      accountRecovery: cognito.AccountRecovery.EMAIL_ONLY,
    });

    // 👇 User Pool Client
    this.userPoolClient = new cognito.UserPoolClient(
      this,
      envSpecific("proved-userpool-client"),
      {
        userPool: this.userPool,
        authFlows: {
          adminUserPassword: true,
          custom: true,
          userSrp: true,
        },
        supportedIdentityProviders: [
          cognito.UserPoolClientIdentityProvider.COGNITO,
        ],
      }
    );

    // 👇 Identity Pool
    this.identityPool = new cognito.CfnIdentityPool(
      this,
      envSpecific("proved-identitypool"),
      {
        identityPoolName: envSpecific("proved-identity-pool"),
        allowUnauthenticatedIdentities: true,
        cognitoIdentityProviders: [
          {
            clientId: this.userPoolClient.userPoolClientId,
            providerName: this.userPool.userPoolProviderName,
          },
        ],
        developerProviderName: `xyz.proved.${deployEnv()}`,
      }
    );

    this.anonymousCognitoGroupRole = new iam.Role(
      this,
      envSpecific("proved-anon-group-role"),
      {
        description: "Default role for anonymous users",
        assumedBy: new iam.FederatedPrincipal(
          "cognito-identity.amazonaws.com",
          {
            StringEquals: {
              "cognito-identity.amazonaws.com:aud": this.identityPool.ref,
            },
            "ForAnyValue:StringLike": {
              "cognito-identity.amazonaws.com:amr": "unauthenticated",
            },
          },
          "sts:AssumeRoleWithWebIdentity"
        ),
        managedPolicies: [
          iam.ManagedPolicy.fromAwsManagedPolicyName(
            "service-role/AWSLambdaBasicExecutionRole"
          ),
        ],
      }
    );

    this.userCognitoGroupRole = new iam.Role(
      this,
      envSpecific("proved-auth-group-role"),
      {
        description: "Default role for authenticated users",
        assumedBy: new iam.FederatedPrincipal(
          "cognito-identity.amazonaws.com",
          {
            StringEquals: {
              "cognito-identity.amazonaws.com:aud": this.identityPool.ref,
            },
            "ForAnyValue:StringLike": {
              "cognito-identity.amazonaws.com:amr": "authenticated",
            },
          },
          "sts:AssumeRoleWithWebIdentity"
        ),
        managedPolicies: [
          iam.ManagedPolicy.fromAwsManagedPolicyName(
            "service-role/AWSLambdaBasicExecutionRole"
          ),
        ],
      }
    );

    new cognito.CfnIdentityPoolRoleAttachment(
      this,
      envSpecific("proved-identitypool-role-attachment"),
      {
        identityPoolId: this.identityPool.ref,
        roles: {
          authenticated: this.userCognitoGroupRole.roleArn,
          unauthenticated: this.anonymousCognitoGroupRole.roleArn,
        },
      }
    );

    // 👇 Outputs
    new CfnOutput(this, "userPoolId", {
      value: this.userPool.userPoolId,
    });
    new CfnOutput(this, "userPoolClientId", {
      value: this.userPoolClient.userPoolClientId,
    });
    new CfnOutput(this, "identityPoolId", {
      value: this.identityPool.ref,
    });
  }
}

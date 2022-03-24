import { aws_lambda_nodejs as lambda_nodejs, CfnOutput } from "aws-cdk-lib";
import {
  Chain,
  Choice,
  Condition,
  Fail,
  StateMachine,
} from "aws-cdk-lib/aws-stepfunctions";
import { LambdaInvoke } from "aws-cdk-lib/aws-stepfunctions-tasks";
import { Construct } from "constructs";

interface ClaimStateMachineSetupProps {
  claimProofLambda: lambda_nodejs.NodejsFunction;
  completeClaimLambda: lambda_nodejs.NodejsFunction;
  generateImageLambda: lambda_nodejs.NodejsFunction;
  mintLambda: lambda_nodejs.NodejsFunction;
  rollbackClaimLambda: lambda_nodejs.NodejsFunction;
}
export class ClaimStateMachineSetup extends Construct {
  readonly stateMachine: StateMachine;
  constructor(
    scope: Construct,
    id: string,
    props: ClaimStateMachineSetupProps
  ) {
    super(scope, id);

    const claimProof = new LambdaInvoke(this, "Claim Proof", {
      lambdaFunction: props.claimProofLambda,
      outputPath: "$.Payload",
    });

    const generateImage = new LambdaInvoke(this, "Generate Content", {
      lambdaFunction: props.generateImageLambda,
      outputPath: "$.Payload",
    });

    const mint = new LambdaInvoke(this, "Mint NFT", {
      lambdaFunction: props.mintLambda,
      outputPath: "$.Payload",
    });

    const completeClaim = new LambdaInvoke(this, "Complete Claim", {
      lambdaFunction: props.completeClaimLambda,
      outputPath: "$.Payload",
    });

    const rollbackClaim = new LambdaInvoke(this, "Rollback Claim", {
      lambdaFunction: props.rollbackClaimLambda,
      outputPath: "$.Payload",
    });
    const jobFailed = () =>
      new Fail(this, `Failed`, {
        cause: "Job Failed",
      });

    rollbackClaim.next(jobFailed());
    const isSucceeded = new Choice(this, "Is ClaimSucceeded");

    const chain = Chain.start(claimProof)
      .next(generateImage)
      .next(mint)
      .next(
        isSucceeded
          .when(Condition.numberEquals("$.Status", 1), completeClaim)
          .when(Condition.numberEquals("$.Status", 0), rollbackClaim)
      );

    this.stateMachine = new StateMachine(this, "ClaimStateMachine", {
      definition: chain,
    });

    new CfnOutput(this, "ClaimStateMachineName", {
      value: this.stateMachine.stateMachineName || "",
    });
  }
}

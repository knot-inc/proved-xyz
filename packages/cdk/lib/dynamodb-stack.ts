import { aws_dynamodb as ddb } from "aws-cdk-lib";
import { Construct } from "constructs";

export class DynamoDBSetup extends Construct {
  public readonly userTableV2: ddb.Table;
  public readonly proofTable: ddb.Table;

  constructor(scope: Construct, id: string) {
    super(scope, id);

    this.userTableV2 = new ddb.Table(this, "UserV2", {
      billingMode: ddb.BillingMode.PAY_PER_REQUEST,
      partitionKey: {
        name: "id",
        type: ddb.AttributeType.STRING,
      },
    });

    this.proofTable = new ddb.Table(this, "Proof", {
      billingMode: ddb.BillingMode.PAY_PER_REQUEST,
      partitionKey: {
        name: "id",
        type: ddb.AttributeType.STRING,
      },
      stream: ddb.StreamViewType.NEW_AND_OLD_IMAGES,
    });

    // global secondary key for fetching proofs by userId
    this.proofTable.addGlobalSecondaryIndex({
      indexName: "ownerIndex",
      partitionKey: {
        name: "ownerId",
        type: ddb.AttributeType.STRING,
      },
      sortKey: {
        name: "status",
        type: ddb.AttributeType.STRING,
      },
      projectionType: ddb.ProjectionType.ALL,
    });
  }
}

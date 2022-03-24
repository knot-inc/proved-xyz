import { aws_s3 as s3, CfnOutput } from "aws-cdk-lib";
import { Construct } from "constructs";

export class S3Setup extends Construct {
  public readonly imageBucket: s3.Bucket;

  constructor(scope: Construct, id: string) {
    super(scope, id);

    this.imageBucket = new s3.Bucket(this, "S3ImageBucket", {
      publicReadAccess: true,
      encryption: s3.BucketEncryption.S3_MANAGED,
    });

    new CfnOutput(this, "S3ImagebucketName", {
      value: this.imageBucket.bucketName,
    });
  }
}

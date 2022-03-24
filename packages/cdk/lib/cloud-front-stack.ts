import { aws_s3 as s3, CfnOutput } from "aws-cdk-lib";
import { Certificate } from "aws-cdk-lib/aws-certificatemanager";
import { Distribution, OriginAccessIdentity } from "aws-cdk-lib/aws-cloudfront";
import { S3Origin } from "aws-cdk-lib/aws-cloudfront-origins";
import { Construct } from "constructs";

interface CloudFrontSetupProps {
  imageBucket: s3.Bucket;
}
export class CloudFrontSetup extends Construct {
  constructor(scope: Construct, id: string, props: CloudFrontSetupProps) {
    super(scope, id);

    // An origin access identity is a special CloudFront user that you can associate with Amazon S3 origins, so that you can secure all or just some of your Amazon S3 content.
    const originAccessIdentity = new OriginAccessIdentity(
      this,
      "OriginAccessIdentity"
    );
    props.imageBucket.grantRead(originAccessIdentity);

    const distribution = new Distribution(this, "Distribution", {
      defaultBehavior: {
        origin: new S3Origin(props.imageBucket, { originAccessIdentity }),
      },
      domainNames: ["www.assetproved.com"],
      certificate: Certificate.fromCertificateArn(
        this,
        "DomainCertificate",
        "arn:aws:acm:us-east-1:430486035796:certificate/58f81796-63dc-48d7-83f0-91e73feb31c4"
      ),
    });

    new CfnOutput(this, "cloudfront", {
      value: distribution.domainName,
    });
  }
}

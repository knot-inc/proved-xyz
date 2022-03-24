import * as appsync from "@aws-cdk/aws-appsync-alpha";

export const proofGetResolver = (lambdaDs: appsync.LambdaDataSource) => {
  lambdaDs.createResolver({
    fieldName: "proofGet",
    typeName: "Query",
  });
};

import * as appsync from "@aws-cdk/aws-appsync-alpha";

export const proofDetailGetResolver = (lambdaDs: appsync.LambdaDataSource) => {
  lambdaDs.createResolver({
    fieldName: "proofDetailGet",
    typeName: "Query",
  });
};

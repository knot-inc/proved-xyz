import * as appsync from "@aws-cdk/aws-appsync-alpha";

export const proofListResolver = (lambdaDs: appsync.LambdaDataSource) => {
  lambdaDs.createResolver({
    fieldName: "proofList",
    typeName: "Query",
  });
};

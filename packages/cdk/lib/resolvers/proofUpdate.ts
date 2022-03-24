import * as appsync from "@aws-cdk/aws-appsync-alpha";

export const proofUpdateResolver = (lambdaDs: appsync.LambdaDataSource) => {
  lambdaDs.createResolver({
    fieldName: "proofUpdate",
    typeName: "Mutation",
  });
};

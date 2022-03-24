import * as appsync from "@aws-cdk/aws-appsync-alpha";

export const proofCreateResolver = (lambdaDs: appsync.LambdaDataSource) => {
  lambdaDs.createResolver({
    fieldName: "proofCreate",
    typeName: "Mutation",
  });
};

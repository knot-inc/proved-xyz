import * as appsync from "@aws-cdk/aws-appsync-alpha";

export const userGetResolver = (lambdaDs: appsync.LambdaDataSource) => {
  lambdaDs.createResolver({
    fieldName: "userGet",
    typeName: "Query",
  });
};

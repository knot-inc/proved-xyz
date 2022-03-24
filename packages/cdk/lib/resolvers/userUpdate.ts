import * as appsync from "@aws-cdk/aws-appsync-alpha";

export const userUpdateResolver = (lambdaDs: appsync.LambdaDataSource) => {
  lambdaDs.createResolver({
    fieldName: "userUpdate",
    typeName: "Mutation",
  });
};

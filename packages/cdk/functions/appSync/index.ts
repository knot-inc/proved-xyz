import { AppSyncResolverEvent } from "aws-lambda";
import { proofCreate, proofDetailGet, proofGet, proofList, proofUpdate, userGet, userUpdate } from '/opt/nodejs/dynamodb-utils';
import { MutationArgs, QueryArgs, Result } from "graphql/appSync";
import {
  MutationProofCreateArgs,
  MutationProofUpdateArgs,
  MutationUserUpdateArgs,
} from "@/graphql";

const { PROOF_TABLE_NAME, USER_TABLE_NAME } = process.env;

exports.handler = async function (
  event: AppSyncResolverEvent<QueryArgs | MutationArgs, Result>
) {
  switch (event.info.fieldName) {
    case "userGet": {
      return await userGet(
        (event.arguments as QueryArgs).id,
        USER_TABLE_NAME as string
      );
    }
    case "userUpdate": {
      return await userUpdate(
        (event.arguments as MutationUserUpdateArgs).input,
        USER_TABLE_NAME as string
      );
    }
    case "proofGet": {
      return await proofGet(
        (event.arguments as QueryArgs).id,
        PROOF_TABLE_NAME as string
      );
    }
    case "proofDetailGet": {
      return await proofDetailGet(
        (event.arguments as QueryArgs).id,
        PROOF_TABLE_NAME as string,
        USER_TABLE_NAME as string
      );
    }
    case "proofList": {
      return await proofList(
        (event.arguments as QueryArgs).id,
        PROOF_TABLE_NAME as string
      );
    }
    case "proofCreate": {
      return await proofCreate(
        (event.arguments as MutationProofCreateArgs).input,
        PROOF_TABLE_NAME as string
      );
    }
    case "proofUpdate": {
      return await proofUpdate(
        (event.arguments as MutationProofUpdateArgs).input,
        PROOF_TABLE_NAME as string
      );
    }
    default:
      return null;
  }
};

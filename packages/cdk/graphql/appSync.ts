import {
  MutationProofCreateArgs,
  MutationProofUpdateArgs,
  QueryUserGetArgs,
  QueryProofGetArgs,
  User,
  Proof,
  QueryProofListArgs,
} from "./types";

export type QueryArgs =
  | QueryProofGetArgs
  | QueryUserGetArgs
  | QueryProofListArgs;
export type Result = User | Proof | Proof[];
export type MutationArgs = MutationProofCreateArgs | MutationProofUpdateArgs;

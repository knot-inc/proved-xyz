/* eslint-disable @typescript-eslint/no-explicit-any */

export interface AuthData {
  id: string;
  email: string;
  name: string;
  token: string;
}

type Primitive = string | number | boolean | symbol | undefined | null;

type DeepOmitArray<T extends any[], K> = {
  [P in keyof T]: DeepOmit<T[P], K>;
};
// https://dev.to/applification/how-to-use-amplify-appsync-graphql-types-in-a-react-typescript-app-of
export type DeepOmit<T, K> = T extends Primitive
  ? T
  : {
      [P in Exclude<keyof T, K>]: T[P] extends infer TP
        ? TP extends Primitive
          ? TP // leave primitives and functions alone
          : TP extends any[]
          ? DeepOmitArray<TP, K> // Array special handling
          : DeepOmit<TP, K>
        : never;
    };

export enum ImageSize {
  Size_12px = 12,
  Size_48px = 48,
  Size_64px = 64,
}

export enum LogoSize {
  Default,
  Large,
}

export type TicketGenerationState = "default" | "loading";

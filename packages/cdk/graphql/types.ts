import { GraphQLResolveInfo, GraphQLScalarType, GraphQLScalarTypeConfig } from 'graphql';
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type RequireFields<T, K extends keyof T> = { [X in Exclude<keyof T, K>]?: T[X] } & { [P in K]-?: NonNullable<T[P]> };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
  AWSDate: string;
  AWSDateTime: string;
  AWSEmail: string;
  AWSIPAddress: string;
  AWSJSON: string;
  AWSPhone: string;
  AWSTime: string;
  AWSTimestamp: number;
  AWSURL: string;
};

export type Mutation = {
  __typename?: 'Mutation';
  proofCreate?: Maybe<Proof>;
  proofUpdate?: Maybe<Proof>;
  userUpdate?: Maybe<User>;
};


export type MutationProofCreateArgs = {
  input: ProofCreateInput;
};


export type MutationProofUpdateArgs = {
  input: ProofUpdateInput;
};


export type MutationUserUpdateArgs = {
  input: UserUpdateInput;
};

export type Org = {
  __typename?: 'Org';
  discordIcon?: Maybe<Scalars['String']>;
  id: Scalars['ID'];
  isOwner?: Maybe<Scalars['Boolean']>;
  name: Scalars['String'];
};

export type OrgInput = {
  discordIcon?: InputMaybe<Scalars['String']>;
  id: Scalars['ID'];
  isOwner?: InputMaybe<Scalars['Boolean']>;
  name: Scalars['String'];
};

export type Proof = {
  __typename?: 'Proof';
  createdAt?: Maybe<Scalars['AWSDateTime']>;
  endDate?: Maybe<Scalars['AWSDateTime']>;
  id: Scalars['ID'];
  nftTxHash?: Maybe<Scalars['String']>;
  org?: Maybe<Org>;
  ownerId?: Maybe<Scalars['ID']>;
  provers?: Maybe<Array<Maybe<User>>>;
  role?: Maybe<Scalars['String']>;
  startDate?: Maybe<Scalars['AWSDateTime']>;
  status?: Maybe<ProvedStatus>;
  txHash?: Maybe<Scalars['String']>;
};

export type ProofCreateInput = {
  endDate?: InputMaybe<Scalars['AWSDateTime']>;
  org: OrgInput;
  ownerId: Scalars['ID'];
  role: Scalars['String'];
  startDate: Scalars['AWSDateTime'];
};

export type ProofDetail = {
  __typename?: 'ProofDetail';
  createdAt?: Maybe<Scalars['AWSDateTime']>;
  endDate?: Maybe<Scalars['AWSDateTime']>;
  id: Scalars['ID'];
  nftTxHash?: Maybe<Scalars['String']>;
  org?: Maybe<Org>;
  owner?: Maybe<User>;
  ownerId?: Maybe<Scalars['ID']>;
  provers?: Maybe<Array<Maybe<User>>>;
  role?: Maybe<Scalars['String']>;
  startDate?: Maybe<Scalars['AWSDateTime']>;
  status?: Maybe<ProvedStatus>;
  txHash?: Maybe<Scalars['String']>;
};

export type ProofUpdateInput = {
  endDate?: InputMaybe<Scalars['AWSDateTime']>;
  id: Scalars['ID'];
  nftTxHash?: InputMaybe<Scalars['String']>;
  org?: InputMaybe<OrgInput>;
  prover?: InputMaybe<UserInput>;
  role?: InputMaybe<Scalars['String']>;
  startDate?: InputMaybe<Scalars['AWSDateTime']>;
  status?: InputMaybe<ProvedStatus>;
  txHash?: InputMaybe<Scalars['String']>;
};

export enum ProvedStatus {
  Canceled = 'CANCELED',
  ClaimedProposal = 'CLAIMED_PROPOSAL',
  Minted = 'MINTED',
  Proved = 'PROVED',
  TriggeredMint = 'TRIGGERED_MINT'
}

export type Query = {
  __typename?: 'Query';
  proofDetailGet?: Maybe<ProofDetail>;
  proofGet?: Maybe<Proof>;
  proofList?: Maybe<Array<Maybe<Proof>>>;
  userGet?: Maybe<User>;
};


export type QueryProofDetailGetArgs = {
  id: Scalars['ID'];
};


export type QueryProofGetArgs = {
  id: Scalars['ID'];
};


export type QueryProofListArgs = {
  id: Scalars['ID'];
};


export type QueryUserGetArgs = {
  id: Scalars['ID'];
};

export type S3Object = {
  __typename?: 'S3Object';
  bucket: Scalars['String'];
  key: Scalars['String'];
  region: Scalars['String'];
};

export type S3ObjectInput = {
  bucket: Scalars['String'];
  key: Scalars['String'];
  region: Scalars['String'];
};

export type User = {
  __typename?: 'User';
  createdAt?: Maybe<Scalars['AWSDateTime']>;
  email?: Maybe<Scalars['String']>;
  id: Scalars['ID'];
  name?: Maybe<Scalars['String']>;
  nonce?: Maybe<Scalars['String']>;
  orgs?: Maybe<Array<Maybe<Org>>>;
  profileImage?: Maybe<S3Object>;
  subscribeMessage?: Maybe<Scalars['Boolean']>;
  verified?: Maybe<Scalars['Boolean']>;
};

export type UserInput = {
  id: Scalars['ID'];
  name?: InputMaybe<Scalars['String']>;
};

export type UserUpdateInput = {
  email?: InputMaybe<Scalars['String']>;
  id: Scalars['ID'];
  name?: InputMaybe<Scalars['String']>;
  nonce?: InputMaybe<Scalars['String']>;
  orgs?: InputMaybe<Array<InputMaybe<OrgInput>>>;
  profileImage?: InputMaybe<S3ObjectInput>;
  subscribeMessage?: InputMaybe<Scalars['Boolean']>;
  verified?: InputMaybe<Scalars['Boolean']>;
};



export type ResolverTypeWrapper<T> = Promise<T> | T;


export type ResolverWithResolve<TResult, TParent, TContext, TArgs> = {
  resolve: ResolverFn<TResult, TParent, TContext, TArgs>;
};
export type Resolver<TResult, TParent = {}, TContext = {}, TArgs = {}> = ResolverFn<TResult, TParent, TContext, TArgs> | ResolverWithResolve<TResult, TParent, TContext, TArgs>;

export type ResolverFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => Promise<TResult> | TResult;

export type SubscriptionSubscribeFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => AsyncIterable<TResult> | Promise<AsyncIterable<TResult>>;

export type SubscriptionResolveFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => TResult | Promise<TResult>;

export interface SubscriptionSubscriberObject<TResult, TKey extends string, TParent, TContext, TArgs> {
  subscribe: SubscriptionSubscribeFn<{ [key in TKey]: TResult }, TParent, TContext, TArgs>;
  resolve?: SubscriptionResolveFn<TResult, { [key in TKey]: TResult }, TContext, TArgs>;
}

export interface SubscriptionResolverObject<TResult, TParent, TContext, TArgs> {
  subscribe: SubscriptionSubscribeFn<any, TParent, TContext, TArgs>;
  resolve: SubscriptionResolveFn<TResult, any, TContext, TArgs>;
}

export type SubscriptionObject<TResult, TKey extends string, TParent, TContext, TArgs> =
  | SubscriptionSubscriberObject<TResult, TKey, TParent, TContext, TArgs>
  | SubscriptionResolverObject<TResult, TParent, TContext, TArgs>;

export type SubscriptionResolver<TResult, TKey extends string, TParent = {}, TContext = {}, TArgs = {}> =
  | ((...args: any[]) => SubscriptionObject<TResult, TKey, TParent, TContext, TArgs>)
  | SubscriptionObject<TResult, TKey, TParent, TContext, TArgs>;

export type TypeResolveFn<TTypes, TParent = {}, TContext = {}> = (
  parent: TParent,
  context: TContext,
  info: GraphQLResolveInfo
) => Maybe<TTypes> | Promise<Maybe<TTypes>>;

export type IsTypeOfResolverFn<T = {}, TContext = {}> = (obj: T, context: TContext, info: GraphQLResolveInfo) => boolean | Promise<boolean>;

export type NextResolverFn<T> = () => Promise<T>;

export type DirectiveResolverFn<TResult = {}, TParent = {}, TContext = {}, TArgs = {}> = (
  next: NextResolverFn<TResult>,
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => TResult | Promise<TResult>;

/** Mapping between all available schema types and the resolvers types */
export type ResolversTypes = {
  AWSDate: ResolverTypeWrapper<Scalars['AWSDate']>;
  AWSDateTime: ResolverTypeWrapper<Scalars['AWSDateTime']>;
  AWSEmail: ResolverTypeWrapper<Scalars['AWSEmail']>;
  AWSIPAddress: ResolverTypeWrapper<Scalars['AWSIPAddress']>;
  AWSJSON: ResolverTypeWrapper<Scalars['AWSJSON']>;
  AWSPhone: ResolverTypeWrapper<Scalars['AWSPhone']>;
  AWSTime: ResolverTypeWrapper<Scalars['AWSTime']>;
  AWSTimestamp: ResolverTypeWrapper<Scalars['AWSTimestamp']>;
  AWSURL: ResolverTypeWrapper<Scalars['AWSURL']>;
  Boolean: ResolverTypeWrapper<Scalars['Boolean']>;
  ID: ResolverTypeWrapper<Scalars['ID']>;
  Mutation: ResolverTypeWrapper<{}>;
  Org: ResolverTypeWrapper<Org>;
  OrgInput: OrgInput;
  Proof: ResolverTypeWrapper<Proof>;
  ProofCreateInput: ProofCreateInput;
  ProofDetail: ResolverTypeWrapper<ProofDetail>;
  ProofUpdateInput: ProofUpdateInput;
  ProvedStatus: ProvedStatus;
  Query: ResolverTypeWrapper<{}>;
  S3Object: ResolverTypeWrapper<S3Object>;
  S3ObjectInput: S3ObjectInput;
  String: ResolverTypeWrapper<Scalars['String']>;
  User: ResolverTypeWrapper<User>;
  UserInput: UserInput;
  UserUpdateInput: UserUpdateInput;
};

/** Mapping between all available schema types and the resolvers parents */
export type ResolversParentTypes = {
  AWSDate: Scalars['AWSDate'];
  AWSDateTime: Scalars['AWSDateTime'];
  AWSEmail: Scalars['AWSEmail'];
  AWSIPAddress: Scalars['AWSIPAddress'];
  AWSJSON: Scalars['AWSJSON'];
  AWSPhone: Scalars['AWSPhone'];
  AWSTime: Scalars['AWSTime'];
  AWSTimestamp: Scalars['AWSTimestamp'];
  AWSURL: Scalars['AWSURL'];
  Boolean: Scalars['Boolean'];
  ID: Scalars['ID'];
  Mutation: {};
  Org: Org;
  OrgInput: OrgInput;
  Proof: Proof;
  ProofCreateInput: ProofCreateInput;
  ProofDetail: ProofDetail;
  ProofUpdateInput: ProofUpdateInput;
  Query: {};
  S3Object: S3Object;
  S3ObjectInput: S3ObjectInput;
  String: Scalars['String'];
  User: User;
  UserInput: UserInput;
  UserUpdateInput: UserUpdateInput;
};

export interface AwsDateScalarConfig extends GraphQLScalarTypeConfig<ResolversTypes['AWSDate'], any> {
  name: 'AWSDate';
}

export interface AwsDateTimeScalarConfig extends GraphQLScalarTypeConfig<ResolversTypes['AWSDateTime'], any> {
  name: 'AWSDateTime';
}

export interface AwsEmailScalarConfig extends GraphQLScalarTypeConfig<ResolversTypes['AWSEmail'], any> {
  name: 'AWSEmail';
}

export interface AwsipAddressScalarConfig extends GraphQLScalarTypeConfig<ResolversTypes['AWSIPAddress'], any> {
  name: 'AWSIPAddress';
}

export interface AwsjsonScalarConfig extends GraphQLScalarTypeConfig<ResolversTypes['AWSJSON'], any> {
  name: 'AWSJSON';
}

export interface AwsPhoneScalarConfig extends GraphQLScalarTypeConfig<ResolversTypes['AWSPhone'], any> {
  name: 'AWSPhone';
}

export interface AwsTimeScalarConfig extends GraphQLScalarTypeConfig<ResolversTypes['AWSTime'], any> {
  name: 'AWSTime';
}

export interface AwsTimestampScalarConfig extends GraphQLScalarTypeConfig<ResolversTypes['AWSTimestamp'], any> {
  name: 'AWSTimestamp';
}

export interface AwsurlScalarConfig extends GraphQLScalarTypeConfig<ResolversTypes['AWSURL'], any> {
  name: 'AWSURL';
}

export type MutationResolvers<ContextType = any, ParentType extends ResolversParentTypes['Mutation'] = ResolversParentTypes['Mutation']> = {
  proofCreate?: Resolver<Maybe<ResolversTypes['Proof']>, ParentType, ContextType, RequireFields<MutationProofCreateArgs, 'input'>>;
  proofUpdate?: Resolver<Maybe<ResolversTypes['Proof']>, ParentType, ContextType, RequireFields<MutationProofUpdateArgs, 'input'>>;
  userUpdate?: Resolver<Maybe<ResolversTypes['User']>, ParentType, ContextType, RequireFields<MutationUserUpdateArgs, 'input'>>;
};

export type OrgResolvers<ContextType = any, ParentType extends ResolversParentTypes['Org'] = ResolversParentTypes['Org']> = {
  discordIcon?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  isOwner?: Resolver<Maybe<ResolversTypes['Boolean']>, ParentType, ContextType>;
  name?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type ProofResolvers<ContextType = any, ParentType extends ResolversParentTypes['Proof'] = ResolversParentTypes['Proof']> = {
  createdAt?: Resolver<Maybe<ResolversTypes['AWSDateTime']>, ParentType, ContextType>;
  endDate?: Resolver<Maybe<ResolversTypes['AWSDateTime']>, ParentType, ContextType>;
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  nftTxHash?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  org?: Resolver<Maybe<ResolversTypes['Org']>, ParentType, ContextType>;
  ownerId?: Resolver<Maybe<ResolversTypes['ID']>, ParentType, ContextType>;
  provers?: Resolver<Maybe<Array<Maybe<ResolversTypes['User']>>>, ParentType, ContextType>;
  role?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  startDate?: Resolver<Maybe<ResolversTypes['AWSDateTime']>, ParentType, ContextType>;
  status?: Resolver<Maybe<ResolversTypes['ProvedStatus']>, ParentType, ContextType>;
  txHash?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type ProofDetailResolvers<ContextType = any, ParentType extends ResolversParentTypes['ProofDetail'] = ResolversParentTypes['ProofDetail']> = {
  createdAt?: Resolver<Maybe<ResolversTypes['AWSDateTime']>, ParentType, ContextType>;
  endDate?: Resolver<Maybe<ResolversTypes['AWSDateTime']>, ParentType, ContextType>;
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  nftTxHash?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  org?: Resolver<Maybe<ResolversTypes['Org']>, ParentType, ContextType>;
  owner?: Resolver<Maybe<ResolversTypes['User']>, ParentType, ContextType>;
  ownerId?: Resolver<Maybe<ResolversTypes['ID']>, ParentType, ContextType>;
  provers?: Resolver<Maybe<Array<Maybe<ResolversTypes['User']>>>, ParentType, ContextType>;
  role?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  startDate?: Resolver<Maybe<ResolversTypes['AWSDateTime']>, ParentType, ContextType>;
  status?: Resolver<Maybe<ResolversTypes['ProvedStatus']>, ParentType, ContextType>;
  txHash?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type QueryResolvers<ContextType = any, ParentType extends ResolversParentTypes['Query'] = ResolversParentTypes['Query']> = {
  proofDetailGet?: Resolver<Maybe<ResolversTypes['ProofDetail']>, ParentType, ContextType, RequireFields<QueryProofDetailGetArgs, 'id'>>;
  proofGet?: Resolver<Maybe<ResolversTypes['Proof']>, ParentType, ContextType, RequireFields<QueryProofGetArgs, 'id'>>;
  proofList?: Resolver<Maybe<Array<Maybe<ResolversTypes['Proof']>>>, ParentType, ContextType, RequireFields<QueryProofListArgs, 'id'>>;
  userGet?: Resolver<Maybe<ResolversTypes['User']>, ParentType, ContextType, RequireFields<QueryUserGetArgs, 'id'>>;
};

export type S3ObjectResolvers<ContextType = any, ParentType extends ResolversParentTypes['S3Object'] = ResolversParentTypes['S3Object']> = {
  bucket?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  key?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  region?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type UserResolvers<ContextType = any, ParentType extends ResolversParentTypes['User'] = ResolversParentTypes['User']> = {
  createdAt?: Resolver<Maybe<ResolversTypes['AWSDateTime']>, ParentType, ContextType>;
  email?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  name?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  nonce?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  orgs?: Resolver<Maybe<Array<Maybe<ResolversTypes['Org']>>>, ParentType, ContextType>;
  profileImage?: Resolver<Maybe<ResolversTypes['S3Object']>, ParentType, ContextType>;
  subscribeMessage?: Resolver<Maybe<ResolversTypes['Boolean']>, ParentType, ContextType>;
  verified?: Resolver<Maybe<ResolversTypes['Boolean']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type Resolvers<ContextType = any> = {
  AWSDate?: GraphQLScalarType;
  AWSDateTime?: GraphQLScalarType;
  AWSEmail?: GraphQLScalarType;
  AWSIPAddress?: GraphQLScalarType;
  AWSJSON?: GraphQLScalarType;
  AWSPhone?: GraphQLScalarType;
  AWSTime?: GraphQLScalarType;
  AWSTimestamp?: GraphQLScalarType;
  AWSURL?: GraphQLScalarType;
  Mutation?: MutationResolvers<ContextType>;
  Org?: OrgResolvers<ContextType>;
  Proof?: ProofResolvers<ContextType>;
  ProofDetail?: ProofDetailResolvers<ContextType>;
  Query?: QueryResolvers<ContextType>;
  S3Object?: S3ObjectResolvers<ContextType>;
  User?: UserResolvers<ContextType>;
};


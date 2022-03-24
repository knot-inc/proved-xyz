/* tslint:disable */
/* eslint-disable */
//  This file was automatically generated and should not be edited.

export type ProofCreateInput = {
  org: OrgInput,
  role: string,
  ownerId: string,
  startDate: string,
  endDate?: string | null,
};

export type OrgInput = {
  id: string,
  name: string,
  discordIcon?: string | null,
  isOwner?: boolean | null,
};

export type Proof = {
  __typename: "Proof",
  id: string,
  createdAt?: string | null,
  endDate?: string | null,
  org?: Org | null,
  ownerId?: string | null,
  provers?:  Array<User | null > | null,
  role?: string | null,
  startDate?: string | null,
  status?: ProvedStatus | null,
  txHash?: string | null,
  nftTxHash?: string | null,
};

export type Org = {
  __typename: "Org",
  id: string,
  name: string,
  discordIcon?: string | null,
  isOwner?: boolean | null,
};

export type User = {
  __typename: "User",
  id: string,
  createdAt?: string | null,
  email?: string | null,
  name?: string | null,
  nonce?: string | null,
  profileImage?: S3Object | null,
  verified?: boolean | null,
  subscribeMessage?: boolean | null,
  orgs?:  Array<Org | null > | null,
};

export type S3Object = {
  __typename: "S3Object",
  bucket: string,
  key: string,
  region: string,
};

export enum ProvedStatus {
  CANCELED = "CANCELED",
  MINTED = "MINTED",
  PROVED = "PROVED",
  TRIGGERED_MINT = "TRIGGERED_MINT",
  CLAIMED_PROPOSAL = "CLAIMED_PROPOSAL",
}


export type ProofUpdateInput = {
  id: string,
  org?: OrgInput | null,
  role?: string | null,
  startDate?: string | null,
  endDate?: string | null,
  status?: ProvedStatus | null,
  prover?: UserInput | null,
  txHash?: string | null,
  nftTxHash?: string | null,
};

export type UserInput = {
  id: string,
  name?: string | null,
};

export type UserUpdateInput = {
  id: string,
  email?: string | null,
  name?: string | null,
  nonce?: string | null,
  profileImage?: S3ObjectInput | null,
  verified?: boolean | null,
  subscribeMessage?: boolean | null,
  orgs?: Array< OrgInput | null > | null,
};

export type S3ObjectInput = {
  bucket: string,
  key: string,
  region: string,
};

export type ProofDetail = {
  __typename: "ProofDetail",
  id: string,
  createdAt?: string | null,
  endDate?: string | null,
  org?: Org | null,
  ownerId?: string | null,
  owner?: User | null,
  provers?:  Array<User | null > | null,
  role?: string | null,
  startDate?: string | null,
  status?: ProvedStatus | null,
  txHash?: string | null,
  nftTxHash?: string | null,
};

export type ProofCreateMutationVariables = {
  input: ProofCreateInput,
};

export type ProofCreateMutation = {
  proofCreate?:  {
    __typename: "Proof",
    id: string,
    createdAt?: string | null,
    endDate?: string | null,
    org?:  {
      __typename: "Org",
      id: string,
      name: string,
      discordIcon?: string | null,
      isOwner?: boolean | null,
    } | null,
    ownerId?: string | null,
    provers?:  Array< {
      __typename: "User",
      id: string,
      createdAt?: string | null,
      email?: string | null,
      name?: string | null,
      nonce?: string | null,
      profileImage?:  {
        __typename: "S3Object",
        bucket: string,
        key: string,
        region: string,
      } | null,
      verified?: boolean | null,
      subscribeMessage?: boolean | null,
      orgs?:  Array< {
        __typename: "Org",
        id: string,
        name: string,
        discordIcon?: string | null,
        isOwner?: boolean | null,
      } | null > | null,
    } | null > | null,
    role?: string | null,
    startDate?: string | null,
    status?: ProvedStatus | null,
    txHash?: string | null,
    nftTxHash?: string | null,
  } | null,
};

export type ProofUpdateMutationVariables = {
  input: ProofUpdateInput,
};

export type ProofUpdateMutation = {
  proofUpdate?:  {
    __typename: "Proof",
    id: string,
    createdAt?: string | null,
    endDate?: string | null,
    org?:  {
      __typename: "Org",
      id: string,
      name: string,
      discordIcon?: string | null,
      isOwner?: boolean | null,
    } | null,
    ownerId?: string | null,
    provers?:  Array< {
      __typename: "User",
      id: string,
      createdAt?: string | null,
      email?: string | null,
      name?: string | null,
      nonce?: string | null,
      profileImage?:  {
        __typename: "S3Object",
        bucket: string,
        key: string,
        region: string,
      } | null,
      verified?: boolean | null,
      subscribeMessage?: boolean | null,
      orgs?:  Array< {
        __typename: "Org",
        id: string,
        name: string,
        discordIcon?: string | null,
        isOwner?: boolean | null,
      } | null > | null,
    } | null > | null,
    role?: string | null,
    startDate?: string | null,
    status?: ProvedStatus | null,
    txHash?: string | null,
    nftTxHash?: string | null,
  } | null,
};

export type UserUpdateMutationVariables = {
  input: UserUpdateInput,
};

export type UserUpdateMutation = {
  userUpdate?:  {
    __typename: "User",
    id: string,
    createdAt?: string | null,
    email?: string | null,
    name?: string | null,
    nonce?: string | null,
    profileImage?:  {
      __typename: "S3Object",
      bucket: string,
      key: string,
      region: string,
    } | null,
    verified?: boolean | null,
    subscribeMessage?: boolean | null,
    orgs?:  Array< {
      __typename: "Org",
      id: string,
      name: string,
      discordIcon?: string | null,
      isOwner?: boolean | null,
    } | null > | null,
  } | null,
};

export type UserGetQueryVariables = {
  id: string,
};

export type UserGetQuery = {
  userGet?:  {
    __typename: "User",
    id: string,
    createdAt?: string | null,
    email?: string | null,
    name?: string | null,
    nonce?: string | null,
    profileImage?:  {
      __typename: "S3Object",
      bucket: string,
      key: string,
      region: string,
    } | null,
    verified?: boolean | null,
    subscribeMessage?: boolean | null,
    orgs?:  Array< {
      __typename: "Org",
      id: string,
      name: string,
      discordIcon?: string | null,
      isOwner?: boolean | null,
    } | null > | null,
  } | null,
};

export type ProofGetQueryVariables = {
  id: string,
};

export type ProofGetQuery = {
  proofGet?:  {
    __typename: "Proof",
    id: string,
    createdAt?: string | null,
    endDate?: string | null,
    org?:  {
      __typename: "Org",
      id: string,
      name: string,
      discordIcon?: string | null,
      isOwner?: boolean | null,
    } | null,
    ownerId?: string | null,
    provers?:  Array< {
      __typename: "User",
      id: string,
      createdAt?: string | null,
      email?: string | null,
      name?: string | null,
      nonce?: string | null,
      profileImage?:  {
        __typename: "S3Object",
        bucket: string,
        key: string,
        region: string,
      } | null,
      verified?: boolean | null,
      subscribeMessage?: boolean | null,
      orgs?:  Array< {
        __typename: "Org",
        id: string,
        name: string,
        discordIcon?: string | null,
        isOwner?: boolean | null,
      } | null > | null,
    } | null > | null,
    role?: string | null,
    startDate?: string | null,
    status?: ProvedStatus | null,
    txHash?: string | null,
    nftTxHash?: string | null,
  } | null,
};

export type ProofDetailGetQueryVariables = {
  id: string,
};

export type ProofDetailGetQuery = {
  proofDetailGet?:  {
    __typename: "ProofDetail",
    id: string,
    createdAt?: string | null,
    endDate?: string | null,
    org?:  {
      __typename: "Org",
      id: string,
      name: string,
      discordIcon?: string | null,
      isOwner?: boolean | null,
    } | null,
    ownerId?: string | null,
    owner?:  {
      __typename: "User",
      id: string,
      createdAt?: string | null,
      email?: string | null,
      name?: string | null,
      nonce?: string | null,
      profileImage?:  {
        __typename: "S3Object",
        bucket: string,
        key: string,
        region: string,
      } | null,
      verified?: boolean | null,
      subscribeMessage?: boolean | null,
      orgs?:  Array< {
        __typename: "Org",
        id: string,
        name: string,
        discordIcon?: string | null,
        isOwner?: boolean | null,
      } | null > | null,
    } | null,
    provers?:  Array< {
      __typename: "User",
      id: string,
      createdAt?: string | null,
      email?: string | null,
      name?: string | null,
      nonce?: string | null,
      profileImage?:  {
        __typename: "S3Object",
        bucket: string,
        key: string,
        region: string,
      } | null,
      verified?: boolean | null,
      subscribeMessage?: boolean | null,
      orgs?:  Array< {
        __typename: "Org",
        id: string,
        name: string,
        discordIcon?: string | null,
        isOwner?: boolean | null,
      } | null > | null,
    } | null > | null,
    role?: string | null,
    startDate?: string | null,
    status?: ProvedStatus | null,
    txHash?: string | null,
    nftTxHash?: string | null,
  } | null,
};

export type ProofListQueryVariables = {
  id: string,
};

export type ProofListQuery = {
  proofList?:  Array< {
    __typename: "Proof",
    id: string,
    createdAt?: string | null,
    endDate?: string | null,
    org?:  {
      __typename: "Org",
      id: string,
      name: string,
      discordIcon?: string | null,
      isOwner?: boolean | null,
    } | null,
    ownerId?: string | null,
    provers?:  Array< {
      __typename: "User",
      id: string,
      createdAt?: string | null,
      email?: string | null,
      name?: string | null,
      nonce?: string | null,
      profileImage?:  {
        __typename: "S3Object",
        bucket: string,
        key: string,
        region: string,
      } | null,
      verified?: boolean | null,
      subscribeMessage?: boolean | null,
      orgs?:  Array< {
        __typename: "Org",
        id: string,
        name: string,
        discordIcon?: string | null,
        isOwner?: boolean | null,
      } | null > | null,
    } | null > | null,
    role?: string | null,
    startDate?: string | null,
    status?: ProvedStatus | null,
    txHash?: string | null,
    nftTxHash?: string | null,
  } | null > | null,
};

/* tslint:disable */
/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const proofCreate = /* GraphQL */ `
  mutation ProofCreate($input: ProofCreateInput!) {
    proofCreate(input: $input) {
      id
      createdAt
      endDate
      org {
        id
        name
        discordIcon
        isOwner
      }
      ownerId
      provers {
        id
        createdAt
        email
        name
        nonce
        profileImage {
          bucket
          key
          region
        }
        verified
        subscribeMessage
        orgs {
          id
          name
          discordIcon
          isOwner
        }
      }
      role
      startDate
      status
      txHash
      nftTxHash
    }
  }
`;
export const proofUpdate = /* GraphQL */ `
  mutation ProofUpdate($input: ProofUpdateInput!) {
    proofUpdate(input: $input) {
      id
      createdAt
      endDate
      org {
        id
        name
        discordIcon
        isOwner
      }
      ownerId
      provers {
        id
        createdAt
        email
        name
        nonce
        profileImage {
          bucket
          key
          region
        }
        verified
        subscribeMessage
        orgs {
          id
          name
          discordIcon
          isOwner
        }
      }
      role
      startDate
      status
      txHash
      nftTxHash
    }
  }
`;
export const userUpdate = /* GraphQL */ `
  mutation UserUpdate($input: UserUpdateInput!) {
    userUpdate(input: $input) {
      id
      createdAt
      email
      name
      nonce
      profileImage {
        bucket
        key
        region
      }
      verified
      subscribeMessage
      orgs {
        id
        name
        discordIcon
        isOwner
      }
    }
  }
`;

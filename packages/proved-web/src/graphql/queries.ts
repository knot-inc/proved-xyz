/* tslint:disable */
/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const userGet = /* GraphQL */ `
  query UserGet($id: ID!) {
    userGet(id: $id) {
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
export const proofGet = /* GraphQL */ `
  query ProofGet($id: ID!) {
    proofGet(id: $id) {
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
export const proofDetailGet = /* GraphQL */ `
  query ProofDetailGet($id: ID!) {
    proofDetailGet(id: $id) {
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
      owner {
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
export const proofList = /* GraphQL */ `
  query ProofList($id: ID!) {
    proofList(id: $id) {
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

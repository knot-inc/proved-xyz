# Prerequisite

- **Ask tomo for .env.local file and place it under packages/proved-web/ **
- **Ask tomo for .env file and place it under packages/contracts/ **

# Setup

```
yarn install
cd packages/contracts
// generates typechain and abi file
yarn install && yarn compile && yarn abi
cd ../../
// copies typechain and abi file under cdk stack for web3 lambda layer
yarn copyContract
cd packages/proved-web
yarn install
// Setting up Frontend
// installs aws-amplify cli globally
npm install -g @aws-amplify/cli
$ amplify init --appId d2sndpe29tmpgb
// Setting up AppSync GraphQL
$amplify codegen add --apiId clqm2i3aprdwddgj5q3zjc2uwu
```

# Contract update

After updating the contract, run the command below to apply typechain and abi update on CDK

```
yarn copyContract
```

# Contract Deployment

- TBD

# Generating GraphQL types

### Backend

- run `yarn codegen` to generate types after updating `graphql/schema.graphql`
- Add generated type into `graphql/appSync.ts` in order to support typing for AppSyncHandler

### Frontend

- Frontend checks schema on AppSync. Use `amplify codegen` to generate types (this fetches schema information from Proved-dev Graphql API)

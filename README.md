
Demonstrate your DAO contributions on-chain to showcase your credentials.

# Setup
### Prerequisite
- This project uses AWS CDK for the backend and AWS Amplify for the frontend hosting. AWS account is required to deploy the service.
- Setup .env.local file and place it under packages/proved-web/ **
- Setup .env file and place it under packages/contracts/ **

### Initialize Contract

```
yarn install
cd packages/contracts
// generates typechain and abi file
yarn install && yarn compile && yarn abi
cd ../../
// copies typechain and abi file under cdk stack for web3 lambda layer
yarn copyContract
```

### Setup AWS
**You need to set AWS profile in your local env**

```
cd packages/cdk
yarn build && cdk:deploy

// take note of a GraphQL apiId(e.g. `clqm2i3aprdwddgj5q3zjc2uwu`)

cd packages/proved-web
yarn install
// Setting up Frontend
// installs aws-amplify cli globally
npm install -g @aws-amplify/cli
$ amplify init
// Setting up AppSync GraphQL(use the apiId generated above)
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

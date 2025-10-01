To deploy the smart contract on the Avalanche Fuji C-Chain test network you will need:

 - An Avalanche wallet with some test AVAX tokens

 - Docker installed on your machine

 - Makefile installed on your machine

## Steps to deploy

1. Clone env.example to .env and fill the variables with your own values

2. Run `make deploy` to deploy the smart contract

3. After deployment, the contract address will be saved in the `contract-address.json` file

4. You can verify the deployment by checking the contract address on the Avalanche Fuji C-Chain explorer: https://cchain.explorer.avax-test.network/

## Mint interface

1. run `make prod` to build the production version of the mint interface

2. go on `http://localhost:4173` to access the mint interface
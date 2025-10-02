# Buy i swear it will grow value next month

This project is a simple NFT minting dApp that allows users to mint a predefined NFT on the Avalanche Fuji C-Chain test network. The project consists of a smart contract written in Solidity and a frontend built with React and Ethers.js.

## Techs used
- Solidity: The programming language used to write smart contracts on EVM blockchain.
- Hardhat: A development environment to compile, deploy, test, and debug Ethereum software.
I chose Hardhat for its dev features and its compatibility with Ethers.js.
- OpenZeppelin: A solidity library containing reusable and secure smart contract components.
I chose OpenZeppelin for its standardized and tested implementations of ERC standards which helps to have secure and normalized contracts.
- Ethers.js: A js library for interacting with the Ethereum blockchain and its ecosystem on web browsers.
I chose Ethers.js for its ease of use and its compatibility with Metamask wallet.
- IPFS: A decentralized storage network to store and share data in a distributed file system.
I used IPFS to store the NFT metadata and image by the Pinata service.

## Implementation

### Smart Contract
The smart contract is implemented in Solidity and follows the ERC-721 standard for non-fungible tokens. It uses OpenZeppelin's ERC-721 implementation as a base and extends it with additional functionality for minting and the NFT price securely.

### Frontend
The frontend was created using React and Ethers.js. It allows users to connect their Metamask wallet, view the NFT collection, and mint the NFT.

### Deployment
The smart contract is deployed on the Avalanche Fuji C-Chain test network using Hardhat. My deploy.ts script save the contract address and ABI in a JSON file for easy access from the frontend.

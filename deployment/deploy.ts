
// This is a script for deploying your contracts. You can adapt it to deploy
// yours, or create new ones.

const path = require("path");

async function main() {
    const fs = require("fs");
    const mintFolder = path.join(__dirname, "./mint"); // Go up one level to find mint folder

    // read price from price.json
    const pricePath = path.join(mintFolder, "price.json");
    const priceData = fs.readFileSync(pricePath);
    const priceJson = JSON.parse(priceData);

    // ethers is available in the global scope
    const [deployer] = await ethers.getSigners();
    console.log(
        "Deploying the contracts with the account:",
        await deployer.getAddress()
    );

    // /   console.log("Account balance:", (await deployer.getBalance()).toString());
    // console.log("Account balance:", (await deployer.getBalance()).toString());

    const Token = await ethers.getContractFactory("Mame42");
    const token = await Token.deploy("ipfs://bafybeidcn7ay6mvbzcuejvpmihj2eyxehoz6lpo37dc22h2tr23r4z6cm4/", BigInt(priceJson.price)); // Use metadataJson instead of metadataData
    // No need to call token.deployed(), deploy() already waits for deployment

    console.log("Token address:", token.target);

    // We also save the contract's artifacts and address in the frontend directory
    saveFrontendFiles(token);
}

function saveFrontendFiles(token) {
    const fs = require("fs");
    const contractsDir = path.join(__dirname, "contracts");

    if (!fs.existsSync(contractsDir)) {
        fs.mkdirSync(contractsDir);
    }

    fs.writeFileSync(
        path.join(contractsDir, "contract-address.json"),
        JSON.stringify({ address: token.target }, undefined, 2)
    );

    const TokenArtifact = artifacts.readArtifactSync("Mame42");

    fs.writeFileSync(
        path.join(contractsDir, "Token.json"),
        JSON.stringify(TokenArtifact, null, 2)
    );
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });
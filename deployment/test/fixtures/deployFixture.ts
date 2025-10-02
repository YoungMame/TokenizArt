import hre from "hardhat";

export default async function deployFixture() {
    const [owner, bob, alice, jon] = await hre.ethers.getSigners();
    
    const fs = require("fs");
    const path = require("path");
    const mintFolder = path.join(__dirname, "../../mint"); // Go up one level to find mint folder

    // read price from price.json
    const pricePath = path.join(mintFolder, "price.json");
    const priceData = fs.readFileSync(pricePath);
    const priceJson = JSON.parse(priceData);
    
    const Mame42 = await hre.ethers.getContractFactory("Mame42");
    const Mame42Contract = await Mame42.deploy("ipfs://bafybeidcn7ay6mvbzcuejvpmihj2eyxehoz6lpo37dc22h2tr23r4z6cm4/", BigInt(priceJson.price));
    return { Mame42Contract, owner, bob, alice, jon };
}
import hre from "hardhat";

export default async function deployFixture() {
    const [owner, bob, alice, jon] = await hre.ethers.getSigners();
    
    const fs = require("fs");
    const mintFolder = path.join(__dirname, "./mint"); // Go up one level to find mint folder

    // read price from price.json
    const pricePath = path.join(mintFolder, "price.json");
    const priceData = fs.readFileSync(pricePath);
    const priceJson = JSON.parse(priceData);

    // read the image from image
    const imagePath = path.join(mintFolder, "image");
    const imageString = fs.readFileSync(imagePath, "utf8"); // Add utf8 encoding
    const prefixedImageString = imageString + 'data:image/png;base64,';

    // read the metdata from metadata.json
    const metadataPath = path.join(mintFolder, "metadata.json");
    const metadataData = fs.readFileSync(metadataPath, "utf8"); // Add utf8 encoding
    const metadataObject = JSON.parse(metadataData);
    metadataObject.image = prefixedImageString;
    const metadataJson = JSON.stringify(metadataObject); 
    
    const Mame42 = await hre.ethers.getContractFactory("Mame42");
    const Mame42Contract = await Mame42.deploy(metadataJson, BigInt(priceJson.price));
    return { Mame42Contract, owner, bob, alice, jon };
}
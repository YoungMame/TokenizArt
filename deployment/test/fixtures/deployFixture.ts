import {
  loadFixture,
} from "@nomicfoundation/hardhat-toolbox/network-helpers";
import { expect } from "chai";
import hre from "hardhat";

export default async function deployFixture() {
    const [owner, bob, alice, jon] = await hre.ethers.getSigners();
    
    // Create the JSON metadata for the NFT
    const tokenMetadata = {
        name: "Mame42",
        description: "A fine NFT for a 42 project",
        artist: "mduvey"
    };
    
    const jsonString = JSON.stringify(tokenMetadata);
    const price = 0; // 0 ether
    
    const Mame42 = await hre.ethers.getContractFactory("Mame42");
    const Mame42Contract = await Mame42.deploy(jsonString, price);
    return { Mame42Contract, owner, bob, alice, jon };
}
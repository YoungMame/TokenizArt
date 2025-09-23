import {
  loadFixture,
} from "@nomicfoundation/hardhat-toolbox/network-helpers";
import { expect } from "chai";
import hre from "hardhat";

export default async function deployFixture() {
    const [owner, bob, alice, jon] = await hre.ethers.getSigners();
    const Sheldon42 = await hre.ethers.getContractFactory("Sheldon42");
    const sheldon42Contract = await Sheldon42.deploy();
    return { sheldon42Contract, owner, bob, alice, jon };
}
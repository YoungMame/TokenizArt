import {
  loadFixture,
} from "@nomicfoundation/hardhat-toolbox/network-helpers";
import { expect } from "chai";
import hre from "hardhat";
import deployFixture from "./fixtures/deployFixture";
import filledAccountsFxiture from "./fixtures/filledAccountsFixture";

export const NAME = "Mame42";
export const SYMBOL = "SHL";

const fs = require('fs');
const path = require('path');
console.log(`__dirname: ${__dirname}`);
const mintPath = path.join(__dirname, '../mint/');
const imageName = 'image.jpg';
const fullImagePath = path.join(mintPath, imageName);

const imageData = fs.readFileSync(fullImagePath);
const base64Image = imageData.toString('base64');
const base64Prefix = 'data:image/png;base64,';
const tokenImageURI = base64Prefix + base64Image;
console.log(`Token URI: ${tokenImageURI.substring(0, 30)}...`);

describe("Mame42", function () {
  describe("Deployment", function () {

    it("Should have the right name and symbol", async function () {
      const { Mame42Contract, owner, bob, alice } = await loadFixture(deployFixture);
      expect(await Mame42Contract.name()).to.equal(NAME);
      expect(await Mame42Contract.symbol()).to.equal(SYMBOL);
    });

    it("Should mint tokens correctly", async function () {
      const { Mame42Contract, owner, bob, alice } = await loadFixture(deployFixture);

      // The contract is already deployed with metadata, so we just need to call mintNFT()
      const initialBalance = await Mame42Contract.balanceOf(bob.address);
      expect(initialBalance).to.equal(0);
      
      // Bob buys the NFT
      await Mame42Contract.connect(bob).mintNFT({ value: 0 }); // price is 0 ether
      
      expect(await Mame42Contract.balanceOf(bob.address)).to.equal(1);
      expect(await Mame42Contract.isSold()).to.equal(true);
      
      // Check that the token URI is properly set
      const tokenURI = await Mame42Contract.tokenURI(1);
      expect(tokenURI).to.include("data:application/json;base64,");
    });
  });
});

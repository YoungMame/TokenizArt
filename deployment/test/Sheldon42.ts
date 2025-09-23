import {
  loadFixture,
} from "@nomicfoundation/hardhat-toolbox/network-helpers";
import { expect } from "chai";
import hre from "hardhat";
import deployFixture from "./fixtures/deployFixture";
import filledAccountsFxiture from "./fixtures/filledAccountsFixture";

export const NAME = "Sheldon42";
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

describe("Sheldon42", function () {
  describe("Deployment", function () {

    it("Should have the right name and symbol", async function () {
      const { sheldon42Contract, owner, bob, alice } = await loadFixture(deployFixture);
      expect(await sheldon42Contract.name()).to.equal(NAME);
      expect(await sheldon42Contract.symbol()).to.equal(SYMBOL);
    });

    it("Should mint tokens correctly", async function () {
      const { sheldon42Contract, owner, bob, alice } = await loadFixture(deployFixture);

      const tokenURI = {
        name: "Sheldon42 #1",
        description: "The first Sheldon42 NFT",
        image: tokenImageURI
      };
      const encodedTokenURI = Buffer.from(JSON.stringify(tokenURI)).toString('base64');
      const uriSize = Buffer.byteLength(encodedTokenURI, 'utf8');
      console.log(`Token URI size: ${uriSize} bytes`);
      console.log(`Encoded Token URI: ${encodedTokenURI.substring(0, 30)}...`);
      await sheldon42Contract.connect(owner).mintNFT(bob.address, encodedTokenURI);
      expect(await sheldon42Contract.balanceOf(bob.address)).to.equal(1);
      expect(await sheldon42Contract.tokenURI(0)).to.equal(encodedTokenURI);
    });
  });
});

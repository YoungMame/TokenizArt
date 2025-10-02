import {
  loadFixture,
} from "@nomicfoundation/hardhat-toolbox/network-helpers";
import { expect } from "chai";
import hre from "hardhat";
import deployFixture from "./fixtures/deployFixture";
import filledAccountsFxiture from "./fixtures/filledAccountsFixture";

export const NAME = "Mame42";
export const SYMBOL = "MAM";

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
      const value = hre.ethers.parseEther("0.2");
      await Mame42Contract.connect(bob).mintNFT({ value: value });

      expect(await Mame42Contract.balanceOf(bob.address)).to.equal(1);
      expect(await Mame42Contract.isSold()).to.equal(true);
      
      // Check that the token URI is properly set
      const tokenURI = await Mame42Contract.tokenURI(1);
      console.log("Token URI:", tokenURI);
      expect(tokenURI).to.include("ipfs://");
    });
  });

  it("Bob shouldn't set nft price", async function () {
    const { Mame42Contract, owner, bob, alice } = await loadFixture(deployFixture);
    const value = hre.ethers.parseEther("42.0");
    await expect(Mame42Contract.connect(bob).setPrice(value)).to.be.revertedWithCustomError(Mame42Contract, "OwnableUnauthorizedAccount");
  });

  it("Owner should set nft price", async function () {
    const { Mame42Contract, owner, bob, alice } = await loadFixture(deployFixture);
    const value = hre.ethers.parseEther("42.0");
    expect(await Mame42Contract.connect(owner).setPrice(value)).to.not.be.reverted;
    expect(await Mame42Contract.connect(owner).price()).to.be.equal(value);
  });
});

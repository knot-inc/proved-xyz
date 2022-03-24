import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { expect } from "chai";
import { BigNumber } from "ethers";
import { ethers } from "hardhat";
import { PoW, ProofContract } from "../typechain";

describe("Pow", () => {
  let powContract: PoW;
  let owner: SignerWithAddress;
  let spender: SignerWithAddress;
  let holder: SignerWithAddress;
  let otherSigners: SignerWithAddress[];

  beforeEach(async () => {
    const PoWContractFactory = await ethers.getContractFactory("PoW");
    powContract = await PoWContractFactory.deploy();
    await powContract.deployed();
    [owner, spender, holder, ...otherSigners] = await ethers.getSigners();
  });

  describe("initialize", () => {
    it("should initialize", async () => {
      await powContract.initialize("Pow", "PowSymbol", "baseURI");
      expect(
        await powContract.hasRole(
          await powContract.DEFAULT_ADMIN_ROLE(),
          owner.address
        )
      ).to.be.true;
      expect(
        await powContract.hasRole(await powContract.MINT_ROLE(), owner.address)
      ).to.be.true;
      expect(await powContract.name()).to.equal("Pow");
      expect(await powContract.symbol()).to.equal("PowSymbol");
      expect(await powContract.saleIsActive()).to.equal(true);
    });
  });
  describe("mintToken", () => {
    beforeEach(async () => {
      await powContract.initialize("Pow", "PowSymbol", "baseURI/");
    });
    it("should mint token", async () => {
      await powContract.mintToken(holder.address, "randomId");
      expect(await powContract.balanceOf(holder.address)).to.equal(1);
    });
    it("should revert if not authorized", async () => {
      await expect(
        powContract.connect(holder).mintToken(holder.address, "randomId")
      ).revertedWith("Not authorized");
      expect(await powContract.balanceOf(otherSigners[1].address)).to.equal(0);
    });
    it("should revert sale is not active", async () => {
      await powContract.setSaleIsActive(false);
      await expect(
        powContract.mintToken(otherSigners[1].address, "randomId")
      ).revertedWith("Sale not active");
    });
  });
  describe("tokenURI", () => {
    beforeEach(async () => {
      await powContract.initialize(
        "Pow",
        "PowSymbol",
        "https://proved.xyz/proofnft/"
      );
      await powContract.mintToken(holder.address, "someId");
    });

    it("should return concat tokenURI", async () => {
      const tokenURI = await powContract.tokenURI(1);
      expect(tokenURI).to.equal("https://proved.xyz/proofnft/someId");
    });

    it("should return baseUrl when no tokenId matches", async () => {
      const tokenURI = await powContract.tokenURI(100);
      expect(tokenURI).to.equal("https://proved.xyz/proofnft/");
    });
  });

  describe("tokenID", () => {
    beforeEach(async () => {
      await powContract.initialize(
        "Pow",
        "PowSymbol",
        "https://proved.xyz/proofnft/"
      );
      await powContract.mintToken(holder.address, "someId");
    });

    it("should return tokenID", async () => {
      const tokenID = await powContract.tokenID("someId");
      expect(tokenID).to.equal(1);
    });

    it("should return 0 when tokenID does not exist", async () => {
      const tokenID = await powContract.tokenID("otherId");
      expect(tokenID).to.equal(0);
    });
  });

  describe("setBaseURI", () => {
    beforeEach(async () => {
      await powContract.initialize(
        "Pow",
        "PowSymbol",
        "https://proved.xyz/proofnft/"
      );
      await powContract.mintToken(holder.address, "someId");
    });

    it("should update baseURI", async () => {
      await powContract.setBaseURI("https://proved.xyz/updated/");
      const tokenURI = await powContract.tokenURI(1);
      expect(tokenURI).to.equal("https://proved.xyz/updated/someId");
    });

    it("should revert if not admin", async () => {
      await expect(
        powContract.connect(spender).setBaseURI("https://proved.xyz/updated/")
      ).to.be.revertedWith("Not authorized");
    });
  });
  describe("setSaleIsActive", () => {
    beforeEach(async () => {
      await powContract.initialize(
        "Pow",
        "PowSymbol",
        "https://proved.xyz/proofnft/"
      );
    });
    it("should update saleActiveStatus", async () => {
      await powContract.setSaleIsActive(false);
      expect(await powContract.saleIsActive()).to.be.false;
    });
    it("should revert if not admin", async () => {
      await expect(
        powContract.connect(spender).setSaleIsActive(false)
      ).to.be.revertedWith("Not authorized");
    });
  });
});

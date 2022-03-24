import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { expect } from "chai";
import { BigNumber } from "ethers";
import { ethers } from "hardhat";
import { ProofContract } from "../typechain";

describe("ProofContract", function () {
  let proofContract: ProofContract;
  let owner: SignerWithAddress;
  let prover1: SignerWithAddress;
  let prover2: SignerWithAddress;
  let otherSigners: SignerWithAddress[];

  beforeEach(async () => {
    const ProofContractFactory = await ethers.getContractFactory(
      "ProofContract"
    );
    proofContract = await ProofContractFactory.deploy();
    await proofContract.deployed();
    [owner, prover1, prover2, ...otherSigners] = await ethers.getSigners();
  });

  describe("initialize", () => {
    it("should set admin role to owner", async () => {
      await proofContract.initialize();
      expect(
        await proofContract.hasRole(
          await proofContract.DEFAULT_ADMIN_ROLE(),
          owner.address
        )
      ).to.be.true;
      expect(
        await proofContract.hasRole(
          await proofContract.AUTH_ROLE(),
          owner.address
        )
      ).to.be.true;
    });
  });

  describe("addProof", () => {
    beforeEach(async () => {
      await proofContract.initialize();
    });

    it("should add proof", async () => {
      const result = await proofContract.addProof(
        "internal-abcd",
        prover1.address,
        1640592293,
        1640592300,
        "https://proved.xyz/content/12",
        owner.address
      );

      const expected = [
        "internal-abcd",
        prover1.address,
        BigNumber.from(1),
        BigNumber.from(1640592293),
        BigNumber.from(1640592300),
      ];

      expect(result).to.emit(proofContract, "AddProof");

      const proof = await proofContract.proofs(owner.address, 0);

      expect(proof).deep.equal(expected);
    });

    it("should require AUTH_ROLE", async () => {
      // change owner to someone
      await expect(
        proofContract
          .connect(otherSigners[3])
          .addProof(
            "internal-abcd",
            prover1.address,
            1640592293,
            1640592300,
            "https://proved.xyz/content/12",
            owner.address
          )
      ).to.be.revertedWith("No Auth");
    });
    it("should revert if proof already exists", async () => {
      await proofContract.addProof(
        "internal-abcd",
        prover1.address,
        1640592293,
        1640592300,
        "https://proved.xyz/content/12",
        owner.address
      );

      await expect(
        proofContract.addProof(
          "internal-abcd",
          prover1.address,
          1640592293,
          1640592300,
          "https://proved.xyz/content/12",
          owner.address
        )
      ).to.be.revertedWith("Proof exists");
    });
  });

  describe("updateProofDateRange", () => {
    beforeEach(async () => {
      await proofContract.initialize();
      await proofContract.addProof(
        "internal-abcd",
        prover1.address,
        1640592293,
        1640592300,
        "https://proved.xyz/content/12",
        owner.address
      );
    });

    it("should update proof data", async () => {
      const result = await proofContract.updateProofDateRange(
        0,
        0,
        1640592400,
        owner.address
      );
      const expected = [
        "internal-abcd",
        prover1.address,
        BigNumber.from(1),
        BigNumber.from(1640592293),
        BigNumber.from(1640592400),
      ];

      const proof = await proofContract.proofs(owner.address, 0);

      expect(proof).deep.equal(expected);
      expect(result).to.emit(proofContract, "UpdateProof");
    });

    it("should revert when not authorized", async () => {
      await expect(
        proofContract
          .connect(otherSigners[3])
          .updateProofDateRange(0, 0, 1640592400, prover1.address)
      ).to.be.revertedWith("No Auth");
    });
  });

  describe("endorseProof", () => {
    beforeEach(async () => {
      await proofContract.initialize();
      await proofContract.addProof(
        "internal-abcd",
        prover1.address,
        1640592293,
        1640592300,
        "https://proved.xyz/content/12",
        owner.address
      );
      // precondition: auth prover
      await proofContract.grantRole(
        await proofContract.AUTH_ROLE(),
        prover2.address
      );
    });

    it("should update Endorsement", async () => {
      const result = await proofContract.endorseProof(
        0,
        prover2.address,
        owner.address,
        "content"
      );

      const expected = [
        "internal-abcd",
        prover1.address,
        BigNumber.from(2),
        BigNumber.from(1640592293),
        BigNumber.from(1640592300),
      ];

      const proof = await proofContract.proofs(owner.address, 0);

      expect(proof).deep.equal(expected);
      expect(result).to.emit(proofContract, "EndorseProof");
    });

    it("should revert when endorse does not exist", async () => {
      await expect(
        proofContract.endorseProof(
          10,
          prover2.address,
          owner.address,
          "content"
        )
      ).to.be.revertedWith("No Proof");
    });

    it("should revert when prover already exists", async () => {
      await proofContract.endorseProof(
        0,
        prover2.address,
        owner.address,
        "content1"
      );
      await expect(
        proofContract.endorseProof(
          0,
          prover2.address,
          owner.address,
          "content2"
        )
      ).to.be.revertedWith("Endorse exists");
    });

    it("should revert when sender is not authorized", async () => {
      await expect(
        proofContract
          .connect(otherSigners[3])
          .endorseProof(0, otherSigners[4].address, owner.address, "content")
      ).to.be.revertedWith("No Auth");
    });
    // TODO: prover should have AUTH_ROLE
    // it("should revert when prover is not authorized", async () => {
    //   await expect(
    //     proofContract.endorseProof(
    //       0,
    //       otherSigners[4].address,
    //       owner.address,
    //       "content"
    //     )
    //   ).to.be.revertedWith("No Auth");
    // });
  });

  describe("proofsOfOwner", () => {
    beforeEach(async () => {
      await proofContract.initialize();
      await proofContract.addProof(
        "internal-abcd",
        prover1.address,
        1640592293,
        1640592300,
        "https://proved.xyz/content/12",
        owner.address
      );
    });
    it("should return proofs by owner address", async () => {
      const expected = [
        "internal-abcd",
        prover1.address,
        BigNumber.from(1),
        BigNumber.from(1640592293),
        BigNumber.from(1640592300),
      ];

      const result = await proofContract.proofsOfOwner(owner.address);

      expect(result).deep.equal([expected]);
    });
  });

  describe("proversByProof", () => {
    beforeEach(async () => {
      await proofContract.initialize();
      await proofContract.addProof(
        "internal-abcd",
        prover1.address,
        1640592293,
        1640592300,
        "https://proved.xyz/content/12",
        owner.address
      );
    });
    it("should return provers by proofId", async () => {
      const result = await proofContract.proversByProof(owner.address, 0);
      const expected = [prover1.address, "https://proved.xyz/content/12"];
      expect(result).deep.equal([expected]);
    });
  });

  const adminErrorMessage = (address: string, role: string) =>
    `AccessControl: account ${address.toLowerCase()} is missing role ${role}`;

  describe("grantAuth", () => {
    beforeEach(async () => {
      await proofContract.initialize();
    });
    it("should set AUTH_ROLE", async () => {
      await proofContract.grantAuth(prover1.address);

      expect(
        await proofContract.hasRole(
          await proofContract.AUTH_ROLE(),
          prover1.address
        )
      ).to.be.true;
    });
    it("should revert if not admin", async () => {
      // https://github.com/ethers-io/ethers.js/issues/1449
      // transaction signer should be updated by reconnecting
      await expect(
        proofContract.connect(otherSigners[3]).grantAuth(prover1.address)
      ).to.be.revertedWith(
        adminErrorMessage(
          otherSigners[3].address,
          await proofContract.DEFAULT_ADMIN_ROLE()
        )
      );
    });
  });

  describe("revokeAuth", () => {
    beforeEach(async () => {
      await proofContract.initialize();
      await proofContract.grantRole(
        await proofContract.AUTH_ROLE(),
        otherSigners[3].address
      );
    });
    it("should revoke AUTH_ROLE", async () => {
      await proofContract.revokeAuth(otherSigners[3].address);

      expect(
        await proofContract.hasRole(
          await proofContract.AUTH_ROLE(),
          otherSigners[3].address
        )
      ).to.be.false;
    });

    it("should revert if not admin", async () => {
      await expect(
        proofContract.connect(otherSigners[3]).grantAuth(prover1.address)
      ).to.be.revertedWith(
        adminErrorMessage(
          otherSigners[3].address,
          await proofContract.DEFAULT_ADMIN_ROLE()
        )
      );
    });
  });

  describe("removeProof", () => {
    beforeEach(async () => {
      await proofContract.initialize();
      await proofContract.addProof(
        "internal-abcd",
        prover1.address,
        1640592293,
        1640592300,
        "https://proved.xyz/content/12",
        owner.address
      );
    });
    it("should remove proof", async () => {
      await proofContract.removeProof(owner.address, 0);
      await expect(proofContract.proofs(owner.address, 0)).to.be.revertedWith(
        ""
      );
    });
    it("should revert if proofId is out of bound", async () => {
      await expect(
        proofContract.removeProof(owner.address, 1)
      ).to.be.revertedWith("Out of Bound");
    });
    it("should revert if not admin", async () => {
      await expect(
        proofContract.connect(otherSigners[3]).removeProof(owner.address, 0)
      ).to.be.revertedWith(
        adminErrorMessage(
          otherSigners[3].address,
          await proofContract.DEFAULT_ADMIN_ROLE()
        )
      );
    });
  });

  describe("grantRole", () => {
    beforeEach(async () => {
      await proofContract.initialize();
    });

    it("should grant role", async () => {
      await proofContract.grantRole(
        await proofContract.DEFAULT_ADMIN_ROLE(),
        otherSigners[4].address
      );

      expect(
        proofContract.hasRole(
          await proofContract.DEFAULT_ADMIN_ROLE(),
          otherSigners[4].address
        )
      );
    });
  });
});

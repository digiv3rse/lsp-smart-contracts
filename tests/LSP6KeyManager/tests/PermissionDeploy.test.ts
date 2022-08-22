import { expect } from "chai";
import { ethers } from "hardhat";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { calculateCreate2 } from "eth-create2-calculator";

import { TargetContract__factory } from "../../../types";

// constants
import {
  ERC725YKeys,
  ALL_PERMISSIONS,
  PERMISSIONS,
  OPERATION_TYPES,
  EventSignatures,
} from "../../../constants";

// setup
import { LSP6TestContext } from "../../utils/context";
import { setupKeyManager } from "../../utils/fixtures";

export const shouldBehaveLikePermissionDeploy = (
  buildContext: () => Promise<LSP6TestContext>
) => {
  let context: LSP6TestContext;

  let addressCanDeploy: SignerWithAddress,
    addressCannotDeploy: SignerWithAddress;

  beforeEach(async () => {
    context = await buildContext();

    addressCanDeploy = context.accounts[1];
    addressCannotDeploy = context.accounts[2];

    const permissionKeys = [
      ERC725YKeys.LSP6["AddressPermissions:Permissions"] +
        context.owner.address.substring(2),
      ERC725YKeys.LSP6["AddressPermissions:Permissions"] +
        addressCanDeploy.address.substring(2),
      ERC725YKeys.LSP6["AddressPermissions:Permissions"] +
        addressCannotDeploy.address.substring(2),
    ];

    const permissionsValues = [
      ALL_PERMISSIONS,
      PERMISSIONS.DEPLOY,
      PERMISSIONS.CALL,
    ];

    await setupKeyManager(context, permissionKeys, permissionsValues);
  });

  describe("when caller has ALL PERMISSIONS", () => {
    it("should be allowed to deploy a contract TargetContract via CREATE", async () => {
      let contractBytecodeToDeploy = TargetContract__factory.bytecode;

      let payload = context.universalProfile.interface.encodeFunctionData(
        "execute",
        [
          OPERATION_TYPES.CREATE, // operation type
          ethers.constants.AddressZero, // recipient
          0, // value
          contractBytecodeToDeploy, // data
        ]
      );

      const expectedContractAddress = await context.keyManager
        .connect(context.owner)
        .callStatic.execute(payload);

      let tx = await context.keyManager.connect(context.owner).execute(payload);
      let receipt = await tx.wait();

      // should be the ContractCreated event (= event signature)
      expect(receipt.logs[0].topics[0]).to.equal(
        EventSignatures.ERC725X["ContractCreated"]
      );

      // operation type
      expect(receipt.logs[0].topics[1]).to.equal(
        ethers.utils.hexZeroPad(OPERATION_TYPES.CREATE, 32)
      );

      // address of contract created
      expect(receipt.logs[0].topics[2]).to.equal(
        ethers.utils.hexZeroPad(expectedContractAddress, 32)
      );

      // value
      expect(receipt.logs[0].topics[3]).to.equal(
        ethers.utils.hexZeroPad(ethers.utils.hexlify(0), 32)
      );
    });

    it("should be allowed to deploy a contract TargetContract via CREATE2", async () => {
      let contractBytecodeToDeploy = TargetContract__factory.bytecode;
      let salt =
        "0xcafecafecafecafecafecafecafecafecafecafecafecafecafecafecafecafe";

      let payload = context.universalProfile.interface.encodeFunctionData(
        "execute",
        [
          OPERATION_TYPES.CREATE2,
          ethers.constants.AddressZero,
          0,
          contractBytecodeToDeploy + salt.substring(2),
        ]
      );

      let preComputedAddress = calculateCreate2(
        context.universalProfile.address,
        salt,
        contractBytecodeToDeploy
      ).toLowerCase();

      let tx = await context.keyManager.connect(context.owner).execute(payload);

      let receipt = await tx.wait();

      expect(receipt.logs[0].topics[0]).to.equal(
        EventSignatures.ERC725X["ContractCreated"]
      );
      expect(receipt.logs[0].topics[1]).to.equal(
        ethers.utils.hexZeroPad(OPERATION_TYPES.CREATE2, 32)
      );
      expect(receipt.logs[0].topics[2]).to.equal(
        ethers.utils.hexZeroPad(preComputedAddress, 32)
      );
      expect(receipt.logs[0].topics[3]).to.equal(
        ethers.utils.hexZeroPad(ethers.utils.hexlify(0), 32)
      );
    });
  });

  describe("when caller is an address with permission DEPLOY", () => {
    it("should be allowed to deploy a contract TargetContract via CREATE", async () => {
      let contractBytecodeToDeploy = TargetContract__factory.bytecode;

      let payload = context.universalProfile.interface.encodeFunctionData(
        "execute",
        [
          OPERATION_TYPES.CREATE,
          ethers.constants.AddressZero,
          0,
          contractBytecodeToDeploy,
        ]
      );

      const expectedContractAddress = await context.keyManager
        .connect(addressCanDeploy)
        .callStatic.execute(payload);

      let tx = await context.keyManager.connect(context.owner).execute(payload);
      let receipt = await tx.wait();

      expect(receipt.logs[0].topics[0]).to.equal(
        EventSignatures.ERC725X["ContractCreated"]
      );
      expect(receipt.logs[0].topics[1]).to.equal(
        ethers.utils.hexZeroPad(OPERATION_TYPES.CREATE, 32)
      );
      expect(receipt.logs[0].topics[2]).to.equal(
        ethers.utils.hexZeroPad(expectedContractAddress, 32)
      );
      expect(receipt.logs[0].topics[3]).to.equal(
        ethers.utils.hexZeroPad(ethers.utils.hexlify(0), 32)
      );
    });

    it("should be allowed to deploy a contract TargetContract via CREATE2", async () => {
      let contractBytecodeToDeploy = TargetContract__factory.bytecode;
      let salt =
        "0xcafecafecafecafecafecafecafecafecafecafecafecafecafecafecafecafe";

      let payload = context.universalProfile.interface.encodeFunctionData(
        "execute",
        [
          OPERATION_TYPES.CREATE2,
          ethers.constants.AddressZero,
          0,
          contractBytecodeToDeploy + salt.substring(2),
        ]
      );

      let preComputedAddress = calculateCreate2(
        context.universalProfile.address,
        salt,
        contractBytecodeToDeploy
      ).toLowerCase();

      let tx = await context.keyManager
        .connect(addressCanDeploy)
        .execute(payload);

      let receipt = await tx.wait();

      expect(receipt.logs[0].topics[0]).to.equal(
        EventSignatures.ERC725X["ContractCreated"]
      );
      expect(receipt.logs[0].topics[1]).to.equal(
        ethers.utils.hexZeroPad(OPERATION_TYPES.CREATE2, 32)
      );
      expect(receipt.logs[0].topics[2]).to.equal(
        ethers.utils.hexZeroPad(preComputedAddress, 32)
      );
      expect(receipt.logs[0].topics[3]).to.equal(
        ethers.utils.hexZeroPad(ethers.utils.hexlify(0), 32)
      );
    });
  });

  describe("when caller is an address that does not have the permission DEPLOY", () => {
    describe("when calling via execute(...)", () => {
      it("should revert when trying to deploy a contract via CREATE", async () => {
        let contractBytecodeToDeploy = TargetContract__factory.bytecode;

        let payload = context.universalProfile.interface.encodeFunctionData(
          "execute",
          [
            OPERATION_TYPES.CREATE,
            ethers.constants.AddressZero,
            0,
            contractBytecodeToDeploy,
          ]
        );

        await expect(
          context.keyManager.connect(addressCannotDeploy).execute(payload)
        )
          .to.be.revertedWithCustomError(context.keyManager, "NotAuthorised")
          .withArgs(addressCannotDeploy.address, "CREATE");
      });

      it("should revert when trying to deploy a contract via CREATE2", async () => {
        let contractBytecodeToDeploy = TargetContract__factory.bytecode;
        let salt =
          "0xcafecafecafecafecafecafecafecafecafecafecafecafecafecafecafecafe";

        let payload = context.universalProfile.interface.encodeFunctionData(
          "execute",
          [
            OPERATION_TYPES.CREATE2,
            ethers.constants.AddressZero,
            0,
            contractBytecodeToDeploy + salt.substring(2),
          ]
        );

        await expect(
          context.keyManager.connect(addressCannotDeploy).execute(payload)
        )
          .to.be.revertedWithCustomError(context.keyManager, "NotAuthorised")
          .withArgs(addressCannotDeploy.address, "CREATE2");
      });
    });

    describe("when calling via executeRelayCall(...)", () => {
      it("should revert when trying to deploy a contract via CREATE", async () => {
        let contractBytecodeToDeploy = TargetContract__factory.bytecode;

        let nonce = await context.keyManager.callStatic.getNonce(
          addressCannotDeploy.address,
          0
        );

        let payload = context.universalProfile.interface.encodeFunctionData(
          "execute",
          [
            OPERATION_TYPES.CREATE,
            ethers.constants.AddressZero,
            0,
            contractBytecodeToDeploy,
          ]
        );

        const HARDHAT_CHAINID = 31337;

        let hash = ethers.utils.solidityKeccak256(
          ["uint256", "address", "uint256", "bytes"],
          [HARDHAT_CHAINID, context.keyManager.address, nonce, payload]
        );

        let signature = await addressCannotDeploy.signMessage(
          ethers.utils.arrayify(hash)
        );

        await expect(
          context.keyManager
            .connect(addressCannotDeploy)
            .executeRelayCall(signature, nonce, payload)
        )
          .to.be.revertedWithCustomError(context.keyManager, "NotAuthorised")
          .withArgs(addressCannotDeploy.address, "CREATE");
      });

      it("should revert when trying to deploy a contract via CREATE2", async () => {
        let contractBytecodeToDeploy = TargetContract__factory.bytecode;

        let nonce = await context.keyManager.callStatic.getNonce(
          addressCannotDeploy.address,
          0
        );

        let salt =
          "0xcafecafecafecafecafecafecafecafecafecafecafecafecafecafecafecafe";

        let payload = context.universalProfile.interface.encodeFunctionData(
          "execute",
          [
            OPERATION_TYPES.CREATE2,
            ethers.constants.AddressZero,
            0,
            contractBytecodeToDeploy + salt.substring(2),
          ]
        );

        const HARDHAT_CHAINID = 31337;

        let hash = ethers.utils.solidityKeccak256(
          ["uint256", "address", "uint256", "bytes"],
          [HARDHAT_CHAINID, context.keyManager.address, nonce, payload]
        );

        let signature = await addressCannotDeploy.signMessage(
          ethers.utils.arrayify(hash)
        );

        await expect(
          context.keyManager
            .connect(addressCannotDeploy)
            .executeRelayCall(signature, nonce, payload)
        )
          .to.be.revertedWithCustomError(context.keyManager, "NotAuthorised")
          .withArgs(addressCannotDeploy.address, "CREATE2");
      });
    });
  });
};

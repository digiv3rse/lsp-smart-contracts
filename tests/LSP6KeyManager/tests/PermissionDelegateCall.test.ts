import { ethers } from "hardhat";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";

import {
  ERC725YDelegateCall,
  ERC725YDelegateCall__factory,
} from "../../../types";

// constants
import {
  ERC725YKeys,
  ALL_PERMISSIONS_SET,
  PERMISSIONS,
  OPERATIONS,
} from "../../../constants";

// setup
import { LSP6TestContext } from "../../utils/context";
import { setupKeyManager } from "../../utils/fixtures";

// helpers
import { abiCoder, NotAuthorisedError } from "../../utils/helpers";

export const shouldBehaveLikePermissionDelegateCall = (
  buildContext: () => Promise<LSP6TestContext>
) => {
  let context: LSP6TestContext;

  let addressCanDelegateCall: SignerWithAddress,
    addressCannotDelegateCall: SignerWithAddress;

  let erc725YDelegateCallContract: ERC725YDelegateCall;

  beforeEach(async () => {
    context = await buildContext();

    addressCanDelegateCall = context.accounts[1];
    addressCannotDelegateCall = context.accounts[2];

    erc725YDelegateCallContract = await new ERC725YDelegateCall__factory(
      context.owner
    ).deploy(context.universalProfile.address);

    const permissionKeys = [
      ERC725YKeys.LSP6["AddressPermissions:Permissions"] +
        context.owner.address.substring(2),
      ERC725YKeys.LSP6["AddressPermissions:Permissions"] +
        addressCanDelegateCall.address.substring(2),
      ERC725YKeys.LSP6["AddressPermissions:Permissions"] +
        addressCannotDelegateCall.address.substring(2),
    ];

    const permissionsValues = [
      ALL_PERMISSIONS_SET,
      ethers.utils.hexZeroPad(PERMISSIONS.DELEGATECALL, 32),
      ethers.utils.hexZeroPad(PERMISSIONS.CALL, 32),
    ];

    await setupKeyManager(context, permissionKeys, permissionsValues);
  });

  describe("when trying to make a DELEGATECALL via UP", () => {
    it("should pass when the caller has ALL PERMISSIONS", async () => {
      const key =
        "0xaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa";
      const value = "0xbbbbbbbbbbbbbbbb";

      // first check that nothing is set under this key
      // inside the storage of the calling UP
      const currentStorage = await context.universalProfile["getData(bytes32)"](
        key
      );
      expect(currentStorage).toEqual("0x");

      // Doing a delegatecall to the setData function of another UP
      // should update the ERC725Y storage of the UP making the delegatecall
      let delegateCallPayload =
        erc725YDelegateCallContract.interface.encodeFunctionData(
          "updateStorage(bytes32,bytes)",
          [key, value]
        );

      let executePayload =
        context.universalProfile.interface.encodeFunctionData("execute", [
          OPERATIONS.DELEGATECALL,
          erc725YDelegateCallContract.address,
          0,
          delegateCallPayload,
        ]);

      await context.keyManager.connect(context.owner).execute(executePayload);

      // verify that the setData ran in the context of the calling UP
      // and that it updated its ERC725Y storage
      const newStorage = await context.universalProfile["getData(bytes32)"](
        key
      );
      expect(newStorage).toEqual(value);
    });

    it("should pass if caller has permission DELEGATECALL", async () => {
      const key =
        "0xaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa";
      const value = "0xbbbbbbbbbbbbbbbb";

      // first check that nothing is set under this key
      // inside the storage of the calling UP
      const currentStorage = await context.universalProfile["getData(bytes32)"](
        key
      );
      expect(currentStorage).toEqual("0x");

      // Doing a delegatecall to the setData function of another UP
      // should update the ERC725Y storage of the UP making the delegatecall
      let delegateCallPayload =
        erc725YDelegateCallContract.interface.encodeFunctionData(
          "updateStorage(bytes32,bytes)",
          [key, value]
        );

      let executePayload =
        context.universalProfile.interface.encodeFunctionData("execute", [
          OPERATIONS.DELEGATECALL,
          erc725YDelegateCallContract.address,
          0,
          delegateCallPayload,
        ]);

      await context.keyManager
        .connect(addressCanDelegateCall)
        .execute(executePayload);

      // verify that the setData ran in the context of the calling UP
      // and that it updated its ERC725Y storage
      const newStorage = await context.universalProfile["getData(bytes32)"](
        key
      );
      expect(newStorage).toEqual(value);
    });

    it("should fail when caller does not have permission DELEGATECALL", async () => {
      const key =
        "0xaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa";
      const value = "0xbbbbbbbbbbbbbbbb";

      // first check that nothing is set under this key
      // inside the storage of the calling UP
      const currentStorage = await context.universalProfile["getData(bytes32)"](
        key
      );
      expect(currentStorage).toEqual("0x");

      // Doing a delegatecall to the setData function of another UP
      // should update the ERC725Y storage of the UP making the delegatecall
      let delegateCallPayload =
        erc725YDelegateCallContract.interface.encodeFunctionData(
          "setData(bytes32[],bytes[])",
          [[key], [value]]
        );

      let executePayload =
        context.universalProfile.interface.encodeFunctionData("execute", [
          OPERATIONS.DELEGATECALL,
          erc725YDelegateCallContract.address,
          0,
          delegateCallPayload,
        ]);

      await expect(
        context.keyManager
          .connect(addressCannotDelegateCall)
          .execute(executePayload)
      ).toBeRevertedWith(
        NotAuthorisedError(addressCannotDelegateCall.address, "DELEGATECALL")
      );
    });
  });

  describe("when caller has permission SUPER_DELEGATECALL + 2 x allowed addresses", () => {
    let caller: SignerWithAddress;

    let allowedDelegateCallContracts: [
      ERC725YDelegateCall,
      ERC725YDelegateCall
    ];

    beforeEach(async () => {
      context = await buildContext();

      caller = context.accounts[1];

      allowedDelegateCallContracts = [
        await new ERC725YDelegateCall__factory(context.accounts[0]).deploy(
          context.accounts[0].address
        ),
        await new ERC725YDelegateCall__factory(context.accounts[0]).deploy(
          context.accounts[0].address
        ),
      ];

      const permissionKeys = [
        ERC725YKeys.LSP6["AddressPermissions:Permissions"] +
          caller.address.substring(2),
        ERC725YKeys.LSP6["AddressPermissions:AllowedAddresses"] +
          caller.address.substring(2),
      ];

      const permissionValues = [
        ethers.utils.hexZeroPad(PERMISSIONS.SUPER_DELEGATECALL, 32),
        abiCoder.encode(
          ["address[]"],
          [
            [
              allowedDelegateCallContracts[0].address,
              allowedDelegateCallContracts[1].address,
            ],
          ]
        ),
      ];

      await setupKeyManager(context, permissionKeys, permissionValues);
    });

    describe("when calling a disallowed contract", () => {
      let randomContracts: ERC725YDelegateCall[];

      beforeAll(async () => {
        randomContracts = [
          await new ERC725YDelegateCall__factory(context.accounts[0]).deploy(
            context.accounts[0].address
          ),
          await new ERC725YDelegateCall__factory(context.accounts[0]).deploy(
            context.accounts[0].address
          ),
          await new ERC725YDelegateCall__factory(context.accounts[0]).deploy(
            context.accounts[0].address
          ),
          await new ERC725YDelegateCall__factory(context.accounts[0]).deploy(
            context.accounts[0].address
          ),
          await new ERC725YDelegateCall__factory(context.accounts[0]).deploy(
            context.accounts[0].address
          ),
        ];
      });

      describe("it should bypass allowed addresses check", () => {
        for (let ii = 0; ii < 5; ii++) {
          it(`should allow delegate call to contract nb ${ii}`, async () => {
            const key =
              "0xaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa";
            const value = "0xbbbbbbbbbbbbbbbb";

            const currentStorage = await context.universalProfile[
              "getData(bytes32)"
            ](key);
            expect(currentStorage).toEqual("0x");

            // prettier-ignore
            let delegateCallPayload = randomContracts[ii].interface.encodeFunctionData(
              "updateStorage(bytes32,bytes)", [
                key,
                value,
              ]);

            let executePayload =
              context.universalProfile.interface.encodeFunctionData("execute", [
                OPERATIONS.DELEGATECALL,
                randomContracts[ii].address,
                0,
                delegateCallPayload,
              ]);

            await context.keyManager.connect(caller).execute(executePayload);

            const newStorage = await context.universalProfile[
              "getData(bytes32)"
            ](key);
            expect(newStorage).toEqual(value);
          });
        }
      });
    });

    describe("when calling an allowed contract", () => {
      it("should allow to interact with the 1st allowed contract", async () => {
        const key =
          "0xaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa";
        const value = "0xbbbbbbbbbbbbbbbb";

        // prettier-ignore
        const currentStorage = await context.universalProfile["getData(bytes32)"](key);
        expect(currentStorage).toEqual("0x");

        // prettier-ignore
        let delegateCallPayload = allowedDelegateCallContracts[0].interface.encodeFunctionData(
          "updateStorage(bytes32,bytes)", [
            key,
            value,
          ]);

        let executePayload =
          context.universalProfile.interface.encodeFunctionData("execute", [
            OPERATIONS.DELEGATECALL,
            allowedDelegateCallContracts[0].address,
            0,
            delegateCallPayload,
          ]);

        await context.keyManager.connect(caller).execute(executePayload);

        // prettier-ignore
        const newStorage = await context.universalProfile["getData(bytes32)"](key);
        expect(newStorage).toEqual(value);
      });

      it("should allow to interact with the 2nd allowed contract", async () => {
        const key =
          "0xaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa";
        const value = "0xbbbbbbbbbbbbbbbb";

        // prettier-ignore
        const currentStorage = await context.universalProfile["getData(bytes32)"](key);
        expect(currentStorage).toEqual("0x");

        // prettier-ignore
        let delegateCallPayload = allowedDelegateCallContracts[1].interface.encodeFunctionData(
          "updateStorage(bytes32,bytes)", [
            key,
            value,
          ]);

        let executePayload =
          context.universalProfile.interface.encodeFunctionData("execute", [
            OPERATIONS.DELEGATECALL,
            allowedDelegateCallContracts[1].address,
            0,
            delegateCallPayload,
          ]);

        await context.keyManager.connect(caller).execute(executePayload);

        // prettier-ignore
        const newStorage = await context.universalProfile["getData(bytes32)"](key);
        expect(newStorage).toEqual(value);
      });
    });
  });
};

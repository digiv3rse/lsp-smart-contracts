import { expect } from "chai";
import { BigNumber } from "ethers";

import { LSP6TestContext, LSP6InternalsTestContext } from "../utils/context";
import { INTERFACE_IDS } from "../../constants";

import {
  // Admin
  shouldBehaveLikePermissionChangeOwner,
  shouldBehaveLikePermissionChangeOrAddExtensions,
  shouldBehaveLikePermissionChangeOrAddURD,
  shouldBehaveLikePermissionSign,

  // Set Permission
  shouldBehaveLikePermissionChangeOrAddController,
  shouldBehaveLikeSettingAllowedCalls,

  // Interactions
  shouldBehaveLikePermissionCall,
  shouldBehaveLikePermissionStaticCall,
  shouldBehaveLikePermissionDelegateCall,
  shouldBehaveLikePermissionDeploy,
  shouldBehaveLikePermissionTransferValue,
  shouldBehaveLikeAllowedAddresses,
  shouldBehaveLikeAllowedFunctions,
  shouldBehaveLikeAllowedStandards,

  // Relay
  shouldBehaveLikeMultiChannelNonce,
  shouldBehaveLikeExecuteRelayCall,

  // Batch
  shouldBehaveLikeBatchExecute,

  // Reentrancy
  testReentrancyScenarios,

  // SetData
  shouldBehaveLikePermissionSetData,
  shouldBehaveLikeAllowedERC725YDataKeys,

  // Others
  testSecurityScenarios,
  otherTestScenarios,

  // Internals
  testAllowedCallsInternals,
  testAllowedERC725YDataKeysInternals,
  testReadingPermissionsInternals,
} from "./index";

export const shouldBehaveLikeLSP6 = (
  buildContext: (initialFunding?: BigNumber) => Promise<LSP6TestContext>
) => {
  describe("CHANGEOWNER", () => {
    shouldBehaveLikePermissionChangeOwner(buildContext);
  });

  describe("Set Permissions", () => {
    shouldBehaveLikeSettingAllowedCalls(buildContext);
    shouldBehaveLikePermissionChangeOrAddController(buildContext);
  });

  describe("CHANGE / ADD extensions", () => {
    shouldBehaveLikePermissionChangeOrAddExtensions(buildContext);
  });

  describe("CHANGE / ADD UniversalReceiverDelegate", () => {
    shouldBehaveLikePermissionChangeOrAddURD(buildContext);
  });

  describe("SETDATA", () => {
    shouldBehaveLikePermissionSetData(buildContext);
  });

  describe("CALL", () => {
    shouldBehaveLikePermissionCall(buildContext);
  });

  describe("STATICCALL", () => {
    shouldBehaveLikePermissionStaticCall(buildContext);
  });

  describe("DELEGATECALL", () => {
    shouldBehaveLikePermissionDelegateCall(buildContext);
  });

  describe("DEPLOY", () => {
    shouldBehaveLikePermissionDeploy(buildContext);
  });

  describe("TRANSFERVALUE", () => {
    shouldBehaveLikePermissionTransferValue(buildContext);
  });

  describe("SIGN (ERC1271)", () => {
    shouldBehaveLikePermissionSign(buildContext);
  });

  describe("ALLOWED CALLS", () => {
    shouldBehaveLikeAllowedAddresses(buildContext);
    shouldBehaveLikeAllowedFunctions(buildContext);
    shouldBehaveLikeAllowedStandards(buildContext);
  });

  describe("AllowedERC725YDataKeys", () => {
    shouldBehaveLikeAllowedERC725YDataKeys(buildContext);
  });

  describe("Multi Channel nonces", () => {
    shouldBehaveLikeMultiChannelNonce(buildContext);
  });

  describe("Execute Relay Call", () => {
    shouldBehaveLikeExecuteRelayCall(buildContext);
  });

  describe("batch execute", () => {
    shouldBehaveLikeBatchExecute(buildContext);
  });

  describe("miscellaneous", () => {
    otherTestScenarios(buildContext);
  });

  describe("Security", () => {
    testSecurityScenarios(buildContext);
  });

  describe("Reentrancy", () => {
    testReentrancyScenarios(buildContext);
  });
};

export const shouldInitializeLikeLSP6 = (
  buildContext: () => Promise<LSP6TestContext>
) => {
  let context: LSP6TestContext;

  before(async () => {
    context = await buildContext();
  });

  describe("when the contract was initialized", () => {
    it("should support ERC165 interface", async () => {
      const result = await context.keyManager.supportsInterface(
        INTERFACE_IDS.ERC165
      );
      expect(result).to.be.true;
    });

    it("should support ERC1271 interface", async () => {
      const result = await context.keyManager.supportsInterface(
        INTERFACE_IDS.ERC1271
      );
      expect(result).to.be.true;
    });

    it("should support LSP6 interface", async () => {
      const result = await context.keyManager.supportsInterface(
        INTERFACE_IDS.LSP6KeyManager
      );
      expect(result).to.be.true;
    });

    it("should be linked to the right ERC725 account contract", async () => {
      let account = await context.keyManager.target();
      expect(account).to.equal(context.universalProfile.address);
    });
  });
};

export const testLSP6InternalFunctions = (
  buildContext: () => Promise<LSP6InternalsTestContext>
) => {
  testAllowedCallsInternals(buildContext);
  testAllowedERC725YDataKeysInternals(buildContext);
  testReadingPermissionsInternals(buildContext);
};

// SPDX-License-Identifier: Apache-2.0
pragma solidity ^0.8.4;

// interfaces
import {ILSP6KeyManager} from "../../LSP6KeyManager/ILSP6KeyManager.sol";
import {LSP14Ownable2Step} from "lsp14/contracts/LSP14Ownable2Step.sol";

import {
    ILSP1UniversalReceiverDelegate
} from "lsp1/contracts/ILSP1UniversalReceiverDelegate.sol";

// modules
import {
    ERC165Storage
} from "@openzeppelin/contracts/utils/introspection/ERC165Storage.sol";

// constants
import {
    _TYPEID_LSP7_TOKENSSENDER
} from "../../LSP7DigitalAsset/LSP7Constants.sol";

import {_INTERFACEID_LSP1_DELEGATE} from "lsp1/contracts/LSP1Constants.sol";

contract UniversalReceiverDelegateDataUpdater is
    ERC165Storage,
    ILSP1UniversalReceiverDelegate
{
    constructor() {
        _registerInterface(_INTERFACEID_LSP1_DELEGATE);
    }

    function universalReceiverDelegate(
        address /*sender*/,
        uint256 /*value*/,
        bytes32 typeId,
        bytes memory /* data */
    ) public virtual override returns (bytes memory) {
        if (typeId == _TYPEID_LSP7_TOKENSSENDER) {
            address keyManager = LSP14Ownable2Step(msg.sender).owner();
            bytes memory setDataPayload = abi.encodeWithSignature(
                "setData(bytes32,bytes)",
                keccak256(bytes("some random data key")),
                bytes("some random text for the data value")
            );
            return ILSP6KeyManager(keyManager).execute(setDataPayload);
        }

        return "";
    }
}

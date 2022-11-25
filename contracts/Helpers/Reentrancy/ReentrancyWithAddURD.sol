// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

// interfaces
import {ILSP6KeyManager} from "../../LSP6KeyManager/ILSP6KeyManager.sol";
import {LSP14Ownable2Step} from "../../LSP14Ownable2Step/LSP14Ownable2Step.sol";

// constants
import "../../LSP1UniversalReceiver/LSP1Constants.sol";

contract ReentrancyWithAddURD {
    function universalReceiver(
        bytes32 typeId, // solhint-disable no-unused-vars
        bytes calldata data // bytes32(TYPE_ID) + bytes20(address(URD))
    ) public virtual returns (bytes memory result) {
        address sender = address(bytes20(msg.data[msg.data.length - 52:]));

        // solhint-disable no-unused-vars
        address keyManager = LSP14Ownable2Step(sender).owner();

        bytes memory addURDPayload = abi.encodeWithSignature(
            "setData(bytes32,bytes)",
            bytes32(
                bytes.concat(
                    _LSP1_UNIVERSAL_RECEIVER_DELEGATE_PREFIX,
                    bytes2(0),
                    bytes20(data[:20])
                )
            ),
            data[32:]
        );

        ILSP6KeyManager(keyManager).execute(addURDPayload);
    }
}

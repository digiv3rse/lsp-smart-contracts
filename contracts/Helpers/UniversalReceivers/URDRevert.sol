// SPDX-License-Identifier: CC0-1.0
pragma solidity ^0.8.0;

import "../../LSP1-UniversalReceiver/ILSP1-UniversalReceiverDelegate.sol";
import "@openzeppelin/contracts/utils/introspection/ERC165Storage.sol";

contract URDRevert is ILSP1Delegate, ERC165Storage {
    bytes4 private constant _INTERFACE_ID_LSP1DELEGATE = 0xc2d7bcc1;

    constructor() {
        _registerInterface(_INTERFACE_ID_LSP1DELEGATE);
    }

    /* solhint-disable no-unused-vars */
    function universalReceiverDelegate(
        address sender,
        bytes32 typeId,
        bytes memory data
    ) external pure override returns (bytes memory) {
        bytes memory funcData = abi.encodePacked(sender, typeId, data);
        revert("This Contract reverts");
    }
    /* solhint-enable */
}

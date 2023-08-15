// SPDX-License-Identifier: Apache-2.0
pragma solidity ^0.8.4;

import {LSP17Extendable} from "../LSP17ContractExtension/LSP17Extendable.sol";

/**
 * @dev This contract is used only for testing purposes
 */
contract LSP17ExtendableTester is LSP17Extendable {
    mapping(bytes4 => address) internal _extensions;

    string internal _someStorageData;
    string internal _anotherStorageData;

    // This `receive()` function is just put there to disable the following solc compiler warning:
    //
    // "This contract has a payable fallback function, but no receive ether function.
    // Consider adding a receive ether function."
    receive() external payable {}

    // solhint-disable no-complex-fallback
    fallback() external payable {
        // CHECK we can update the contract's storage BEFORE calling an extension
        setStorageData("updated BEFORE calling `_fallbackLSP17Extendable`");

        _fallbackLSP17Extendable(msg.data);

        // CHECK we can update the contract's storage AFTER calling an extension
        setAnotherStorageData(
            "updated AFTER calling `_fallbackLSP17Extendable`"
        );
    }

    function getExtension(
        bytes4 functionSelector
    ) public view returns (address) {
        return _getExtension(functionSelector);
    }

    function setExtension(
        bytes4 functionSelector,
        address extensionContract
    ) public {
        _extensions[functionSelector] = extensionContract;
    }

    function getStorageData() public view returns (string memory) {
        return _someStorageData;
    }

    function setStorageData(string memory newData) public {
        _someStorageData = newData;
    }

    function getAnotherStorageData() public view returns (string memory) {
        return _anotherStorageData;
    }

    function setAnotherStorageData(string memory newData) public {
        _anotherStorageData = newData;
    }

    function _getExtension(
        bytes4 functionSelector
    ) internal view override returns (address) {
        return _extensions[functionSelector];
    }
}

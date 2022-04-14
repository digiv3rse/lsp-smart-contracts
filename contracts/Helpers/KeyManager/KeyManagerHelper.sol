// SPDX-License-Identifier: Apache-2.0
pragma solidity ^0.8.0;

import "../../LSP6KeyManager/LSP6KeyManager.sol";

/**
 * Helper contract to test internal functions of the KeyManager
 */
contract KeyManagerHelper is LSP6KeyManager {
    using LSP6Utils for *;

    /* solhint-disable no-empty-blocks */
    constructor(address _account) LSP6KeyManager(_account) {}

    function getPermissionsFor(address _address) public view returns (bytes32) {
        return ERC725Y(account).getPermissionsFor(_address);
    }

    function getAllowedAddressesFor(address _address)
        public
        view
        returns (bytes memory)
    {
        return ERC725Y(account).getAllowedAddressesFor(_address);
    }

    function getAllowedFunctionsFor(address _address)
        public
        view
        returns (bytes memory)
    {
        return ERC725Y(account).getAllowedFunctionsFor(_address);
    }

    function getAllowedERC725YKeysFor(address _address)
        public
        view
        returns (bytes memory)
    {
        return ERC725Y(account).getAllowedERC725YKeysFor(_address);
    }

    function verifyAllowedAddress(address _sender, address _recipient)
        public
        view
    {
        super._verifyAllowedAddress(_sender, _recipient);
    }

    function verifyAllowedFunction(address _sender, bytes4 _function)
        public
        view
    {
        super._verifyAllowedFunction(_sender, _function);
    }

    function verifyAllowedERC725YKeys(
        address _from,
        bytes32[] memory _inputKeys
    ) public view {
        super._verifyAllowedERC725YKeys(_from, _inputKeys);
    }

    function includesPermissions(
        bytes32 _addressPermission,
        bytes32 _permissions
    ) public pure returns (bool) {
        return _addressPermission.includesPermissions(_permissions);
    }

    function countZeroBytes(bytes32 _key)
        public
        pure
        returns (uint256 zeroBytesCount_)
    {
        return super._countZeroBytes(_key);
    }
}

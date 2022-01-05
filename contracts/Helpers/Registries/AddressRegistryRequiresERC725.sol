// SPDX-License-Identifier: Apache-2.0
pragma solidity ^0.8.0;

// modules
import "./AddressRegistry.sol";

contract AddressRegistryRequiresERC725 is AddressRegistry {
    using EnumerableSet for EnumerableSet.AddressSet;

    bytes4 internal constant _INTERFACE_ID_ERC725Y = 0x5a988c0f;

    function addAddress(address _address) public override returns (bool) {
        require(
            ERC165(_address).supportsInterface(_INTERFACE_ID_ERC725Y),
            "Only ERC725Y addresses can be added"
        );
        return _addressStore.add(_address);
    }

    function removeAddress(address _address) public override returns (bool) {
        require(
            ERC165(msg.sender).supportsInterface(_INTERFACE_ID_ERC725Y),
            "Only ERC725Y can call this function"
        );
        require(msg.sender == _address, "Only an address can remove itself.");
        return _addressStore.remove(_address);
    }
}

// SPDX-License-Identifier: Apache-2.0
pragma solidity ^0.8.0;

// interfaces
import "../../submodules/ERC725/implementations/contracts/ILSP1/ILSP1_UniversalReceiverDelegate.sol";

// modules
import "../Registries/AddressRegistry.sol";
import "@openzeppelin/contracts/utils/introspection/ERC165Storage.sol";

contract UniversalReceiverAddressStore is ERC165Storage, ILSP1Delegate, AddressRegistry {
    using EnumerableSet for EnumerableSet.AddressSet;

    bytes4 constant _INTERFACE_ID_LSP1DELEGATE = 0xc2d7bcc1;

    bytes32 constant internal _TOKENS_RECIPIENT_INTERFACE_HASH =
    0xb281fc8c12954d22544db45de3159a39272895b169a852b314f9cc762e44c53b; // keccak256("ERC777TokensRecipient")

    address public account;

    constructor(address _account) {
        account = _account;
        _registerInterface(_INTERFACE_ID_LSP1DELEGATE);
    }

    function addAddress(address _address)
        public
        override
        onlyAccount
        returns (bool)
    {
        return _addressStore.add(_address);
    }

    function removeAddress(address _address)
        public
        override
        onlyAccount
        returns (bool)
    {
        return _addressStore.remove(_address);
    }

    function universalReceiverDelegate(address sender, bytes32 typeId, bytes memory)
        external
        override
        onlyAccount
        returns (bytes memory)
    {
        // require(typeId == _TOKENS_RECIPIENT_INTERFACE_HASH, 'UniversalReceiverDelegate: Type not supported');

        // store tokens only if received, DO NOT revert on _TOKENS_SENDER_INTERFACE_HASH
        if(typeId == _TOKENS_RECIPIENT_INTERFACE_HASH)
            addAddress(sender);

        return abi.encodePacked(typeId);
    }

    /* Modifers */
    modifier onlyAccount() {
        require(msg.sender == account, "Only the connected account call this function");
        _;
    }
}
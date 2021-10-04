// SPDX-License-Identifier: Apache-2.0
pragma solidity ^0.8.0;

// interfaces
// import "./_LSPs/ILSP1_UniversalReceiver.sol";
// import "./_LSPs/ILSP1_UniversalReceiverDelegate.sol";
import "../submodules/ERC725/implementations/contracts/ERC725/ERC725YInit.sol";

// modules
import "../submodules/ERC725/implementations/contracts/ERC725/ERC725AccountInit.sol";
import "@openzeppelin/contracts/utils/introspection/ERC165Storage.sol";
import "solidity-bytes-utils/contracts/BytesLib.sol";

// libraries
import "../submodules/ERC725/implementations/contracts/Utils/ERC725Utils.sol";

/**
 * @title Proxy implementation of a LUKSO's Universal Profile based on LSP3
 * @author Fabian Vogelsteller <fabian@lukso.network>
 * @dev Implementation of the ERC725Account + LSP1 universalReceiver
 */
contract UniversalProfileInit is ERC165Storage, ERC725AccountInit {
    using ERC725Utils for ERC725YInit;

    // bytes4 constant _INTERFACE_ID_LSP1 = 0x6bb56a14;
    // bytes4 constant _INTERFACE_ID_LSP1DELEGATE = 0xc2d7bcc1;

    bytes32 constant private _UNIVERSAL_RECEIVER_DELEGATE_KEY =
        0x0cfc51aec37c55a4d0b1a65c6255c4bf2fbdf6277f3cc0730c45b828b6db8b47; // keccak256("LSP1UniversalReceiverDelegate")

    bytes32[] public dataKeys;

    function initialize(address _newOwner) virtual override public {
        ERC725AccountInit.initialize(_newOwner);
        _registerInterface(_INTERFACE_ID_LSP1);
    }

    /* non-standard public functions */

    function allDataKeys() public view returns (bytes32[] memory) {
        return dataKeys;
    }

    function setData(bytes32[] calldata _keys, bytes[] calldata _values)
        public
        override
        onlyOwner
    {
        for (uint256 ii = 0; ii < _keys.length; ii++) {
            if (store[_keys[ii]].length == 0) {
                dataKeys.push(_keys[ii]);
            }
            _setData(_keys[ii], _values[ii]);
        }
    }

}
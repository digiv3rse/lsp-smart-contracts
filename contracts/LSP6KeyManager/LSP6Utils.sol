// SPDX-License-Identifier: Apache-2.0
pragma solidity ^0.8.4;

// interfaces
import {IERC725Y} from "@erc725/smart-contracts/contracts/interfaces/IERC725Y.sol";
import {ILSP6KeyManager} from "./ILSP6KeyManager.sol";

// libraries
import {LSP2Utils} from "../LSP2ERC725YJSONSchema/LSP2Utils.sol";

// constants
import {SETDATA_ARRAY_SELECTOR} from "@erc725/smart-contracts/contracts/constants.sol";
import "../LSP6KeyManager/LSP6Constants.sol";

library LSP6Utils {
    using LSP2Utils for bytes12;

    /**
     * @dev read the permissions of a `caller` on an ERC725Y `target` contract.
     * @param target an `IERC725Y` contract where to read the permissions.
     * @param caller the controller address to read the permissions from.
     * @return a `bytes32` BitArray containing the permissions of a controller address.
     */
    function getPermissionsFor(IERC725Y target, address caller) internal view returns (bytes32) {
        bytes memory permissions = target.getData(
            LSP2Utils.generateMappingWithGroupingKey(
                _LSP6KEY_ADDRESSPERMISSIONS_PERMISSIONS_PREFIX,
                bytes20(caller)
            )
        );

        return bytes32(permissions);
    }

    function getAllowedCallsFor(IERC725Y target, address from)
        internal
        view
        returns (bytes memory)
    {
        return
            target.getData(
                LSP2Utils.generateMappingWithGroupingKey(
                    _LSP6KEY_ADDRESSPERMISSIONS_ALLOWEDCALLS_PREFIX,
                    bytes20(from)
                )
            );
    }

    /**
     * @dev read the Allowed ERC725Y data keys of a `caller` on an ERC725Y `target` contract.
     * @param target an `IERC725Y` contract where to read the permissions.
     * @param caller the controller address to read the permissions from.
     * @return an abi-encoded array of allowed ERC725 keys that the controller address is allowed to interact with.
     */
    function getAllowedERC725YDataKeysFor(IERC725Y target, address caller)
        internal
        view
        returns (bytes memory)
    {
        return
            target.getData(
                LSP2Utils.generateMappingWithGroupingKey(
                    _LSP6KEY_ADDRESSPERMISSIONS_AllowedERC725YDataKeys_PREFIX,
                    bytes20(caller)
                )
            );
    }

    /**
     * @dev compare the permissions `addressPermissions` of an address
     *      to check if they includes the permissions `permissionToCheck`
     * @param addressPermission the permissions of an address stored on an ERC725 account
     * @param permissionToCheck the permissions to check
     * @return true if `addressPermissions` includes `permissionToCheck`, false otherwise
     */
    function hasPermission(bytes32 addressPermission, bytes32 permissionToCheck)
        internal
        pure
        returns (bool)
    {
        return (addressPermission & permissionToCheck) == permissionToCheck;
    }

    /**
     * @dev same as LSP2Utils.isLSP2CompactBytesArray with the exception
     * that it does not allow empty length elements
     *
     * @param compactBytesArray the compact bytes array to check
     * @return true if:
     *  - the compact bytes array is valid according to LSP2
     *  - the compact bytes array does not include 0 length elements
     * false otherwise
     */
    function isLSP6CompactBytesArray(bytes memory compactBytesArray) internal pure returns (bool) {
        uint256 pointer;

        while (pointer < compactBytesArray.length) {
            uint256 elementLength = uint8(compactBytesArray[pointer]);
            if (elementLength == 0) return false;
            pointer += elementLength + 1;
        }
        if (pointer == compactBytesArray.length) return true;
        return false;
    }

    /**
     * @dev use the `setData(bytes32[],bytes[])` via the KeyManager of the target
     * @param keyManagerAddress the address of the KeyManager
     * @param keys the array of data keys
     * @param values the array of data values
     */
    function setDataViaKeyManager(
        address keyManagerAddress,
        bytes32[] memory keys,
        bytes[] memory values
    ) internal returns (bytes memory result) {
        bytes memory payload = abi.encodeWithSelector(SETDATA_ARRAY_SELECTOR, keys, values);
        result = ILSP6KeyManager(keyManagerAddress).execute(payload);
    }

    function generatePermissionsKeysForController(
        IERC725Y _account,
        address _address,
        bytes32 permissions
    ) internal view returns (bytes32[] memory keys, bytes[] memory values) {
        keys = new bytes32[](3);
        values = new bytes[](3);

        uint256 arrayLength = uint256(bytes32(_account.getData(_LSP6KEY_ADDRESSPERMISSIONS_ARRAY)));
        uint256 newArrayLength = arrayLength + 1;

        keys[0] = _LSP6KEY_ADDRESSPERMISSIONS_ARRAY;
        values[0] = abi.encodePacked(newArrayLength);

        keys[1] = LSP2Utils.generateArrayElementKeyAtIndex(
            _LSP6KEY_ADDRESSPERMISSIONS_ARRAY,
            uint128(arrayLength)
        );
        values[1] = abi.encodePacked(_address);

        keys[2] = LSP2Utils.generateMappingWithGroupingKey(
            _LSP6KEY_ADDRESSPERMISSIONS_PERMISSIONS_PREFIX,
            bytes20(_address)
        );
        values[2] = abi.encodePacked(permissions);
    }
}

// SPDX-License-Identifier: CC0-1.0
pragma solidity ^0.8.0;

// interfaces
import "./ILSP6KeyManager.sol";

// --- ERC165 interface ids
bytes4 constant _INTERFACEID_LSP6 = type(ILSP6KeyManager).interfaceId;

/* solhint-disable */
// PERMISSION KEYS
// prettier-ignore
bytes8 constant _SET_PERMISSIONS           = 0x4b80742d00000000; // AddressPermissions:<...>
bytes12 constant _ADDRESS_PERMISSIONS = 0x4b80742d0000000082ac0000; // AddressPermissions:Permissions:<address> --> bytes32
bytes12 constant _ADDRESS_ALLOWEDADDRESSES = 0x4b80742d00000000c6dd0000; // AddressPermissions:AllowedAddresses:<address> --> address[]
bytes12 constant _ADDRESS_ALLOWEDFUNCTIONS = 0x4b80742d000000008efe0000; // AddressPermissions:AllowedFunctions:<address> --> bytes4[]
bytes12 constant _ADDRESS_ALLOWEDSTANDARDS = 0x4b80742d000000003efa0000; // AddressPermissions:AllowedStandards:<address> --> bytes4[]
/* solhint-enable */

// PERMISSIONS VALUES
// prettier-ignore
bytes32 constant _PERMISSION_CHANGEOWNER       = 0x0000000000000000000000000000000000000000000000000000000000000001; // [240 x 0 bits...] 0000 0000 0000 0001
bytes32 constant _PERMISSION_CHANGEPERMISSIONS = 0x0000000000000000000000000000000000000000000000000000000000000002; // [      ...      ] .... .... .... 0010
bytes32 constant _PERMISSION_ADDPERMISSIONS = 0x0000000000000000000000000000000000000000000000000000000000000004; // [      ...      ] .... .... .... 0100
bytes32 constant _PERMISSION_SETDATA = 0x0000000000000000000000000000000000000000000000000000000000000008; // [      ...      ] .... .... .... 1000
bytes32 constant _PERMISSION_CALL = 0x0000000000000000000000000000000000000000000000000000000000000010; // [      ...      ] .... .... 0001 ....
bytes32 constant _PERMISSION_STATICCALL = 0x0000000000000000000000000000000000000000000000000000000000000020; // [      ...      ] .... .... 0010 ....
bytes32 constant _PERMISSION_DELEGATECALL = 0x0000000000000000000000000000000000000000000000000000000000000040; // [      ...      ] .... .... 0100 ....
bytes32 constant _PERMISSION_DEPLOY = 0x0000000000000000000000000000000000000000000000000000000000000080; // [      ...      ] .... .... 1000 ....
bytes32 constant _PERMISSION_TRANSFERVALUE = 0x0000000000000000000000000000000000000000000000000000000000000100; // [      ...      ] .... 0001 .... ....
bytes32 constant _PERMISSION_SIGN = 0x0000000000000000000000000000000000000000000000000000000000000200; // [      ...      ] .... 0010 .... ....

// SPDX-License-Identifier: CC0-1.0
pragma solidity ^0.8.4;

uint256 constant LSP6_VERSION = 6;

// --- ERC165 interface ids
bytes4 constant _INTERFACEID_LSP6 = 0x38bb3cdb;

// --- ERC725Y Data Keys

// PERMISSIONS KEYS

// keccak256('AddressPermissions[]')
bytes32 constant _LSP6KEY_ADDRESSPERMISSIONS_ARRAY = 0xdf30dba06db6a30e65354d9a64c609861f089545ca58c6b4dbe31a5f338cb0e3;

// AddressPermissions[index]
bytes16 constant _LSP6KEY_ADDRESSPERMISSIONS_ARRAY_PREFIX = 0xdf30dba06db6a30e65354d9a64c60986;

// AddressPermissions:...
bytes6 constant _LSP6KEY_ADDRESSPERMISSIONS_PREFIX = 0x4b80742de2bf;

// bytes6(keccak256('AddressPermissions')) + bytes4(keccak256('Permissions'))
bytes10 constant _LSP6KEY_ADDRESSPERMISSIONS_PERMISSIONS_PREFIX = 0x4b80742de2bf82acb363; // AddressPermissions:Permissions:<address> --> bytes32

// bytes6(keccak256('AddressPermissions')) + bytes4(keccak256('AllowedERC725YDataKeys'))
bytes10 constant _LSP6KEY_ADDRESSPERMISSIONS_AllowedERC725YDataKeys_PREFIX = 0x4b80742de2bf866c2911; // AddressPermissions:AllowedERC725YDataKeys:<address> --> bytes[CompactBytesArray]

// bytes6(keccak256('AddressPermissions')) + bytes4(keccak256('AllowedCalls'))
bytes10 constant _LSP6KEY_ADDRESSPERMISSIONS_ALLOWEDCALLS_PREFIX = 0x4b80742de2bf393a64c7; // AddressPermissions:AllowedCalls:<address>

// DEFAULT PERMISSIONS VALUES
// NB: the SUPER PERMISSIONS allow to not check for:
//  - AddressPermissions:AllowedERC725YDataKeys:...
//  - AddressPermissions:AllowedCalls
bytes32 constant _PERMISSION_CHANGEOWNER                     = 0x0000000000000000000000000000000000000000000000000000000000000001;
bytes32 constant _PERMISSION_ADDCONTROLLER                   = 0x0000000000000000000000000000000000000000000000000000000000000002;
bytes32 constant _PERMISSION_EDITPERMISSIONS                 = 0x0000000000000000000000000000000000000000000000000000000000000004;
bytes32 constant _PERMISSION_ADDEXTENSIONS                   = 0x0000000000000000000000000000000000000000000000000000000000000008;
bytes32 constant _PERMISSION_CHANGEEXTENSIONS                = 0x0000000000000000000000000000000000000000000000000000000000000010;
bytes32 constant _PERMISSION_ADDUNIVERSALRECEIVERDELEGATE    = 0x0000000000000000000000000000000000000000000000000000000000000020;
bytes32 constant _PERMISSION_CHANGEUNIVERSALRECEIVERDELEGATE = 0x0000000000000000000000000000000000000000000000000000000000000040;
bytes32 constant _PERMISSION_REENTRANCY                      = 0x0000000000000000000000000000000000000000000000000000000000000080;
bytes32 constant _PERMISSION_SUPER_TRANSFERVALUE             = 0x0000000000000000000000000000000000000000000000000000000000000100;
bytes32 constant _PERMISSION_TRANSFERVALUE                   = 0x0000000000000000000000000000000000000000000000000000000000000200;
bytes32 constant _PERMISSION_SUPER_CALL                      = 0x0000000000000000000000000000000000000000000000000000000000000400;
bytes32 constant _PERMISSION_CALL                            = 0x0000000000000000000000000000000000000000000000000000000000000800;
bytes32 constant _PERMISSION_SUPER_STATICCALL                = 0x0000000000000000000000000000000000000000000000000000000000001000;
bytes32 constant _PERMISSION_STATICCALL                      = 0x0000000000000000000000000000000000000000000000000000000000002000;
bytes32 constant _PERMISSION_SUPER_DELEGATECALL              = 0x0000000000000000000000000000000000000000000000000000000000004000;
bytes32 constant _PERMISSION_DELEGATECALL                    = 0x0000000000000000000000000000000000000000000000000000000000008000;
bytes32 constant _PERMISSION_DEPLOY                          = 0x0000000000000000000000000000000000000000000000000000000000010000;
bytes32 constant _PERMISSION_SUPER_SETDATA                   = 0x0000000000000000000000000000000000000000000000000000000000020000;
bytes32 constant _PERMISSION_SETDATA                         = 0x0000000000000000000000000000000000000000000000000000000000040000;
bytes32 constant _PERMISSION_ENCRYPT                         = 0x0000000000000000000000000000000000000000000000000000000000080000;
bytes32 constant _PERMISSION_DECRYPT                         = 0x0000000000000000000000000000000000000000000000000000000000100000;
bytes32 constant _PERMISSION_SIGN                            = 0x0000000000000000000000000000000000000000000000000000000000200000;

// All Permissions currently exclude REENTRANCY, DELEGATECALL and SUPER_DELEGATECALL for security
bytes32 constant ALL_REGULAR_PERMISSIONS = 0x00000000000000000000000000000000000000000000000000000000003f3f7f;

// LSP6 overloaded function selectors
bytes4 constant _LSP6_EXECUTE_SELECTOR = 0x09c5eabe;
bytes4 constant _LSP6_EXECUTE_BATCH_SELECTOR = 0xbf3e1f7b;
bytes4 constant _LSP6_EXECUTE_RELAYCALL_SELECTOR = 0x902d5fa0;
bytes4 constant _LSP6_EXECUTE_RELAYCALL_BATCH_SELECTOR = 0xbd68663a;

// AllowedCalls types
bytes4 constant _ALLOWEDCALLS_VALUE   = 0x00000001; // 0000 0001 TRANSFER VALUE
bytes4 constant _ALLOWEDCALLS_WRITE   = 0x00000002; // 0000 0010 CALL
bytes4 constant _ALLOWEDCALLS_READ    = 0x00000004; // 0000 0100 STATIC CALL
bytes4 constant _ALLOWEDCALLS_EXECUTE = 0x00000008; // 0000 1000 DELEGATE CALL

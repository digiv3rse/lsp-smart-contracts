// SPDX-License-Identifier: Apache-2.0
pragma solidity ^0.8.0;

//
import "@erc725/smart-contracts/contracts/interfaces/ILSP1_UniversalReceiver.sol";
import "@erc725/smart-contracts/contracts/interfaces/ILSP1_UniversalReceiverDelegate.sol";

// --- ERC165 interface ids
bytes4 constant _INTERFACEID_LSP1 = type(ILSP1).interfaceId;
bytes4 constant _INTERFACEID_LSP1_DELEGATE = type(ILSP1Delegate).interfaceId;

// --- ERC725Y Keys
bytes32 constant _LSP1_UNIVERSAL_RECEIVER_DELEGATE_KEY = 0x0cfc51aec37c55a4d0b1a65c6255c4bf2fbdf6277f3cc0730c45b828b6db8b47; // keccak256("LSP1UniversalReceiverDelegate")

bytes32 constant _ARRAYKEY_LSP5 = 0x6460ee3c0aac563ccbf76d6e1d07bada78e3a9514e6382b736ed3f478ab7b90b; // keccak256("LSP5ReceivedAssets[]")

bytes32 constant _MAPHASH_LSP5 = 0x812c4334633eb816c80deebfa5fb7d2509eb438ca1b6418106442cb5ccc62f6c; // keccak256("LSP5ReceivedAssetsMap")

bytes32 constant _ARRAYKEY_LSP10 = 0xd8c6ec2b958bbebb976719e1eb233f126e0f355c63843f434220f9753b5ca9e5; // keccak256("LSP10ReceivedVaults[]")

bytes32 constant _MAPHASH_LSP10 = 0x5e5a4636eeb20bf1149b49749202c4dacfa540d14197de0b556a7e44c63536a1; // keccak256("LSP10ReceivedVaultsMap")

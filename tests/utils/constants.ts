export const enum INTERFACE_IDS {
  ERC165 = "0x01ffc9a7",
  ERC1271 = "0x1626ba7e",
  ERC725X = "0x44c028fe",
  ERC725Y = "0x5a988c0f",
  ERC725Account = "0x63cb749b",
  LSP1 = "0x6bb56a14",
  LSP1Delegate = "0xc2d7bcc1",
  LSP6 = "0x6f4df48b",
  LSP7 = "0xe33f65c3",
  LSP8 = "0x49399145",
}

export const enum ERC1271 {
  MAGIC_VALUE = "0x1626ba7e",
  FAIL_VALUE = "0xffffffff",
}

export const EventSignatures = {
  /**
   * event UniversalReceiver(
   *    address indexed from,
   *    bytes32 indexed typeId,
   *    bytes32 indexed returnedValue,
   *    bytes receivedData
   * )
   *
   * signature = keccak256('UniversalReceiver(address,bytes32,bytes32,bytes)')
   */
  UniversalReceiver: "0x8187df79ab47ad16102e7bc8760349a115b3ba9869b8cedd78996f930ac9cac3",
  /**
   * event ReceivedERC777(
   *    address indexed token,
   *    address indexed _operator,
   *    address indexed _from,
   *    address _to,
   *    uint256 _amount
   * )
   *
   * signature = keccak256('ReceivedERC777(address,address,address,address,uint256)')
   */
  ReceivedERC777: "0xdc38539587ea4d67f9f649ad9269646bab26927bad175bdcdfdab5dd297d5e1c",
};

export const SupportedStandards = {
  ERC725Account: {
    key: "0xeafec4d89fa9619884b6b89135626455000000000000000000000000afdeb5d6",
    value: "0xafdeb5d6", // bytes4(keccak256('ERC725Account'))
  },
};

// KeyManager

// Get key: keccak256('AddressPermissions[]')
export const ADDRESSPERMISSIONS_KEY =
  "0xdf30dba06db6a30e65354d9a64c609861f089545ca58c6b4dbe31a5f338cb0e3";

// Universal Receiver

// Get key: keccak256('LSP1UniversalReceiverDelegate')
export const UNIVERSALRECEIVER_KEY =
  "0x0cfc51aec37c55a4d0b1a65c6255c4bf2fbdf6277f3cc0730c45b828b6db8b47";

export const RANDOM_BYTES32 = "0xb281fc8c12954d22544db45de3159a39272895b169a852b314f9cc762e44c53b";
export const ERC777TokensRecipient =
  "0xb281fc8c12954d22544db45de3159a39272895b169a852b314f9cc762e44c53b";

// LSP5-Received Assets

export const RAW_INTERFACE_ID = {
  LSP7: "e33f65c3",
  LSP8: "49399145",
};

export const LSP5_ASSET_MAP_HASH = "0x812c4334633eb81600000000";

export const LSP5_ARRAY_KEY = "0x6460ee3c0aac563ccbf76d6e1d07bada78e3a9514e6382b736ed3f478ab7b90b"; // keccak256("LSPASSETS[]")

export const ITEMS_ARRAY_KEY = {
  ITEM1: "0x6460ee3c0aac563ccbf76d6e1d07bada00000000000000000000000000000000",
  ITEM2: "0x6460ee3c0aac563ccbf76d6e1d07bada00000000000000000000000000000001",
  ITEM3: "0x6460ee3c0aac563ccbf76d6e1d07bada00000000000000000000000000000002",
  ITEM4: "0x6460ee3c0aac563ccbf76d6e1d07bada00000000000000000000000000000003",
  ITEM5: "0x6460ee3c0aac563ccbf76d6e1d07bada00000000000000000000000000000004",
  ITEM6: "0x6460ee3c0aac563ccbf76d6e1d07bada00000000000000000000000000000005",
  ITEM7: "0x6460ee3c0aac563ccbf76d6e1d07bada00000000000000000000000000000006",
  ITEM8: "0x6460ee3c0aac563ccbf76d6e1d07bada00000000000000000000000000000007",
};

// bytes8 index
export const INDEX = {
  ZERO: "0000000000000000",
  ONE: "0000000000000001",
  TWO: "0000000000000002",
  THREE: "0000000000000003",
  FOUR: "0000000000000004",
  FIVE: "0000000000000005",
  SIX: "0000000000000006",
  SEVEN: "0000000000000007",
};

// bytes32 arraylength

export const ARRAY_LENGTH = {
  ZERO: "0x0000000000000000000000000000000000000000000000000000000000000000",
  ONE: "0x0000000000000000000000000000000000000000000000000000000000000001",
  TWO: "0x0000000000000000000000000000000000000000000000000000000000000002",
  THREE: "0x0000000000000000000000000000000000000000000000000000000000000003",
  FOUR: "0x0000000000000000000000000000000000000000000000000000000000000004",
  FIVE: "0x0000000000000000000000000000000000000000000000000000000000000005",
  SIX: "0x0000000000000000000000000000000000000000000000000000000000000006",
  SEVEN: "0x0000000000000000000000000000000000000000000000000000000000000007",
  EIGHT: "0x0000000000000000000000000000000000000000000000000000000000000008",
};

// Random Token Id
export const TOKEN_ID = {
  ONE: "0xad7c5bef027816a800da1736444fb58a807ef4c9603b7848673f7e3a68eb14a5",
  TWO: "0xd4d1a59767271eefdc7830a772b9732a11d503531d972ab8c981a6b1c0e666e5",
  THREE: "0x3672b35640006da199633c5c75015da83589c4fb84ef8276b18076529e3d3196",
  FOUR: "0x80a6c6138772c2d7c710a3d49f4eea603028994b7e390f670dd68566005417f0",
  FIVE: "0x5c6f8b1aed769a328dad1ae15220e93730cdd52cb12817ae5fd8c15023d660d3",
  SIX: "0x65ce3c3668a850c4f9fce91762a3fb886380399f02a9eb1495055234e7c0287a",
  SEVEN: "0x00121ee2bd9802ce88a413ac1851c8afe6fe7474fb5d1b7da4475151b013da53",
  EIGHT: "0x367f9d97f8dd1bece61f8b74c5db7616958147682674fd32de73490bd6347f60",
};

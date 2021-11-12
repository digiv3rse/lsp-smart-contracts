// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

// modules
import "../../LSP8IdentifiableDigitalAsset/extensions/LSP8CompatibilityForERC721.sol";
import "../../LSP8IdentifiableDigitalAsset/LSP8IdentifiableDigitalAsset.sol";

contract LSP8CompatibilityForERC721Tester is LSP8IdentifiableDigitalAsset, LSP8CompatibilityForERC721 {
    /* solhint-disable no-empty-blocks */
    constructor(
      string memory name,
      string memory symbol,
      address newOwner
    ) LSP8IdentifiableDigitalAsset(name, symbol, newOwner) {}

    function mint(address to, uint256 tokenId, bytes calldata data) public {
        // using force=true so we can send to EOA in test
        _mint(to, bytes32(tokenId), true, data);
    }
}

// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

// modules
import "../../submodules/ERC725/implementations/contracts/ERC725/ERC725Y.sol";

// constants
import "./LSP4-Constants.sol";

/**
 * @dev Implementation of a LSP8 compliant contract.
 */
abstract contract LSP4 is ERC725Y {

    constructor(
        string memory name_,
        string memory symbol_,
        address newOwner_
    ) ERC725Y(newOwner_) {
        _setData(_LSP4_METADATA_TOKEN_NAME_KEY, bytes(name_));
        _setData(_LSP4_METADATA_TOKEN_SYMBOL_KEY, bytes(symbol_));
    }
}

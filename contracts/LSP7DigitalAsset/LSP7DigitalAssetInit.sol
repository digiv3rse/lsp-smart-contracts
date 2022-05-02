// SPDX-License-Identifier: CC0-1.0
pragma solidity ^0.8.0;

// modules
import {LSP7DigitalAssetInitAbstract} from "./LSP7DigitalAssetInitAbstract.sol";

/**
 * @title LSP7DigitalAsset contract
 * @author Matthew Stevens
 * @dev Proxy Implementation of a LSP7 compliant contract.
 */
contract LSP7DigitalAssetInit is LSP7DigitalAssetInitAbstract {
    /**
     * @notice Sets the token-Metadata
     * @param name_ The name of the token
     * @param symbol_ The symbol of the token
     * @param newOwner_ The owner of the the token-Metadata
     * @param isNFT_ Specify if the LSP7 token is a fungible or non-fungible token
     */
    function initialize(
        string memory name_,
        string memory symbol_,
        address newOwner_,
        bool isNFT_
    ) public virtual initializer {
        LSP7DigitalAssetInitAbstract._initialize(name_, symbol_, newOwner_, isNFT_);
    }
}

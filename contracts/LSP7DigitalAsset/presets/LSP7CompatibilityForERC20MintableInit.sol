// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

// modules
import {LSP7CompatibilityForERC20MintableInitAbstract} from "./LSP7CompatibilityForERC20MintableInitAbstract.sol";

contract LSP7CompatibilityForERC20MintableInit is LSP7CompatibilityForERC20MintableInitAbstract {
    /**
     * @notice Sets the name, the symbol and the owner of the token
     * @param name_ The name of the token
     * @param symbol_ The symbol of the token
     * @param newOwner_ The owner of the token
     */
    function initialize(
        string memory name_,
        string memory symbol_,
        address newOwner_
    ) public virtual initializer {
        LSP7CompatibilityForERC20MintableInitAbstract._initialize(name_, symbol_, newOwner_);
    }
}

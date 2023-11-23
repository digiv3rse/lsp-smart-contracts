// SPDX-License-Identifier: Apache-2.0

pragma solidity ^0.8.4;

// interfaces
import {ILSP7Mintable} from "./ILSP7Mintable.sol";

// modules
import {LSP7DigitalAsset} from "../LSP7DigitalAsset.sol";

/**
 * @title LSP7DigitalAsset deployable preset contract with a public {mint} function callable only by the contract {owner}.
 * @author Jean Cavallera, Yamen Merhi
 */
contract LSP7Mintable is LSP7DigitalAsset, ILSP7Mintable {
    /**
     * @notice Deploying a `LSP7Mintable` token contract with: token name = `name_`, token symbol = `symbol_`, and
     * address `newOwner_` as the token contract owner.
     *
     * @param name_ The name of the token.
     * @param symbol_ The symbol of the token.
     * @param newOwner_ The owner of the token contract.
     * @param lsp4TokenType_ The type of token this digital asset contract represents (`1` = Token, `2` = NFT, `3` = Collection).
     */
    constructor(
        string memory name_,
        string memory symbol_,
        address newOwner_,
        bool isNonDivisible_,
        uint256 lsp4TokenType_
    )
        LSP7DigitalAsset(
            name_,
            symbol_,
            newOwner_,
            isNonDivisible_,
            lsp4TokenType_
        )
    {}

    /**
     * @dev Public {_mint} function only callable by the {owner}.
     */
    function mint(
        address to,
        uint256 amount,
        bool force,
        bytes memory data
    ) public virtual override onlyOwner {
        _mint(to, amount, force, data);
    }
}

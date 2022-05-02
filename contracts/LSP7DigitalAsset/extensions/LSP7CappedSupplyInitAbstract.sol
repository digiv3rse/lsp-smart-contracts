// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

// modules
import {Initializable} from "@openzeppelin/contracts/proxy/utils/Initializable.sol";
import {LSP7DigitalAssetInit} from "../LSP7DigitalAssetInit.sol";
import {LSP7DigitalAssetCore} from "../LSP7DigitalAssetCore.sol";
import {LSP7CappedSupplyCore} from "./LSP7CappedSupplyCore.sol";

/**
 * @dev LSP7 extension, adds token supply cap.
 */
abstract contract LSP7CappedSupplyInitAbstract is
    Initializable,
    LSP7CappedSupplyCore,
    LSP7DigitalAssetInit
{
    function _initialize(uint256 tokenSupplyCap_) internal virtual onlyInitializing {
        if (tokenSupplyCap_ == 0) {
            revert LSP7CappedSupplyRequired();
        }

        _tokenSupplyCap = tokenSupplyCap_;
    }

    // --- Overrides

    /**
     * @dev Mints `amount` tokens and transfers it to `to`.
     *
     * Requirements:
     *
     * - `tokenSupplyCap() - totalSupply()` must be greater than zero.
     * - `to` cannot be the zero address.
     *
     * Emits a {Transfer} event.
     */
    function _mint(
        address to,
        uint256 amount,
        bool force,
        bytes memory data
    ) internal virtual override(LSP7DigitalAssetCore, LSP7CappedSupplyCore) {
        super._mint(to, amount, force, data);
    }
}

// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

// modules
import "./LSP8CappedSupplyCore.sol";
import "../LSP8Init.sol";

/**
 * @dev LSP8 extension, adds token supply cap.
 */
abstract contract LSP8CappedSupplyInit is Initializable, LSP8Init, LSP8CappedSupplyCore {
    //
    // --- Initialize
    //

    function initialize(uint256 tokenSupplyCap_)
        public
        virtual
        initializer
    {
      require(tokenSupplyCap_ > 0, "LSP8Capped: tokenSupplyCap is zero");
      _tokenSupplyCap = tokenSupplyCap_;
    }

    //
    // --- Overrides
    //

    /**
     * @dev Mints `tokenId` and transfers it to `to`.
     *
     * Requirements:
     *
     * - `tokenSupplyCap() - totalSupply()` must be greater than zero.
     * - `tokenId` must not exist.
     * - `to` cannot be the zero address.
     *
     * Emits a {Transfer} event.
     */
    function _mint(
        address to,
        bytes32 tokenId,
        bool force,
        bytes memory data
    )
        internal
        virtual
        override(LSP8Core, LSP8CappedSupplyCore)
    {
        super._mint(to, tokenId, force, data);
    }
}

// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

// modules
import "./LSP8CompatibilityForERC721Core.sol";
import "../LSP8IdentifiableDigitalAssetInitAbstract.sol";

// constants
import "./LSP8CompatibilityConstants.sol";

/**
 * @dev LSP8 extension, for compatibility for clients / tools that expect ERC721.
 */
contract LSP8CompatibilityForERC721InitAbstract is
    LSP8CompatibilityForERC721Core,
    LSP8IdentifiableDigitalAssetInitAbstract
{
    function _initialize(
        string memory name_,
        string memory symbol_,
        address newOwner_
    ) internal virtual override onlyInitializing {
        LSP8IdentifiableDigitalAssetInitAbstract._initialize(
            name_,
            symbol_,
            newOwner_
        );

        _registerInterface(_INTERFACEID_ERC721);
        _registerInterface(_INTERFACEID_ERC721METADATA);
    }

    function authorizeOperator(address operator, bytes32 tokenId)
        public
        virtual
        override(
            LSP8IdentifiableDigitalAssetCore,
            LSP8CompatibilityForERC721Core
        )
    {
        super.authorizeOperator(operator, tokenId);
    }

    function _transfer(
        address from,
        address to,
        bytes32 tokenId,
        bool force,
        bytes memory data
    )
        internal
        virtual
        override(
            LSP8IdentifiableDigitalAssetCore,
            LSP8CompatibilityForERC721Core
        )
    {
        super._transfer(from, to, tokenId, force, data);
    }

    function _mint(
        address to,
        bytes32 tokenId,
        bool force,
        bytes memory data
    )
        internal
        virtual
        override(
            LSP8IdentifiableDigitalAssetCore,
            LSP8CompatibilityForERC721Core
        )
    {
        super._mint(to, tokenId, force, data);
    }

    function _burn(bytes32 tokenId, bytes memory data)
        internal
        virtual
        override(
            LSP8IdentifiableDigitalAssetCore,
            LSP8CompatibilityForERC721Core
        )
    {
        super._burn(tokenId, data);
    }
}

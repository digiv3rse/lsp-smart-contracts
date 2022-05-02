// SPDX-License-Identifier: CC0-1.0
pragma solidity ^0.8.0;

// interfaces
import {IERC165} from "@openzeppelin/contracts/utils/introspection/IERC165.sol";

// modules
import {Initializable} from "@openzeppelin/contracts/proxy/utils/Initializable.sol";
import {ERC165Storage} from "@openzeppelin/contracts/utils/introspection/ERC165Storage.sol";
import {LSP4DigitalAssetMetadataInitAbstract} from "../LSP4DigitalAssetMetadata/LSP4DigitalAssetMetadataInitAbstract.sol";
import {LSP7DigitalAssetCore} from "./LSP7DigitalAssetCore.sol";

// constants
import {_INTERFACEID_LSP7} from "./LSP7Constants.sol";

/**
 * @title LSP7DigitalAsset contract
 * @author Matthew Stevens
 * @dev Proxy Implementation of a LSP7 compliant contract.
 */
abstract contract LSP7DigitalAssetInitAbstract is
    LSP7DigitalAssetCore,
    Initializable,
    LSP4DigitalAssetMetadataInitAbstract
{
    function _initialize(
        string memory name_,
        string memory symbol_,
        address newOwner_,
        bool isNFT_
    ) internal virtual onlyInitializing {
        _isNFT = isNFT_;
        LSP4DigitalAssetMetadataInitAbstract._initialize(name_, symbol_, newOwner_);
    }

    /**
     * @dev See {IERC165-supportsInterface}.
     */
    function supportsInterface(bytes4 interfaceId)
        public
        view
        virtual
        override(IERC165, ERC165Storage)
        returns (bool)
    {
        return interfaceId == _INTERFACEID_LSP7 || super.supportsInterface(interfaceId);
    }
}

// SPDX-License-Identifier: Apache-2.0
pragma solidity ^0.8.4;

// modules
import {ERC725YCore} from "@erc725/smart-contracts/contracts/ERC725YCore.sol";

// libraries
import {BytesLib} from "solidity-bytes-utils/contracts/BytesLib.sol";

// constants
import {
    _LSP4_TOKEN_NAME_KEY,
    _LSP4_TOKEN_SYMBOL_KEY
} from "./LSP4Constants.sol";

// errors
import {
    LSP4TokenNameNotEditable,
    LSP4TokenSymbolNotEditable
} from "./LSP4Errors.sol";

/**
 * @title Implementation of a LSP4DigitalAssetMetadata contract that stores the **Token-Metadata** (`LSP4TokenName` and `LSP4TokenSymbol`) in its ERC725Y data store.
 * @author Matthew Stevens
 * @dev Standard Implementation of the LSP4 standard.
 */
abstract contract LSP4DigitalAssetMetadataCore is ERC725YCore {
    /**
     * @dev The ERC725Y data keys `LSP4TokenName` and `LSP4TokenSymbol` cannot be changed
     * via this function once the digital asset contract has been deployed.
     *
     * @dev Save gas by emitting the {DataChanged} event with only the first 256 bytes of dataValue
     */
    function _setData(
        bytes32 dataKey,
        bytes memory dataValue
    ) internal virtual override {
        if (dataKey == _LSP4_TOKEN_NAME_KEY) {
            revert LSP4TokenNameNotEditable();
        } else if (dataKey == _LSP4_TOKEN_SYMBOL_KEY) {
            revert LSP4TokenSymbolNotEditable();
        } else {
            _store[dataKey] = dataValue;
            emit DataChanged(
                dataKey,
                dataValue.length <= 256
                    ? dataValue
                    : BytesLib.slice(dataValue, 0, 256)
            );
        }
    }
}

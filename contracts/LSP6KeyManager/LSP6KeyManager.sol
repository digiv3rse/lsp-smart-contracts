// SPDX-License-Identifier: Apache-2.0
pragma solidity ^0.8.6;

// modules
import {LSP6KeyManagerCore} from "./LSP6KeyManagerCore.sol";

/**
 * @title Implementation of a contract acting as a controller of an ERC725 Account, using permissions stored in the ERC725Y storage
 * @author Fabian Vogelsteller <frozeman>, Jean Cavallera (CJ42), Yamen Merhi (YamenMerhi)
 * @dev all the permissions can be set on the ERC725 Account using `setData(...)` with the keys constants below
 */
contract LSP6KeyManager is LSP6KeyManagerCore {
    /**
     * @notice Initiate the account with the address of the ERC725Account contract and sets LSP6KeyManager InterfaceId
     * @param _account The address of the ER725Account to control
     */
    constructor(address _account) {
        target = _account;
    }
}

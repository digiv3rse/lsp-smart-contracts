// SPDX-License-Identifier: Apache-2.0
pragma solidity ^0.8.6;

// modules
import "./LSP6KeyManagerCore.sol";
import "@openzeppelin/contracts/utils/introspection/ERC165.sol";
import "@openzeppelin/contracts/proxy/utils/Initializable.sol";

/**
 * @title Proxy implementation of a contract acting as a controller of an ERC725 Account, using permissions stored in the ERC725Y storage
 * @author Fabian Vogelsteller, Jean Cavallera
 * @dev all the permissions can be set on the ERC725 Account using `setData(...)` with the keys constants below
 */
abstract contract LSP6KeyManagerInitAbstract is
    Initializable,
    LSP6KeyManagerCore
{
    function _initialize(address _account) internal virtual onlyInitializing {
        account = ERC725(_account);
    }
}

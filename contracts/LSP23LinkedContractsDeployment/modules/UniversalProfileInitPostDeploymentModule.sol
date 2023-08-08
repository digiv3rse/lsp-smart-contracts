// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import {UniversalProfileInit} from "../../UniversalProfileInit.sol";

contract UniversalProfileInitPostDeploymentModule is UniversalProfileInit {
    constructor() {
        _disableInitializers();
    }

    function setDataAndTransferOwnership(
        bytes32[] memory dataKeys,
        bytes[] memory dataValues,
        address newOwner
    ) public payable {
        // check that the msg.sender is the owner
        require(
            msg.sender == owner(),
            "UniversalProfileInitPostDeploymentModule: setDataAndTransferOwnership only allowed through delegate call"
        );

        // update the dataKeys and dataValues in the UniversalProfile contract
        for (uint256 i = 0; i < dataKeys.length; ) {
            _setData(dataKeys[i], dataValues[i]);

            unchecked {
                ++i;
            }
        }

        // transfer the ownership of the UniversalProfile contract to the newOwner
        _setOwner(newOwner);
    }

    function executePostDeployment(
        address universalProfile,
        address keyManager,
        bytes calldata setDataBatchBytes
    ) public {
        // retrieve the dataKeys and dataValues to setData from the initializationCalldata bytes
        (bytes32[] memory dataKeys, bytes[] memory dataValues) = abi.decode(
            setDataBatchBytes,
            (bytes32[], bytes[])
        );

        // call the execute function with delegate_call on the universalProfile contract to setData and transferOwnership
        UniversalProfileInit(payable(universalProfile)).execute(
            4,
            address(this),
            0,
            abi.encodeWithSignature(
                "setDataAndTransferOwnership(bytes32[],bytes[],address)",
                dataKeys,
                dataValues,
                keyManager
            )
        );
    }
}

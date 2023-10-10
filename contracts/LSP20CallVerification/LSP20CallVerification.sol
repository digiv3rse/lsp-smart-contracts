// SPDX-License-Identifier: Apache-2.0
pragma solidity ^0.8.4;

// interfaces
import {ILSP20CallVerifier as ILSP20} from "./ILSP20CallVerifier.sol";

// errors
import {
    LSP20CallVerificationFailed,
    LSP20CallingVerifierFailed,
    LSP20EOACannotVerifyCall
} from "./LSP20Errors.sol";

/**
 * @title Implementation of a contract calling the verification functions according to LSP20 - Call Verification standard.
 *
 * @dev Module to be inherited used to verify the execution of functions according to a verifier address.
 * Verification can happen before or after execution based on a returnedStatus.
 */
abstract contract LSP20CallVerification {
    /**
     * @dev Calls {lsp20VerifyCall} function on the logicVerifier.
     * Reverts in case the value returned does not match the success value (lsp20VerifyCall selector)
     * Returns whether a verification after the execution should happen based on the last byte of the returnedStatus
     */
    function _verifyCall(
        address logicVerifier
    ) internal virtual returns (bool verifyAfter) {
        if (logicVerifier.code.length == 0) {
            revert LSP20EOACannotVerifyCall(logicVerifier);
        }

        try
            ILSP20(logicVerifier).lsp20VerifyCall(
                msg.sender,
                address(this),
                msg.sender,
                msg.value,
                msg.data
            )
        returns (bytes4 magicValue) {
            if (bytes3(magicValue) != bytes3(ILSP20.lsp20VerifyCall.selector)) {
                revert LSP20CallVerificationFailed(
                    false,
                    abi.encode(magicValue)
                );
            }

            return magicValue[3] == 0x01;
        } catch (bytes memory errorData) {
            _revertWithLSP20DefaultError(false, errorData);
        }
    }

    /**
     * @dev Calls {lsp20VerifyCallResult} function on the logicVerifier.
     * Reverts in case the value returned does not match the success value (lsp20VerifyCallResult selector)
     */
    function _verifyCallResult(
        address logicVerifier,
        bytes memory callResult
    ) internal virtual {
        try
            ILSP20(logicVerifier).lsp20VerifyCallResult(
                keccak256(
                    abi.encodePacked(
                        msg.sender,
                        address(this),
                        msg.sender,
                        msg.value,
                        msg.data
                    )
                ),
                callResult
            )
        returns (bytes4 magicValue) {
            if (magicValue != ILSP20.lsp20VerifyCallResult.selector) {
                revert LSP20CallVerificationFailed({
                    postCall: true,
                    returnedData: abi.encode(magicValue)
                });
            }

            return;
        } catch (bytes memory errorData) {
            _revertWithLSP20DefaultError(true, errorData);
        }
    }

    function _revertWithLSP20DefaultError(
        bool postCall,
        bytes memory returnedData
    ) internal pure virtual {
        // Look for revert reason and bubble it up if present
        if (returnedData.length != 0) {
            // The easiest way to bubble the revert reason is using memory via assembly
            // solhint-disable no-inline-assembly
            /// @solidity memory-safe-assembly
            assembly {
                let returndata_size := mload(returnedData)
                revert(add(32, returnedData), returndata_size)
            }
        } else {
            revert LSP20CallingVerifierFailed(postCall);
        }
    }
}

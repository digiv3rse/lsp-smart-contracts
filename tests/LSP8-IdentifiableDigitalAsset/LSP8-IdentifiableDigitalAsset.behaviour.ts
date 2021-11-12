import { ethers } from "hardhat";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import {
  LSP8,
  LSP8Tester,
  TokenReceiverWithLSP1,
  TokenReceiverWithLSP1__factory,
  TokenReceiverWithoutLSP1,
  TokenReceiverWithoutLSP1__factory,
} from "../../types";
import { tokenIdAsBytes32 } from "../utils/tokens";
import { INTERFACE_IDS } from "../utils/constants";

import type { BytesLike } from "ethers";
import type { TransactionResponse } from "@ethersproject/abstract-provider";

export type LSP8TestAccounts = {
  owner: SignerWithAddress;
  tokenReceiver: SignerWithAddress;
  operator: SignerWithAddress;
  anotherOperator: SignerWithAddress;
  anyone: SignerWithAddress;
};

export const getNamedAccounts = async (): Promise<LSP8TestAccounts> => {
  const [owner, tokenReceiver, operator, anotherOperator, anyone] = await ethers.getSigners();
  return { owner, tokenReceiver, operator, anotherOperator, anyone };
};

export type LSP8DeployParams = {
  name: string;
  symbol: string;
  newOwner: string;
};

export type LSP8TestContext = {
  accounts: LSP8TestAccounts;
  lsp8: LSP8Tester;
  deployParams: LSP8DeployParams;
};

const mintedTokenId = tokenIdAsBytes32(10);
const neverMintedTokenId = tokenIdAsBytes32(1010110);

export const shouldBehaveLikeLSP8 = (buildContext: () => Promise<LSP8TestContext>) => {
  let context: LSP8TestContext;

  beforeEach(async () => {
    context = await buildContext();
  });

  describe("when minting tokens", () => {
    describe("when tokenId has already been minted", () => {
      it("should revert", async () => {
        const txParams = {
          to: context.accounts.tokenReceiver.address,
          tokenId: mintedTokenId,
          force: true,
          data: ethers.utils.toUtf8Bytes("should revert"),
        };

        await context.lsp8.mint(txParams.to, txParams.tokenId, txParams.force, txParams.data);

        await expect(
          context.lsp8.mint(txParams.to, txParams.tokenId, txParams.force, txParams.data)
        ).toBeRevertedWith("LSP8: tokenId already minted");
      });
    });

    describe("when tokenId has not been minted", () => {
      const toBeMintedTokenId = tokenIdAsBytes32("2020202020");

      describe("when `to` is the zero address", () => {
        it("should revert", async () => {
          const txParams = {
            to: ethers.constants.AddressZero,
            tokenId: toBeMintedTokenId,
            force: true,
            data: ethers.utils.toUtf8Bytes("should revert"),
          };

          await expect(
            context.lsp8.mint(txParams.to, txParams.tokenId, txParams.force, txParams.data)
          ).toBeRevertedWith("LSP8: can not mint to zero address");
        });
      });

      describe("when `to` is not the zero address", () => {
        it("should mint the token", async () => {
          const txParams = {
            to: context.accounts.tokenReceiver.address,
            tokenId: toBeMintedTokenId,
            force: true,
            data: ethers.utils.toUtf8Bytes("we need more tokens"),
          };

          await context.lsp8.mint(txParams.to, txParams.tokenId, txParams.force, txParams.data);

          const tokenOwnerOf = await context.lsp8.tokenOwnerOf(txParams.tokenId);
          expect(tokenOwnerOf).toEqual(txParams.to);
        });
      });
    });
  });

  describe("when tokens have been minted", () => {
    beforeEach(async () => {
      await context.lsp8.mint(
        context.accounts.owner.address,
        mintedTokenId,
        true,
        ethers.utils.toUtf8Bytes("mint a token for the owner")
      );
    });

    describe("totalSupply", () => {
      it("should return total token supply", async () => {
        expect(await context.lsp8.totalSupply()).toEqual(ethers.BigNumber.from("1"));
      });
    });

    describe("balanceOf", () => {
      describe("when the given address owns tokens", () => {
        it("should return the owned token count", async () => {
          expect(await context.lsp8.balanceOf(context.accounts.owner.address)).toEqual(
            ethers.BigNumber.from("1")
          );
        });
      });

      describe("when the given address does not own tokens", () => {
        it("should return zero", async () => {
          expect(await context.lsp8.balanceOf(context.accounts.anyone.address)).toEqual(
            ethers.BigNumber.from("0")
          );
        });
      });
    });

    describe("tokenOwnerOf", () => {
      describe("when tokenId has not been minted", () => {
        it("should revert", async () => {
          await expect(context.lsp8.tokenOwnerOf(neverMintedTokenId)).toBeRevertedWith(
            "LSP8: can not query non existent token"
          );
        });
      });

      describe("when tokenId has been minted", () => {
        it("should return owner address", async () => {
          expect(await context.lsp8.tokenOwnerOf(mintedTokenId)).toEqual(
            context.accounts.owner.address
          );
        });
      });
    });

    describe("tokenIdsOf", () => {
      describe("when the given address owns some tokens", () => {
        it("should return the list of owned tokenIds", async () => {
          expect(await context.lsp8.tokenIdsOf(context.accounts.owner.address)).toEqual([
            mintedTokenId,
          ]);
        });
      });

      describe("when the given address does not owns some tokens", () => {
        it("should empty list", async () => {
          expect(await context.lsp8.tokenIdsOf(context.accounts.anyone.address)).toEqual([]);
        });
      });

      describe("when the given address is the zero address", () => {
        it("should revert", async () => {
          await expect(context.lsp8.tokenIdsOf(ethers.constants.AddressZero)).toBeRevertedWith(
            "LSP8: can not query token for zero address"
          );
        });
      });
    });

    describe("authorizeOperator", () => {
      describe("when tokenId does not exist", () => {
        it("should revert", async () => {
          await expect(
            context.lsp8.authorizeOperator(context.accounts.operator.address, neverMintedTokenId)
          ).toBeRevertedWith("LSP8: can not query non existent token");
        });
      });

      describe("when caller is not owner of tokenId", () => {
        it("should revert", async () => {
          await expect(
            context.lsp8
              .connect(context.accounts.anyone)
              .authorizeOperator(context.accounts.operator.address, mintedTokenId)
          ).toBeRevertedWith("LSP8: caller can not authorize operator for token id");
        });
      });

      describe("when caller is owner of tokenId", () => {
        describe("when given operator is the tokenOwner", () => {
          it("should revert", async () => {
            await expect(
              context.lsp8.authorizeOperator(context.accounts.owner.address, mintedTokenId)
            ).toBeRevertedWith("LSP8: can not authorize token owner as operator");
          });
        });

        describe("when given operator is different than tokenOwner", () => {
          describe("when operator is not the zero address", () => {
            it("should succeed", async () => {
              const operator = context.accounts.operator.address;
              const tokenOwner = context.accounts.owner.address;
              const tokenId = mintedTokenId;

              const tx = await context.lsp8.authorizeOperator(operator, tokenId);

              await expect(tx).toHaveEmittedWith(context.lsp8, "AuthorizedOperator", [
                operator,
                tokenOwner,
                tokenId,
              ]);

              expect(await context.lsp8.isOperatorFor(operator, tokenId)).toEqual(true);
            });

            describe("when operator is already authorized", () => {
              beforeEach(async () => {
                await context.lsp8.authorizeOperator(
                  context.accounts.operator.address,
                  mintedTokenId
                );
              });

              it("should succeed", async () => {
                const operator = context.accounts.operator.address;
                const tokenOwner = context.accounts.owner.address;
                const tokenId = mintedTokenId;

                await context.lsp8.authorizeOperator(operator, tokenId);

                const tx = await context.lsp8.authorizeOperator(operator, tokenId);

                await expect(tx).toHaveEmittedWith(context.lsp8, "AuthorizedOperator", [
                  operator,
                  tokenOwner,
                  tokenId,
                ]);

                expect(await context.lsp8.isOperatorFor(operator, tokenId)).toEqual(true);
              });
            });

            describe("when operator is the zero address", () => {
              it("should revert", async () => {
                const operator = ethers.constants.AddressZero;
                const tokenId = mintedTokenId;

                await expect(context.lsp8.authorizeOperator(operator, tokenId)).toBeRevertedWith(
                  "LSP8: can not authorize zero address"
                );
              });
            });
          });
        });
      });
    });

    describe("revokeOperator", () => {
      describe("when tokenId does not exist", () => {
        it("should revert", async () => {
          await expect(
            context.lsp8.revokeOperator(context.accounts.operator.address, neverMintedTokenId)
          ).toBeRevertedWith("LSP8: can not query non existent token");
        });
      });

      describe("when caller is not owner of tokenId", () => {
        it("should revert", async () => {
          await expect(
            context.lsp8
              .connect(context.accounts.anyone)
              .revokeOperator(context.accounts.operator.address, mintedTokenId)
          ).toBeRevertedWith("LSP8: caller can not revoke operator for token id");
        });
      });

      describe("when caller is owner of tokenId", () => {
        describe("when given operator is the tokenOwner", () => {
          it("should revert", async () => {
            await expect(
              context.lsp8.revokeOperator(context.accounts.owner.address, mintedTokenId)
            ).toBeRevertedWith("LSP8: can not revoke token owner as operator");
          });
        });

        describe("when given operator is different than tokenOwner", () => {
          describe("when operator is not the zero address", () => {
            it("should succeed", async () => {
              const operator = context.accounts.operator.address;
              const tokenOwner = context.accounts.owner.address;
              const tokenId = mintedTokenId;

              // pre-conditions
              await context.lsp8.authorizeOperator(operator, tokenId);
              expect(await context.lsp8.isOperatorFor(operator, tokenId)).toEqual(true);

              // effects
              const tx = await context.lsp8.revokeOperator(operator, tokenId);
              await expect(tx).toHaveEmittedWith(context.lsp8, "RevokedOperator", [
                operator,
                tokenOwner,
                tokenId,
              ]);

              // post-conditions
              expect(await context.lsp8.isOperatorFor(operator, tokenId)).toEqual(false);
            });
          });

          describe("when operator is the zero address", () => {
            it("should revert", async () => {
              const operator = ethers.constants.AddressZero;
              const tokenId = mintedTokenId;

              await expect(context.lsp8.revokeOperator(operator, tokenId)).toBeRevertedWith(
                "LSP8: can not revoke zero address as operator"
              );
            });
          });
        });
      });
    });

    describe("isOperatorFor", () => {
      describe("when tokenId has not been minted", () => {
        it("should revert", async () => {
          await expect(
            context.lsp8.isOperatorFor(context.accounts.operator.address, neverMintedTokenId)
          ).toBeRevertedWith("LSP8: can not query operator for non existent token");
        });
      });

      describe("when tokenId has been minted", () => {
        describe("when operator has not been authorized", () => {
          it("should return false", async () => {
            expect(
              await context.lsp8.isOperatorFor(context.accounts.operator.address, mintedTokenId)
            ).toEqual(false);
          });
        });

        describe("when one account have been authorized for the tokenId", () => {
          it("should return true", async () => {
            await context.lsp8.authorizeOperator(context.accounts.operator.address, mintedTokenId);

            expect(
              await context.lsp8.isOperatorFor(context.accounts.operator.address, mintedTokenId)
            ).toEqual(true);
          });
        });

        describe("when many accounts have been authorized for the tokenId", () => {
          it("should return true for all operators", async () => {
            await context.lsp8.authorizeOperator(context.accounts.operator.address, mintedTokenId);
            await context.lsp8.authorizeOperator(
              context.accounts.anotherOperator.address,
              mintedTokenId
            );

            expect(
              await context.lsp8.isOperatorFor(context.accounts.operator.address, mintedTokenId)
            ).toEqual(true);
            expect(
              await context.lsp8.isOperatorFor(
                context.accounts.anotherOperator.address,
                mintedTokenId
              )
            ).toEqual(true);
          });
        });
      });
    });

    describe("getOperatorsOf", () => {
      describe("when tokenId has not been minted", () => {
        it("should revert", async () => {
          await expect(context.lsp8.getOperatorsOf(neverMintedTokenId)).toBeRevertedWith(
            "LSP8: can not query operator for non existent token"
          );
        });
      });

      describe("when tokenId has been minted", () => {
        describe("when operator has not been authorized", () => {
          it("should return empty list", async () => {
            expect(await context.lsp8.getOperatorsOf(mintedTokenId)).toEqual([]);
          });
        });

        describe("when one account have been authorized for the tokenId", () => {
          it("should return list", async () => {
            await context.lsp8.authorizeOperator(context.accounts.operator.address, mintedTokenId);

            expect(await context.lsp8.getOperatorsOf(mintedTokenId)).toEqual([
              context.accounts.operator.address,
            ]);
          });
        });

        describe("when many accounts have been authorized for the tokenId", () => {
          it("should return list", async () => {
            await context.lsp8.authorizeOperator(context.accounts.operator.address, mintedTokenId);
            await context.lsp8.authorizeOperator(
              context.accounts.anotherOperator.address,
              mintedTokenId
            );

            expect(await context.lsp8.getOperatorsOf(mintedTokenId)).toEqual([
              context.accounts.operator.address,
              context.accounts.anotherOperator.address,
            ]);
          });
        });
      });
    });

    describe("transfers", () => {
      type HelperContracts = {
        tokenReceiverWithLSP1: TokenReceiverWithLSP1;
        tokenReceiverWithoutLSP1: TokenReceiverWithoutLSP1;
      };
      let helperContracts: HelperContracts;

      beforeEach(async () => {
        helperContracts = {
          tokenReceiverWithLSP1: await new TokenReceiverWithLSP1__factory(
            context.accounts.owner
          ).deploy(),
          tokenReceiverWithoutLSP1: await new TokenReceiverWithoutLSP1__factory(
            context.accounts.owner
          ).deploy(),
        };
      });

      beforeEach(async () => {
        // setup so we can observe operators being cleared during transfer tests
        await context.lsp8.authorizeOperator(context.accounts.operator.address, mintedTokenId);
        await context.lsp8.authorizeOperator(
          context.accounts.anotherOperator.address,
          mintedTokenId
        );
      });

      describe("transfer", () => {
        type TransferTxParams = {
          from: string;
          to: string;
          tokenId: BytesLike;
          force: boolean;
          data: string;
        };

        const transferSuccessScenario = async (
          { from, to, tokenId, force, data }: TransferTxParams,
          operator: SignerWithAddress
        ) => {
          // pre-conditions
          const preTokenOwnerOf = await context.lsp8.tokenOwnerOf(tokenId);
          expect(preTokenOwnerOf).toEqual(from);

          const preOperatorsOf = await context.lsp8.getOperatorsOf(tokenId);
          expect(preOperatorsOf).toEqual([
            context.accounts.operator.address,
            context.accounts.anotherOperator.address,
          ]);

          const preFromTokenIdsOf = await context.lsp8.tokenIdsOf(from);
          expect(preFromTokenIdsOf.includes(tokenId.toString())).toEqual(true);

          const preToTokenIdsOf = await context.lsp8.tokenIdsOf(to);
          expect(preToTokenIdsOf.includes(tokenId.toString())).toEqual(false);

          const preFromBalanceOf = await context.lsp8.balanceOf(from);
          const preToBalanceOf = await context.lsp8.balanceOf(to);

          // effect
          const tx = await context.lsp8.connect(operator).transfer(from, to, tokenId, force, data);
          await expect(tx).toHaveEmittedWith(context.lsp8, "Transfer", [
            operator.address,
            from,
            to,
            tokenId,
            force,
            data,
          ]);
          await expect(tx).toHaveEmittedWith(context.lsp8, "RevokedOperator", [
            context.accounts.operator.address,
            from,
            tokenId,
          ]);
          await expect(tx).toHaveEmittedWith(context.lsp8, "RevokedOperator", [
            context.accounts.anotherOperator.address,
            from,
            tokenId,
          ]);

          // post-conditions
          const postTokenOwnerOf = await context.lsp8.tokenOwnerOf(tokenId);
          expect(postTokenOwnerOf).toEqual(to);

          const postOperatorsOf = await context.lsp8.getOperatorsOf(tokenId);
          expect(postOperatorsOf).toEqual([]);

          const postFromTokenIdsOf = await context.lsp8.tokenIdsOf(from);
          expect(postFromTokenIdsOf.includes(tokenId.toString())).toEqual(false);

          const postToTokenIdsOf = await context.lsp8.tokenIdsOf(to);
          expect(postToTokenIdsOf.includes(tokenId.toString())).toEqual(true);

          const postFromBalanceOf = await context.lsp8.balanceOf(from);
          expect(postFromBalanceOf).toEqual(preFromBalanceOf.sub(1));

          const postToBalanceOf = await context.lsp8.balanceOf(to);
          expect(postToBalanceOf).toEqual(preToBalanceOf.add(1));

          return tx;
        };

        const transferFailScenario = async (
          { from, to, tokenId, force, data }: TransferTxParams,
          operator: SignerWithAddress,
          expectedError: string
        ) => {
          await expect(
            context.lsp8.connect(operator).transfer(from, to, tokenId, force, data)
          ).toBeRevertedWith(expectedError);
        };

        const sendingTransferTransactions = (getOperator: () => SignerWithAddress) => {
          let operator: SignerWithAddress;
          beforeEach(() => {
            // passed as a thunk since other before hooks setup accounts map
            operator = getOperator();
          });

          describe("when using force=true", () => {
            const force = true;
            const data = ethers.utils.hexlify(
              ethers.utils.toUtf8Bytes("doing a transfer with force")
            );

            describe("when `to` is an EOA", () => {
              describe("when `to` is the zero address", () => {
                it("should revert", async () => {
                  const txParams = {
                    from: context.accounts.owner.address,
                    to: ethers.constants.AddressZero,
                    tokenId: mintedTokenId,
                    force,
                    data,
                  };
                  const expectedError = "LSP8: can not transfer to zero address";

                  await transferFailScenario(txParams, operator, expectedError);
                });
              });

              it("should allow transfering the tokenId", async () => {
                const txParams = {
                  from: context.accounts.owner.address,
                  to: context.accounts.tokenReceiver.address,
                  tokenId: mintedTokenId,
                  force,
                  data,
                };

                await transferSuccessScenario(txParams, operator);
              });
            });

            describe("when `to` is a contract", () => {
              describe("when receiving contract supports LSP1", () => {
                it("should allow transfering the tokenId", async () => {
                  const txParams = {
                    operator: context.accounts.owner.address,
                    from: context.accounts.owner.address,
                    to: helperContracts.tokenReceiverWithLSP1.address,
                    tokenId: mintedTokenId,
                    force,
                    data,
                  };

                  const tx = await transferSuccessScenario(txParams, operator);

                  const typeId =
                    "0xc7a120a42b6057a0cbed111fbbfbd52fcd96748c04394f77fc2c3adbe0391e01";
                  const packedData = ethers.utils.solidityPack(
                    ["address", "address", "bytes32", "bytes"],
                    [txParams.from, txParams.to, txParams.tokenId, txParams.data]
                  );

                  await expect(tx).toHaveEmittedWith(
                    helperContracts.tokenReceiverWithLSP1,
                    "UniversalReceiverCalled",
                    [typeId, packedData]
                  );
                });
              });

              describe("when receiving contract does not support LSP1", () => {
                it("should allow transfering the tokenId", async () => {
                  const txParams = {
                    operator: context.accounts.owner.address,
                    from: context.accounts.owner.address,
                    to: helperContracts.tokenReceiverWithoutLSP1.address,
                    tokenId: mintedTokenId,
                    force,
                    data,
                  };

                  await transferSuccessScenario(txParams, operator);
                });
              });
            });
          });

          describe("when force=false", () => {
            const force = false;
            const data = ethers.utils.hexlify(
              ethers.utils.toUtf8Bytes("doing a transfer without force")
            );

            describe("when `to` is an EOA", () => {
              it("should not allow transfering the tokenId", async () => {
                const txParams = {
                  from: context.accounts.owner.address,
                  to: context.accounts.tokenReceiver.address,
                  tokenId: mintedTokenId,
                  force,
                  data,
                };
                const expectedError = "LSP8: token receiver is EOA";

                await transferFailScenario(txParams, operator, expectedError);
              });
            });

            describe("when `to` is a contract", () => {
              describe("when receiving contract supports LSP1", () => {
                it("should allow transfering the tokenId", async () => {
                  const txParams = {
                    operator: context.accounts.owner.address,
                    from: context.accounts.owner.address,
                    to: helperContracts.tokenReceiverWithLSP1.address,
                    tokenId: mintedTokenId,
                    force,
                    data,
                  };

                  const tx = await transferSuccessScenario(txParams, operator);

                  const typeId =
                    "0xc7a120a42b6057a0cbed111fbbfbd52fcd96748c04394f77fc2c3adbe0391e01";
                  const packedData = ethers.utils.solidityPack(
                    ["address", "address", "bytes32", "bytes"],
                    [txParams.from, txParams.to, txParams.tokenId, txParams.data]
                  );

                  await expect(tx).toHaveEmittedWith(
                    helperContracts.tokenReceiverWithLSP1,
                    "UniversalReceiverCalled",
                    [typeId, packedData]
                  );
                });
              });

              describe("when receiving contract does not support LSP1", () => {
                it("should not allow transfering the tokenId", async () => {
                  const txParams = {
                    operator: context.accounts.owner.address,
                    from: context.accounts.owner.address,
                    to: helperContracts.tokenReceiverWithoutLSP1.address,
                    tokenId: mintedTokenId,
                    force,
                    data,
                  };
                  const expectedError = "LSP8: token receiver contract missing LSP1 interface";

                  await transferFailScenario(txParams, operator, expectedError);
                });
              });
            });
          });
        };

        describe("when tokenOwner sends tx", () => {
          sendingTransferTransactions(() => context.accounts.owner);
        });

        describe("when operator sends tx", () => {
          sendingTransferTransactions(() => context.accounts.operator);

          describe("when the caller is not an operator", () => {
            it("should revert", async () => {
              const operator = context.accounts.anyone;
              const txParams = {
                from: context.accounts.owner.address,
                to: context.accounts.tokenReceiver.address,
                tokenId: mintedTokenId,
                force: true,
                data: ethers.utils.hexlify(ethers.utils.toUtf8Bytes("should revert")),
              };
              const expectedError =
                "LSP8: can not transfer, caller is not the owner or operator of token";

              await transferFailScenario(txParams, operator, expectedError);
            });
          });
        });

        describe("when the from address is incorrect", () => {
          it("should revert", async () => {
            const operator = context.accounts.owner;
            const txParams = {
              from: context.accounts.anyone.address,
              to: context.accounts.tokenReceiver.address,
              tokenId: mintedTokenId,
              force: true,
              data: ethers.utils.hexlify(ethers.utils.toUtf8Bytes("should revert")),
            };
            const expectedError = "LSP8: transfer of tokenId from incorrect owner";

            await transferFailScenario(txParams, operator, expectedError);
          });
        });

        describe("when the given tokenId has not been minted", () => {
          it("should revert", async () => {
            const operator = context.accounts.owner;
            const txParams = {
              from: context.accounts.owner.address,
              to: context.accounts.tokenReceiver.address,
              tokenId: neverMintedTokenId,
              force: true,
              data: ethers.utils.hexlify(ethers.utils.toUtf8Bytes("should revert")),
            };
            const expectedError = "LSP8: can not query non existent token";

            await transferFailScenario(txParams, operator, expectedError);
          });
        });
      });

      describe("transferBatch", () => {
        const anotherMintedTokenId = tokenIdAsBytes32("5555");

        beforeEach(async () => {
          // setup so we can observe operators being cleared during transferBatch tests
          await context.lsp8.authorizeOperator(context.accounts.operator.address, mintedTokenId);
          await context.lsp8.authorizeOperator(
            context.accounts.anotherOperator.address,
            mintedTokenId
          );

          // setup so we can transfer multiple tokenIds during transferBatch test
          await context.lsp8.mint(
            context.accounts.owner.address,
            anotherMintedTokenId,
            true,
            ethers.utils.toUtf8Bytes("mint another token for the owner")
          );

          // setup so we can observe operators being cleared during transferBatch tests
          await context.lsp8.authorizeOperator(
            context.accounts.operator.address,
            anotherMintedTokenId
          );
          await context.lsp8.authorizeOperator(
            context.accounts.anotherOperator.address,
            anotherMintedTokenId
          );
        });

        type TransferBatchTxParams = {
          from: string[];
          to: string[];
          tokenId: BytesLike[];
          force: boolean;
          data: string[];
        };

        const transferBatchSuccessScenario = async (
          { from, to, tokenId, force, data }: TransferBatchTxParams,
          operator: SignerWithAddress
        ) => {
          // pre-conditions
          await Promise.all(
            tokenId.map((_, index) => async () => {
              const preTokenOwnerOf = await context.lsp8.tokenOwnerOf(tokenId[index]);
              expect(preTokenOwnerOf).toEqual(from[index]);

              const preOperatorsOf = await context.lsp8.getOperatorsOf(tokenId[index]);
              expect(preOperatorsOf).toEqual([
                context.accounts.operator.address,
                context.accounts.anotherOperator.address,
              ]);
            })
          );

          // effect
          const tx = await context.lsp8
            .connect(operator)
            .transferBatch(from, to, tokenId, force, data);

          await Promise.all(
            tokenId.map(async (_, index) => {
              await expect(tx).toHaveEmittedWith(context.lsp8, "Transfer", [
                operator.address,
                from[index],
                to[index],
                tokenId[index],
                force,
                data[index],
              ]);
              await expect(tx).toHaveEmittedWith(context.lsp8, "RevokedOperator", [
                context.accounts.operator.address,
                from[index],
                tokenId[index],
              ]);
              await expect(tx).toHaveEmittedWith(context.lsp8, "RevokedOperator", [
                context.accounts.anotherOperator.address,
                from[index],
                tokenId[index],
              ]);
            })
          );

          // post-conditions
          await Promise.all(
            tokenId.map((_, index) => async () => {
              const preTokenOwnerOf = await context.lsp8.tokenOwnerOf(tokenId[index]);
              expect(preTokenOwnerOf).toEqual(to[index]);

              const postOperatorsOf = await context.lsp8.getOperatorsOf(tokenId[index]);
              expect(postOperatorsOf).toEqual([]);
            })
          );

          return tx;
        };

        const transferBatchFailScenario = async (
          { from, to, tokenId, force, data }: TransferBatchTxParams,
          operator: SignerWithAddress,
          expectedError: string
        ) => {
          // pre-conditions
          await Promise.all(
            tokenId.map((_, index) => async () => {
              const preTokenOwnerOf = await context.lsp8.tokenOwnerOf(tokenId[index]);
              expect(preTokenOwnerOf).toEqual(from[index]);
            })
          );

          // effect
          await expect(
            context.lsp8.connect(operator).transferBatch(from, to, tokenId, force, data)
          ).toBeRevertedWith(expectedError);
        };

        const sendingTransferBatchTransactions = (getOperator: () => SignerWithAddress) => {
          let operator: SignerWithAddress;
          beforeEach(() => {
            // passed as a thunk since other before hooks setup accounts map
            operator = getOperator();
          });

          describe("when using force=true", () => {
            const force = true;
            const data = ethers.utils.hexlify(
              ethers.utils.toUtf8Bytes("doing a transfer with force")
            );

            describe("when `to` is an EOA", () => {
              describe("when `to` is the zero address", () => {
                it("should revert", async () => {
                  const txParams = {
                    from: [context.accounts.owner.address, context.accounts.owner.address],
                    to: [context.accounts.tokenReceiver.address, ethers.constants.AddressZero],
                    tokenId: [mintedTokenId, anotherMintedTokenId],
                    force,
                    data: [data, data],
                  };
                  const expectedError = "LSP8: can not transfer to zero address";

                  await transferBatchFailScenario(txParams, operator, expectedError);
                });
              });

              it("should allow transfering the tokenId", async () => {
                const txParams = {
                  from: [context.accounts.owner.address, context.accounts.owner.address],
                  to: [
                    context.accounts.tokenReceiver.address,
                    context.accounts.tokenReceiver.address,
                  ],
                  tokenId: [mintedTokenId, anotherMintedTokenId],
                  force,
                  data: [data, data],
                };

                await transferBatchSuccessScenario(txParams, operator);
              });
            });

            describe("when `to` is a contract", () => {
              describe("when receiving contract supports LSP1", () => {
                it("should allow transfering the tokenId", async () => {
                  const txParams = {
                    from: [context.accounts.owner.address, context.accounts.owner.address],
                    to: [
                      helperContracts.tokenReceiverWithLSP1.address,
                      helperContracts.tokenReceiverWithLSP1.address,
                    ],
                    tokenId: [mintedTokenId, anotherMintedTokenId],
                    force,
                    data: [data, data],
                  };

                  const tx = await transferBatchSuccessScenario(txParams, operator);

                  await Promise.all(
                    txParams.tokenId.map((_, index) => async () => {
                      const typeId =
                        "0x29ddb589b1fb5fc7cf394961c1adf5f8c6454761adf795e67fe149f658abe895";
                      const packedData = ethers.utils.solidityPack(
                        ["address", "address", "bytes32", "bytes"],
                        [
                          txParams.from[index],
                          txParams.to[index],
                          txParams.tokenId[index],
                          txParams.data[index],
                        ]
                      );

                      await expect(tx).toHaveEmittedWith(
                        helperContracts.tokenReceiverWithLSP1,
                        "UniversalReceiverCalled",
                        [typeId, packedData]
                      );
                    })
                  );
                });
              });

              describe("when receiving contract does not support LSP1", () => {
                it("should allow transfering the tokenId", async () => {
                  const txParams = {
                    from: [context.accounts.owner.address, context.accounts.owner.address],
                    to: [
                      helperContracts.tokenReceiverWithoutLSP1.address,
                      helperContracts.tokenReceiverWithoutLSP1.address,
                    ],
                    tokenId: [mintedTokenId, anotherMintedTokenId],
                    force,
                    data: [data, data],
                  };

                  await transferBatchSuccessScenario(txParams, operator);
                });
              });
            });
          });

          describe("when force=false", () => {
            const force = false;
            const data = ethers.utils.hexlify(
              ethers.utils.toUtf8Bytes("doing a transfer without force")
            );

            describe("when `to` is an EOA", () => {
              it("should not allow transfering the tokenId", async () => {
                const txParams = {
                  from: [context.accounts.owner.address, context.accounts.owner.address],
                  to: [
                    context.accounts.tokenReceiver.address,
                    context.accounts.tokenReceiver.address,
                  ],
                  tokenId: [mintedTokenId, anotherMintedTokenId],
                  force,
                  data: [data, data],
                };
                const expectedError = "LSP8: token receiver is EOA";

                await transferBatchFailScenario(txParams, operator, expectedError);
              });
            });

            describe("when `to` is a contract", () => {
              describe("when receiving contract supports LSP1", () => {
                it("should allow transfering the tokenId", async () => {
                  const txParams = {
                    from: [context.accounts.owner.address, context.accounts.owner.address],
                    to: [
                      helperContracts.tokenReceiverWithLSP1.address,
                      helperContracts.tokenReceiverWithLSP1.address,
                    ],
                    tokenId: [mintedTokenId, anotherMintedTokenId],
                    force,
                    data: [data, data],
                  };

                  await transferBatchSuccessScenario(txParams, operator);
                });
              });

              describe("when receiving contract does not support LSP1", () => {
                it("should not allow transfering the tokenId", async () => {
                  const txParams = {
                    from: [context.accounts.owner.address, context.accounts.owner.address],
                    to: [
                      helperContracts.tokenReceiverWithoutLSP1.address,
                      helperContracts.tokenReceiverWithoutLSP1.address,
                    ],
                    tokenId: [mintedTokenId, anotherMintedTokenId],
                    force,
                    data: [data, data],
                  };
                  const expectedError = "LSP8: token receiver contract missing LSP1 interface";

                  await transferBatchFailScenario(txParams, operator, expectedError);
                });
              });
            });
          });

          describe("when the from address is incorrect", () => {
            it("should revert", async () => {
              const txParams = {
                to: [context.accounts.anyone.address],
                from: [context.accounts.tokenReceiver.address],
                tokenId: [mintedTokenId],
                force: true,
                data: [ethers.utils.hexlify(ethers.utils.toUtf8Bytes("should revert"))],
              };
              const expectedError = "LSP8: transfer of tokenId from incorrect owner";

              await transferBatchFailScenario(txParams, operator, expectedError);
            });
          });

          describe("when the given tokenId has not been minted", () => {
            it("should revert", async () => {
              const txParams = {
                to: [context.accounts.anyone.address],
                from: [context.accounts.tokenReceiver.address],
                tokenId: [neverMintedTokenId],
                force: true,
                data: [ethers.utils.hexlify(ethers.utils.toUtf8Bytes("should revert"))],
              };
              const expectedError = "LSP8: can not query non existent token";

              await transferBatchFailScenario(txParams, operator, expectedError);
            });
          });

          describe("when function parameters list length does not match", () => {
            it("should revert", async () => {
              const validTxParams = {
                from: [context.accounts.owner.address, context.accounts.owner.address],
                to: [
                  context.accounts.tokenReceiver.address,
                  context.accounts.tokenReceiver.address,
                ],
                tokenId: [mintedTokenId, anotherMintedTokenId],
                force: true,
                data: [
                  ethers.utils.toUtf8Bytes("should revert"),
                  ethers.utils.toUtf8Bytes("should revert"),
                ],
              };

              await Promise.all(
                ["from", "to", "tokenId", "data"].map(async (arrayParam) => {
                  await transferBatchFailScenario(
                    { ...validTxParams, [`${arrayParam}`]: [validTxParams[arrayParam][0]] },
                    operator,
                    "LSP8: transferBatch list length mismatch"
                  );
                })
              );
            });
          });
        };

        describe("when tokenOwner sends tx", () => {
          sendingTransferBatchTransactions(() => context.accounts.owner);
        });

        describe("when operator sends tx", () => {
          sendingTransferBatchTransactions(() => context.accounts.operator);

          describe("when the caller is not an operator", () => {
            it("should revert", async () => {
              const operator = context.accounts.anyone;
              const txParams = {
                to: [context.accounts.owner.address],
                from: [context.accounts.tokenReceiver.address],
                tokenId: [mintedTokenId],
                force: true,
                data: [ethers.utils.hexlify(ethers.utils.toUtf8Bytes("should revert"))],
              };
              const expectedError =
                "LSP8: can not transfer, caller is not the owner or operator of token";

              await transferBatchFailScenario(txParams, operator, expectedError);
            });
          });
        });
      });
    });
  });
};

export type LSP8InitializeTestContext = {
  lsp8: LSP8;
  initializeTransaction: TransactionResponse;
  deployParams: LSP8DeployParams;
};

export const shouldInitializeLikeLSP8 = (
  buildContext: () => Promise<LSP8InitializeTestContext>
) => {
  let context: LSP8InitializeTestContext;

  beforeEach(async () => {
    context = await buildContext();
  });

  describe("when the contract was initialized", () => {
    it("should have registered its ERC165 interface", async () => {
      expect(await context.lsp8.supportsInterface(INTERFACE_IDS.LSP8));
    });

    it("should have set expected entries with ERC725Y.setData", async () => {
      const lsp8SupportedStandardsKey =
        "0xeafec4d89fa9619884b6b891356264550000000000000000000000006a3c8618";
      const lsp8SupportedStandardsValue = "0x6a3c8618";
      await expect(context.initializeTransaction).toHaveEmittedWith(context.lsp8, "DataChanged", [
        lsp8SupportedStandardsKey,
        lsp8SupportedStandardsValue,
      ]);
      expect(await context.lsp8.getData([lsp8SupportedStandardsKey])).toEqual([
        lsp8SupportedStandardsValue,
      ]);

      const nameKey = "0xdeba1e292f8ba88238e10ab3c7f88bd4be4fac56cad5194b6ecceaf653468af1";
      const expectedNameValue = ethers.utils.hexlify(
        ethers.utils.toUtf8Bytes(context.deployParams.name)
      );
      await expect(context.initializeTransaction).toHaveEmittedWith(context.lsp8, "DataChanged", [
        nameKey,
        expectedNameValue,
      ]);
      expect(await context.lsp8.getData([nameKey])).toEqual([expectedNameValue]);

      const symbolKey = "0x2f0a68ab07768e01943a599e73362a0e17a63a72e94dd2e384d2c1d4db932756";
      const expectedSymbolValue = ethers.utils.hexlify(
        ethers.utils.toUtf8Bytes(context.deployParams.symbol)
      );
      await expect(context.initializeTransaction).toHaveEmittedWith(context.lsp8, "DataChanged", [
        symbolKey,
        expectedSymbolValue,
      ]);
      expect(await context.lsp8.getData([symbolKey])).toEqual([expectedSymbolValue]);
    });
  });
};

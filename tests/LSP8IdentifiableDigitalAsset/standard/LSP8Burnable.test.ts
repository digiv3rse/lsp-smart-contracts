import { ethers } from 'hardhat';
import { SignerWithAddress } from '@nomiclabs/hardhat-ethers/signers';

import { LSP8BurnableTester, LSP8BurnableTester__factory } from '../../../types';

import { shouldInitializeLikeLSP8 } from '../LSP8IdentifiableDigitalAsset.behaviour';
import { LSP4_TOKEN_TYPES, LSP8_TOKEN_ID_SCHEMA } from '../../../constants';

type LSP8BurnableTestContext = {
  accounts: SignerWithAddress[];
  lsp8Burnable: LSP8BurnableTester;
  deployParams: {
    name: string;
    symbol: string;
    newOwner: string;
    lsp4TokenType: number;
    lsp8TokenIdSchema: number;
  };
};

describe('LSP8Burnable with constructor', () => {
  const buildTestContext = async () => {
    const accounts = await ethers.getSigners();
    const deployParams = {
      name: 'LSP8 Burnable - deployed with constructor',
      symbol: 'BRN',
      newOwner: accounts[0].address,
      lsp4TokenType: LSP4_TOKEN_TYPES.NFT,
      lsp8TokenIdSchema: LSP8_TOKEN_ID_SCHEMA.NUMBER,
    };

    const lsp8Burnable = await new LSP8BurnableTester__factory(accounts[0]).deploy(
      deployParams.name,
      deployParams.symbol,
      deployParams.newOwner,
      deployParams.lsp4TokenType,
      deployParams.lsp8TokenIdSchema,
    );

    return { accounts, lsp8Burnable, deployParams };
  };

  describe('when deploying the contract', () => {
    let context: LSP8BurnableTestContext;

    before(async () => {
      context = await buildTestContext();
    });

    shouldInitializeLikeLSP8(async () => {
      const { lsp8Burnable: lsp8, deployParams } = context;

      return {
        lsp8,
        deployParams,
        initializeTransaction: context.lsp8Burnable.deployTransaction,
      };
    });
  });
});

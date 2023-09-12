import { ethers } from 'hardhat';
import { expect } from 'chai';

import { LSP8Tester__factory, LSP8IdentifiableDigitalAsset } from '../../../types';

import {
  getNamedAccounts,
  shouldBehaveLikeLSP8,
  shouldInitializeLikeLSP8,
  LSP8TestContext,
} from '../LSP8IdentifiableDigitalAsset.behaviour';

import {
  LSP17TestContext,
  shouldBehaveLikeLSP17,
} from '../../LSP17ContractExtension/LSP17ExtendableTokens.behaviour';

import {
  LS4DigitalAssetMetadataTestContext,
  shouldBehaveLikeLSP4DigitalAssetMetadata,
} from '../../LSP4DigitalAssetMetadata/LSP4DigitalAssetMetadata.behaviour';
import { LSP8_TOKEN_ID_TYPES } from '../../../constants';

describe('LSP8IdentifiableDigitalAsset with constructor', () => {
  const buildTestContext = async (nftType: number): Promise<LSP8TestContext> => {
    const accounts = await getNamedAccounts();
    const deployParams = {
      name: 'LSP8 - deployed with constructor',
      symbol: 'NFT',
      newOwner: accounts.owner.address,
      tokenIdType: nftType,
    };
    const lsp8 = await new LSP8Tester__factory(accounts.owner).deploy(
      deployParams.name,
      deployParams.symbol,
      deployParams.newOwner,
      deployParams.tokenIdType,
    );

    return { accounts, lsp8, deployParams };
  };

  const buildLSP4DigitalAssetMetadataTestContext =
    async (): Promise<LS4DigitalAssetMetadataTestContext> => {
      const { lsp8 } = await buildTestContext(0);
      const accounts = await ethers.getSigners();

      const deployParams = {
        owner: accounts[0],
      };

      return {
        contract: lsp8 as LSP8IdentifiableDigitalAsset,
        accounts,
        deployParams,
      };
    };

  const buildLSP17TestContext = async (): Promise<LSP17TestContext> => {
    const accounts = await ethers.getSigners();

    const deployParams = {
      name: 'LSP8 - deployed with constructor',
      symbol: 'NFT',
      owner: accounts[0],
      tokenIdType: LSP8_TOKEN_ID_TYPES.NUMBER,
    };
    const contract = await new LSP8Tester__factory(accounts[0]).deploy(
      deployParams.name,
      deployParams.symbol,
      deployParams.owner.address,
      deployParams.tokenIdType,
    );

    return { accounts, contract, deployParams };
  };

  describe('when deploying the contract', () => {
    it('should revert when deploying with address(0) as owner', async () => {
      const accounts = await ethers.getSigners();

      const deployParams = {
        name: 'LSP8 - deployed with constructor',
        symbol: 'NFT',
        newOwner: ethers.constants.AddressZero,
      };

      await expect(
        new LSP8Tester__factory(accounts[0]).deploy(
          deployParams.name,
          deployParams.symbol,
          ethers.constants.AddressZero,
          0,
        ),
      ).to.be.revertedWith('Ownable: new owner is the zero address');
    });

    [{ tokenIdType: 6 }, { tokenIdType: 414 }, { tokenIdType: 1111111 }].forEach(
      ({ tokenIdType }) => {
        it(`should revert when deploying with value = ${tokenIdType} for the tokenId type`, async () => {
          const accounts = await ethers.getSigners();

          const deployParams = {
            name: 'LSP8 - deployed with constructor',
            symbol: 'NFT',
            newOwner: accounts[0].address,
          };

          const lsp8ContractToDeploy = new LSP8Tester__factory(accounts[0]);

          await expect(
            lsp8ContractToDeploy.deploy(
              deployParams.name,
              deployParams.symbol,
              accounts[0].address,
              tokenIdType,
            ),
          ).to.be.revertedWithCustomError(lsp8ContractToDeploy, 'LSP8InvalidTokenIdType');
        });
      },
    );

    describe('once the contract was deployed', () => {
      let context: LSP8TestContext;

      before(async () => {
        context = await buildTestContext(0);
      });

      shouldInitializeLikeLSP8(async () => {
        const { lsp8, deployParams } = context;

        return {
          lsp8,
          deployParams,
          initializeTransaction: context.lsp8.deployTransaction,
        };
      });
    });
  });

  describe('when testing deployed contract', () => {
    shouldBehaveLikeLSP4DigitalAssetMetadata(buildLSP4DigitalAssetMetadataTestContext);
    shouldBehaveLikeLSP8(buildTestContext);
    shouldBehaveLikeLSP17(buildLSP17TestContext);
  });
});

import { ethers } from 'hardhat';
import { BytesLike } from 'ethers';
import { PromiseOrValue } from '../../types/common';
import { UniversalProfileInit__factory } from 'universalprofile/types';
import {
  LSP23LinkedContractsFactory__factory,
  UniversalProfileInitPostDeploymentModule__factory,
  UniversalProfilePostDeploymentModule__factory,
} from 'lsp23/types';
import { LSP6KeyManagerInit__factory } from 'lsp6/types';

export async function calculateProxiesAddresses(
  salt: PromiseOrValue<BytesLike>,
  primaryImplementationContractAddress: PromiseOrValue<string>,
  secondaryImplementationContractAddress: PromiseOrValue<string>,
  secondaryContractInitializationCalldata: PromiseOrValue<BytesLike>,
  secondaryContractAddControlledContractAddress: PromiseOrValue<boolean>,
  secondaryContractExtraInitializationParams: PromiseOrValue<BytesLike>,
  upPostDeploymentModuleAddress: string,
  postDeploymentCalldata: BytesLike,
  linkedContractsFactoryAddress: string,
): Promise<[string, string]> {
  const generatedSalt = ethers.utils.keccak256(
    ethers.utils.defaultAbiCoder.encode(
      ['bytes32', 'address', 'bytes', 'bool', 'bytes', 'address', 'bytes'],
      [
        salt,
        secondaryImplementationContractAddress,
        secondaryContractInitializationCalldata,
        secondaryContractAddControlledContractAddress,
        secondaryContractExtraInitializationParams,
        upPostDeploymentModuleAddress,
        postDeploymentCalldata,
      ],
    ),
  );

  const expectedPrimaryContractAddress = ethers.utils.getCreate2Address(
    linkedContractsFactoryAddress,
    generatedSalt,
    ethers.utils.keccak256(
      '0x3d602d80600a3d3981f3363d3d373d3d3d363d73' +
        (primaryImplementationContractAddress as string).slice(2) +
        '5af43d82803e903d91602b57fd5bf3',
    ),
  );

  const expectedSecondaryContractAddress = ethers.utils.getCreate2Address(
    linkedContractsFactoryAddress,
    ethers.utils.keccak256(expectedPrimaryContractAddress),
    ethers.utils.keccak256(
      '0x3d602d80600a3d3981f3363d3d373d3d3d363d73' +
        (secondaryImplementationContractAddress as string).slice(2) +
        '5af43d82803e903d91602b57fd5bf3',
    ),
  );

  return [expectedPrimaryContractAddress, expectedSecondaryContractAddress];
}

export function createDataKey(prefix, address) {
  return prefix + address.slice(2);
}

export const create16BytesUint = (value: number) => {
  return ethers.utils.hexZeroPad(ethers.utils.hexlify(value), 16).slice(2);
};

export async function deployImplementationContracts() {
  const [deployer] = await ethers.getSigners();

  const KeyManagerInitFactory = new LSP6KeyManagerInit__factory(deployer);
  const keyManagerInit = await KeyManagerInitFactory.deploy();

  const UniversalProfileInitFactory = new UniversalProfileInit__factory(deployer);
  const universalProfileInit = await UniversalProfileInitFactory.deploy();

  const LinkedContractsFactoryFactory = new LSP23LinkedContractsFactory__factory(deployer);
  const LSP23LinkedContractsFactory = await LinkedContractsFactoryFactory.deploy();

  const UPPostDeploymentManagerFactory = new UniversalProfilePostDeploymentModule__factory(
    deployer,
  );
  const upPostDeploymentModule = await UPPostDeploymentManagerFactory.deploy();

  const UPInitPostDeploymentManagerFactory = new UniversalProfileInitPostDeploymentModule__factory(
    deployer,
  );
  const upInitPostDeploymentModule = await UPInitPostDeploymentManagerFactory.deploy();

  return {
    keyManagerInit,
    KeyManagerInitFactory,
    universalProfileInit,
    UniversalProfileInitFactory,
    LSP23LinkedContractsFactory,
    upPostDeploymentModule,
    upInitPostDeploymentModule,
  };
}

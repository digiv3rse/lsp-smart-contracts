# Changelog

All notable changes to this project will be documented in this file. See [standard-version](https://github.com/conventional-changelog/standard-version) for commit guidelines.

### [0.2.1](https://github.com/lukso-network/universalprofile-smart-contracts/compare/v0.2.0...v0.2.1) (2021-10-31)


### Bug Fixes

* github and npm release ci ([#41](https://github.com/lukso-network/universalprofile-smart-contracts/issues/41)) ([4276fb8](https://github.com/lukso-network/universalprofile-smart-contracts/commit/4276fb84f7d754d75513716b7a792454ea16d2ff))

## [0.2.0](https://github.com/lukso-network/universalprofile-smart-contracts/compare/v0.1.3...v0.2.0) (2021-10-31)


### ⚠ BREAKING CHANGES

* ILSP6 interface return type change.

* test!(KM): return bytes or revert on `execute` / `executeRelayCall`

Tests by interacting with `TargetContract`

* test!(KM): Remove gasLimit specified in tests.

* feat!(KM): Extend permission range to 256 (32 bytes)

* test!(KM): Use 32 bytes padding for 32 bytes permissions range

* test!: :heavy_plus_sign: set AddressPermissions[]  in tests

Addresses with permissions set MUST be added to an array inside ERC725Y key-value (see LSP6 specs)

* KeyManager returns bytes + permission range extended to bytes32  (#32) ([7b6dcf0](https://github.com/lukso-network/universalprofile-smart-contracts/commit/7b6dcf022fffe51b7f2f652e5ded719dbfaea8e2)), closes [#32](https://github.com/lukso-network/universalprofile-smart-contracts/issues/32)

### [0.1.3](https://github.com/lukso-network/universalprofile-smart-contracts/compare/v0.1.2...v0.1.3) (2021-08-31)


### Bug Fixes

* **publish:** include json artifacts ([f90a194](https://github.com/lukso-network/universalprofile-smart-contracts/commit/f90a194b94d2d26c3b173d01f715abfe31930e7f))

### [0.1.2](https://github.com/lukso-network/universalprofile-smart-contracts/compare/v0.1.1...v0.1.2) (2021-08-31)

### Features

- **framework:** migrate from truffle to hardhat ([pr5](https://github.com/lukso-network/universalprofile-smart-contracts/pull/5))
- **typechain:** provide web3 and ethers types ([cad4541](https://github.com/lukso-network/universalprofile-smart-contracts/commit/cad4541f4d0ca47742fac4800c2a43c8a158615d))

### 0.1.1 (2021-08-17)

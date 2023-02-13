const fs = require("fs");
const hre = require("hardhat");
const { exec } = require("child_process");

/**
 * @dev temporarily exclude the LSP7/8 Compatible contracts as these contain two `Transfer` and `Approve` events
 * with the same name and different parameters. This causes Web3j to crash when building the java artifacts
 */
const excludedContracts = [
  "LSP7CompatibleERC20",
  "LSP7CompatibleERC20InitAbstract",
  "LSP7CompatibleERC20Mintable",
  "LSP7CompatibleERC20MintableInit",
  "LSP8CompatibleERC721",
  "LSP8CompatibleERC721InitAbstract",
  "LSP8CompatibleERC721Mintable",
  "LSP8CompatibleERC721MintableInit",
];

hre.run("prepare-package").then(async () => {
  // create directory to write contract abi + binary files
  exec("mkdir android", () => {
    const contracts = hre.config.packager.contracts;

    for (const contract of contracts) {
      /**
       * TODO: re-include these contracts once the issue from Web3j is fixed
       * @see https://github.com/web3j/web3j/issues/1781
       */
      if (excludedContracts.includes(contract)) {
        continue;
      }

      let artifact = fs.readFileSync(`./artifacts/${contract}.json`);

      // create temporary file to use as sources for web3j
      let abiFile = `./android/${contract}.abi`;
      let binFile = `./android/${contract}.bin`;

      // write the abis + binary generated by Hardhat into temporary files
      // we want to rely on solidity compiler version + optimizer settings
      // defined in Hardhat project configs, not on external solc setting
      let abi = JSON.parse(artifact).abi;
      let bin = JSON.parse(artifact).bytecode;

      fs.writeFile(abiFile, JSON.stringify(abi), { flag: "w" }, (err) => {
        if (err) console.error(err);
      });

      fs.writeFile(binFile, bin, { flag: "w" }, (err) => {
        if (err) console.error(err);
      });

      const destination =
        "./scripts/java/src/main/java/network/lukso/up/contracts";
      const package = "network.lukso.up.contracts";

      try {
        // generate smart contract wrappers in Java
        exec(
          `web3j generate solidity --abiFile=${abiFile} --binFile=${binFile} -o ${destination} -p ${package}`,
          (error, stdout, stderr) => {
            if (error) {
              console.log(`error: ${error.message}`);
              return;
            }
            if (stderr) {
              console.log(`stderr: ${stderr}`);
              return;
            }
            console.log(`stdout: ${stdout}`);
          }
        );
      } catch (error) {
        throw new Error(error);
      }
    }
  });
});

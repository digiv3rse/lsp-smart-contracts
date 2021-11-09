import { HardhatRuntimeEnvironment } from "hardhat/types";
import { DeployFunction } from "hardhat-deploy/types";

const deployUniversalProfile: DeployFunction = async ({
  deployments,
  getNamedAccounts,
}: HardhatRuntimeEnvironment) => {
  const { deploy } = deployments;
  const { owner } = await getNamedAccounts();

  await deploy("UniversalProfile", {
    from: owner,
    args: [owner],
    gasLimit: 3_000_000,
    log: true,
  });
};

export default deployUniversalProfile;
deployUniversalProfile.tags = ["UniversalProfile"];

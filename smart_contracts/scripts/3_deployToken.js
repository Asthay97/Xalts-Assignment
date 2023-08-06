const hre = require("hardhat");

async function main() {
  const Tokens = await hre.ethers.getContractFactory("Tokens");
  const tokens = await Tokens.deploy();

  await tokens.deployed();

  console.log(`Token contract deployed on polygon mumbai to ${tokens.address}`);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
const hre = require("hardhat");

async function main() {
  const PortfolioFundBalancer = await hre.ethers.getContractFactory("FundBalancerContract");
  const portfolioFundBalancer = await PortfolioFundBalancer.deploy(
    "0x071A49Dc12c1744759a142E1a862bEE1ee5c4e34",
    "0x566E21aFE80E341A2B542A7a1d068202c3b9dD69",
    3000,
    [["mDAI","0x2310F0b0da426F9B8cF8279aD8CE8aEb5EB09DC6"],["mBTC","0xC02Ff87AefC1B884E3d7733082F38EDaA2e17597"], ["mETH","0x7a161337F3e4c6e97959d7b0EB78B212d7F039dC"]]
    );

  await portfolioFundBalancer.deployed();

  console.log(`PortfolioFundBalancer contract deployed on polygon mumbai to ${portfolioFundBalancer.address}`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
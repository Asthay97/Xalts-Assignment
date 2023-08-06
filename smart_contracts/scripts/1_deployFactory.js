const { ethers, upgrades } = require('hardhat');
const delay = ms => new Promise(res => setTimeout(res, ms));

async function main() {
  const FactoryC = await hre.ethers.getContractFactory("Factory");
  const factory = await FactoryC.deploy();

  await factory.deployed();

  console.log("factory deployed to:", factory.address);
  const Factory = await ethers.getContractAt('Factory', factory.address);
  console.log('here address:', await Factory.GreeterArray(0));
  await Factory.deployFundBalancer(
        "0x071A49Dc12c1744759a142E1a862bEE1ee5c4e34",
        "0x566E21aFE80E341A2B542A7a1d068202c3b9dD69",
        3000,
        [["mDAI","0x2310F0b0da426F9B8cF8279aD8CE8aEb5EB09DC6"],["mBTC","0xC02Ff87AefC1B884E3d7733082F38EDaA2e17597"], ["mETH","0x7a161337F3e4c6e97959d7b0EB78B212d7F039dC"]]
      );
  console.log('here address:', await Factory.GreeterArray(0))
  const addr = await fundBalancerFactory.gfGetter(0);
  console.log('here get tokens from factory', addr );
  const FundContract = await hre.ethers.getContractFactory("FundBalancerContract");
  console.log('here get tokens from main contract',FundContract(addr).getTokens() );
    
    //   await delay(10000);
    //   const getAddress = await fundBalancerFactory.fundBalancerAddress();
    //   console.log('fundBalancer contract deployed to:', getAddress );
      

}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });


// async function main() {
//   // Deploying the fundBalancerFactory contract
//   const FundBalancerFactory = await hre.ethers.getContractFactory('FundBalancerFactory');
//   const fundBalancerFactory = await FundBalancerFactory.deploy();
//   await fundBalancerFactory.deployed();

//   console.log('fundBalancerFactory contract deployed to:', fundBalancerFactory.address);
//   await fundBalancerFactory.deployFundBalancer(
//     "0x071A49Dc12c1744759a142E1a862bEE1ee5c4e34",
//     "0x566E21aFE80E341A2B542A7a1d068202c3b9dD69",
//     3000,
//     [["mDAI","0x2310F0b0da426F9B8cF8279aD8CE8aEb5EB09DC6"],["mBTC","0xC02Ff87AefC1B884E3d7733082F38EDaA2e17597"], ["mETH","0x7a161337F3e4c6e97959d7b0EB78B212d7F039dC"]]
//   );

//   await delay(10000);
//   const getAddress = await fundBalancerFactory.fundBalancerAddress();
//   console.log('fundBalancer contract deployed to:', getAddress );
  
//   const FundBalancerContract = await hre.ethers.getContractFactory('FundBalancerContract');
//   console.log('get tokens:', await FundBalancerContract)//(getAddress).getTokens());
// }

// main()
//   .then(() => process.exit(0))
//   .catch((error) => {
//     console.error(error);
//     process.exit(1);
//   });
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "./FundBalancerContract.sol";

contract Factory {
   FundBalancerContract[] public GreeterArray;

   function deployFundBalancer(address _usdcAddress, address _owner, uint24 _poolFee, FundBalancerContract.Tokens[] memory _tokens) public{
        FundBalancerContract balancerAddress = new FundBalancerContract(_usdcAddress, _owner, _poolFee, _tokens);
        GreeterArray.push(balancerAddress);
    }

   function gfGetter(uint256 _greeterIndex) public view returns (FundBalancerContract.Tokens[] memory) {
    return FundBalancerContract(address(GreeterArray[_greeterIndex])).getTokens();
   }
}

// pragma solidity >=0.8.0;

// import "./FundBalancerContract.sol";

// // Factory contract
// contract FundBalancerFactory {
//     event fundBalancerDeployed(address balancerAddress, address owner);
//     address public fundBalancerAddress;
//     function deployFundBalancer(address _usdcAddress, address _owner, uint24 _poolFee, FundBalancerContract.Tokens[] memory _tokens) external payable{
//         FundBalancerContract balancerAddress = new FundBalancerContract(_usdcAddress, _owner, _poolFee, _tokens);
//         emit fundBalancerDeployed(address(balancerAddress), _owner);
//         fundBalancerAddress = address(balancerAddress);
//     }
// }

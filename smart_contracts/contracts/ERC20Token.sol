// SPDX-License-Identifier: MIT
pragma solidity >=0.7.6;

import "./OpenZeppelin/ERC20.sol";

contract Tokens is ERC20{
    uint public initSupply = 331718750000000 * 1000000000000000000;

    constructor() ERC20("A Third Token","ATT"){
        _mint(msg.sender, initSupply);
    }
}
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract StakingToken is ERC20 {

  uint256 public rewardRate = 1e18;

  mapping(address => uint256) public rewards;
  mapping(address => uint256) public lastUpdate;

  constructor(uint256 initialSupply) ERC20("StakingToken", "STK"){
    _mint(msg.sender, initialSupply);
  }


  function stake(uint256 amount) public {
    _updateReward(msg.sender);
    _transfer(msg.sender, address(this), amount);
  }

  function withdraw(uint256 amount) public {
    _updateReward(msg.sender);
    _transfer(address(this), msg.sender, amount);
  }

  
  function getReward() public {
    _updateReward(msg.sender);
    rewards[msg.sender] = 0;
  }

  function _updateReward(address account) internal {
    rewards[account] += rewardRate * (block.number - lastUpdate[account]);
    lastUpdate[account] = block.number;
  }
}
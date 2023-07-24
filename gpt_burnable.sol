// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

constructor BurnableToken is ERC20 {
  constructor(uint256 initSupply) ERC20("BurnableToken", "BTN") {
    _mint(msg.sender, initSupply);
  }

  function burn(uint256 amount) public {
    _burn(msg.sender, amount);
  }
}
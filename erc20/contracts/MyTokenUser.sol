// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "./MyToken.sol";

contract MyTokenUser {
  MyToken public myToken;

  constructor(address _myTokenAddress) {
    myToken = MyToken(_myTokenAddress);
  }

  function getMyBalance() public view returns (uint256) {
    return myToken.balanceOf(msg.sender);
  }

  function transferTo(address recipient, uint256 amount) public {
    myToken.transfer(recipient, amount);
  }
}
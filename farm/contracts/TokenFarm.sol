// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract FarmToken is ERC20 {
    constructor(uint256 initialSupply) ERC20("FarmToken", "FRM") {
        _mint(msg.sender, initialSupply);
    }
}

contract StakingToken is ERC20 {
    constructor(uint256 initialSupply) ERC20("StakingToken", "STK") {
        _mint(msg.sender, initialSupply);
    }
}

contract TokenFarm {
    FarmToken public farmToken;
    StakingToken public stakingToken;
    address[] public stakers;
    
    mapping(address => uint256) public stakingBalance;
    mapping(address => bool) public hasStaked;



    constructor(FarmToken _farmToken, StakingToken _stakingToken) {
        farmToken = _farmToken;
        stakingToken = _stakingToken;
    }
    
    function stakeTokens(uint256 _amount) public {
        require(_amount > 0, "amount cannot be 0");

        stakingToken.transferFrom(msg.sender, address(this), _amount);
        stakingBalance[msg.sender] = stakingBalance[msg.sender] + _amount;
        

        if(!hasStaked[msg.sender]) {
            stakers.push(msg.sender);
        }
        
        hasStaked[msg.sender] = true;
    }
    
    function unstakeTokens() public {
        uint256 balance = stakingBalance[msg.sender];
        require(balance > 0, "staking balance cannot be 0");

        stakingToken.transfer(msg.sender, balance);
        stakingBalance[msg.sender] = 0;
        hasStaked[msg.sender] = false;
    }

    function issueTokens() public {
        for(uint i=0; i<stakers.length; i++) {
            address recipient = stakers[i];
            uint256 balance = stakingBalance[recipient];
            if(balance > 0 && hasStaked[recipient] == true) {
                farmToken.transfer(recipient, balance);
            }
        }
    }
}

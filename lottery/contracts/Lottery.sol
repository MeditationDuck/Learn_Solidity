// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract Lottery {
    address payable[] public participants;
    address public manager;

    constructor() {
        manager = msg.sender;
    }

    function participate() public payable {
        require(msg.value > .01 ether, "Not enough ether");
        participants.push(payable(msg.sender));
    }

    function random() private view returns (uint) {
        return uint(keccak256(abi.encodePacked(block.difficulty, block.timestamp, participants)));
    }

    function pickWinner() public {
        require(msg.sender == manager);
        uint index = random() % participants.length;
        participants[index].transfer(address(this).balance);
        participants = new address payable[](0);// fill to zero length
    }
}

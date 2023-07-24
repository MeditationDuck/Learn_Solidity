// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract SimpleVoting {
    struct Option {
        string name;
        uint voteCount;
    }

    Option[] public options;
    mapping(address => bool) public hasVoted;
    uint public endBlock;

    constructor(uint _endBlock) {
        endBlock = _endBlock;
    }

    function proposeOption(string memory _name) public {
        require(block.number < endBlock, "Vote has ended");
        options.push(Option(_name, 0));
    }

    function vote(uint _optionId) public {
        require(block.number < endBlock, "Vote has ended");
        require(!hasVoted[msg.sender], "You have already voted");

        options[_optionId].voteCount++;
        hasVoted[msg.sender] = true;
    }

    function endVote() public view returns (string memory) {
        // require(block.number >= endBlock, "Vote has not ended");

        uint winningVoteCount = 0;
        uint winningOptionId;
        for (uint i = 0; i < options.length; i++) {
            if (options[i].voteCount > winningVoteCount) {
                winningVoteCount = options[i].voteCount;
                winningOptionId = i;
            }
        }
        return options[winningOptionId].name;
    }
}

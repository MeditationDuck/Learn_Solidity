// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract Auction {
    address public highestBidder;
    uint public highestBid;
    bool public auctionEnded;

    constructor() {
        auctionEnded = false;
    }

    function bid() public payable {
        require(!auctionEnded, "Auction already ended.");
        require(msg.value > highestBid, "There already is a higher bid.");

        if (highestBidder != address(0)) {
            // Refund the previously highest bidder.
            payable(highestBidder).transfer(highestBid);
        }

        highestBid = msg.value;
        highestBidder = msg.sender;
    }

    function endAuction() public {
        require(!auctionEnded, "Auction already ended.");
        auctionEnded = true;
    }

    function withdraw() public {
        require(auctionEnded, "Auction not yet ended.");
        require(msg.sender == highestBidder, "You are not the highest bidder.");

        uint amount = highestBid;
        highestBid = 0;
        payable(msg.sender).transfer(amount);
    }
}

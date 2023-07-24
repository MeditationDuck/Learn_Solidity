const { ethers } = require("hardhat");
const { assert } = require("chai");

describe("Auction", function () {
    let Auction, auction, owner, addr1, addr2, addrs;

    beforeEach(async function() {
        [owner, addr1, addr2, ...addrs] = await ethers.getSigners();

        Auction = await ethers.getContractFactory("Auction");
        auction = await Auction.deploy();
        await auction.deployed();
    });

    it("Allows users to bid and updates highest bid", async function() {
        await auction.connect(addr1).bid({ value: ethers.utils.parseEther('1') });
        assert.equal(await auction.highestBidder(), addr1.address);

        await auction.connect(addr2).bid({ value: ethers.utils.parseEther('2') });
        assert.equal(await auction.highestBidder(), addr2.address);
    });

    it("Prevents users from bidding less than the highest bid", async function() {
        await auction.connect(addr1).bid({ value: ethers.utils.parseEther('3') });
        
        try {
            await auction.connect(addr2).bid({ value: ethers.utils.parseEther('0.5') });
            assert.fail('Should have thrown before');
        } catch (err) {
            assert(err.toString().includes('There already is a higher bid'), 'Error message should contain "revert There already is a higher bid"');
        }
    });

    it("Allows the highest bidder to withdraw after the auction ended", async function() {
        await auction.connect(addr1).bid({ value: ethers.utils.parseEther('4') });
        await auction.connect(addr2).bid({ value: ethers.utils.parseEther('6') });

        await auction.endAuction();

        try {
            await auction.connect(addr1).withdraw();
            assert.fail('Should have thrown before');
        } catch (err) {
            assert(err.toString().includes('You are not the highest bidder'), 'Error message should contain "revert You are not the highest bidder"');
        }

        const balanceBeforeWithdraw = await addr2.getBalance();
        await auction.connect(addr2).withdraw();

        assert((await addr2.getBalance()).gt(balanceBeforeWithdraw), "Balance of the highest bidder should have increased");
    });
});

const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("SimpleVoting", function () {
  let SimpleVoting, simpleVoting, owner, addr1, addr2, addrs;

  beforeEach(async function() {
    [owner, addr1, addr2, ...addrs] = await ethers.getSigners();

    SimpleVoting = await ethers.getContractFactory("SimpleVoting");// selecting the contract to test
    simpleVoting = await SimpleVoting.deploy(10000); // assuming 10000 is a suitable block number
    await simpleVoting.deployed();// waiting for the contract to be deployed
  });

  it("Allows users to propose options and vote", async function() {
    await simpleVoting.proposeOption("Option 1");
    await simpleVoting.connect(addr1).vote(0); //addr1 votes for option 0
    expect(await simpleVoting.hasVoted(addr1.address)).to.equal(true);

    await simpleVoting.proposeOption("Option 2");
    await simpleVoting.connect(addr2).vote(1); //addr2 votes for option 1
    expect(await simpleVoting.hasVoted(addr2.address)).to.equal(true);
  });

  it("Prevents users from voting more than once", async function() {
    await simpleVoting.proposeOption("Option 1");
    await simpleVoting.connect(addr1).vote(0);

    try {
      await simpleVoting.connect(addr1).vote(0);
      assert.fail("The transaction should have thrown an error");
    } catch (err) {
      expect(err.message).to.contain("You have already voted");
    }

    // await expect(simpleVoting.connect(addr1).vote(0)).to.be.revertedWith("You have already voted");
  });

  it("Allows to conclude the vote", async function() {
    await simpleVoting.proposeOption("Option 1");
    await simpleVoting.connect(addr1).vote(0);

    await simpleVoting.proposeOption("Option 2");
    await simpleVoting.connect(addr2).vote(1);
    await simpleVoting.connect(addrs[0]).vote(1);
    await simpleVoting.connect(addrs[1]).vote(1);

    // simulate end of the vote
    await network.provider.send("evm_increaseTime", [100000]); // increase time
    await network.provider.send("evm_mine"); // mine the next block

    expect(await simpleVoting.endVote()).to.equal("Option 2");
  });
});

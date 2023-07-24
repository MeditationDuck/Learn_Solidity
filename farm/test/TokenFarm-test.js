const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("TokenFarm", function () {
  let owner, alice, TokenFarm, FarmToken, StakingToken, tokenFarm, farmToken, stakingToken;
  
  beforeEach(async function() {
    [owner, alice] = await ethers.getSigners();

    TokenFarm = await ethers.getContractFactory("TokenFarm");
    FarmToken = await ethers.getContractFactory("FarmToken");
    StakingToken = await ethers.getContractFactory("StakingToken");

    farmToken = await FarmToken.deploy("1000000");
    stakingToken = await StakingToken.deploy("1000000");
    tokenFarm = await TokenFarm.deploy(farmToken.address, stakingToken.address);

    await farmToken.transfer(tokenFarm.address, "500000");

    await stakingToken.transfer(alice.address, "1000");
  });

  it("Allows users to stake tokens", async function() {
    await stakingToken.connect(alice).approve(tokenFarm.address, "100");
    await tokenFarm.connect(alice).stakeTokens("100");

    expect((await stakingToken.balanceOf(tokenFarm.address)).toString()).to.equal("100");
    expect((await tokenFarm.stakingBalance(alice.address)).toString()).to.equal("100");
    expect(await tokenFarm.isStaking(alice.address)).to.be.true;
  });

  it("Rewards users for staking tokens", async function() {
    await stakingToken.connect(alice).approve(tokenFarm.address, "100");
    await tokenFarm.connect(alice).stakeTokens("100");
    // await tokenFarm.issueTokens();

    expect(await farmToken.balanceOf(alice.address)).to.equal("100");
  });

  it("Allows users to unstake tokens", async function() {
    await stakingToken.connect(alice).approve(tokenFarm.address, "100");
    await tokenFarm.connect(alice).stakeTokens("100");
    await tokenFarm.connect(alice).unstakeTokens();

    expect(await stakingToken.balanceOf(tokenFarm.address)).to.equal("0");
    expect(await tokenFarm.stakingBalance(alice.address)).to.equal("0");
    expect(await tokenFarm.isStaking(alice.address)).to.be.false;
  });
});


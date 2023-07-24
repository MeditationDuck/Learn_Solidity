const { ethers } = require("hardhat");
const { assert } = require("chai");

describe("Lottery", function () {
  let Lottery, lottery, owner, addr1, addr2, addrs;

  beforeEach(async function() {
    [owner, addr1, addr2, ...addrs] = await ethers.getSigners();

    Lottery = await ethers.getContractFactory("Lottery");
    lottery = await Lottery.deploy();
    await lottery.deployed();
  });
  
  it("Allows users to participate and tracks participants", async function() {
    await lottery.connect(addr1).participate({ value: ethers.utils.parseEther('1') });
    assert.equal(await lottery.participants(0), addr1.address);
    await lottery.connect(addr2).participate({ value: ethers.utils.parseEther('2') });
    assert.equal(await lottery.participants(1), addr2.address);
  });

  it("Prevents users from participating with less than 0.01 ETH", async function() {
    try{
      await lottery.connect(addr1).participate({ value: ethers.utils.parseEther('0.0005') });
    } catch(err) {
      assert(err.toString().includes('Not enough ether'), 'Error message should contain "revert You must send at least 0.01 ETH"');
    }
  });
});
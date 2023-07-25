const { expect } = require("chai");

describe("MyToken and MyTokenUser", function() {
  let myToken, myTokenUser, owner, addr1;

  beforeEach(async function(){
    const MyToken = await ethers.getContractFactory("MyToken");
    myToken = await MyToken.deploy(ethers.utils.parseEther("10000"));
    await myToken.deployed();

    const MyTokenUser = await ethers.getContractFactory("MyTokenUser");
    myTokenUser = await MyTokenUser.deploy(myToken.address);
    await myTokenUser.deployed();

    [owner, addr1] = await ethers.getSigners();
  });
  it("myToken should have 10000 of ether", async function(){
    // await myToken.transfer(myTokenUser.address, ethers.utils.parseEther("10000"));

    // assert.equal((await myTokenUser.getMyBalance()).toString(), ethers.utils.parseEther("10000").toString());
    expect((await myTokenUser.getMyBalance()).toString()).to.equal(ethers.utils.parseEther("10000").toString());

  });
  

  it("Should return the right balance and transfer tokens", async function() {
  
    // Transfer 50 tokens from owner to addr1
    await myToken.transfer(addr1.address, ethers.utils.parseEther('50'));
    // await myTokenUser.transferTo(addr1.address, ethers.utils.parseEther('50'));

    // Check final balances
    // assert.equal((await myTokenUser.getMyBalance()).toString(), ethers.utils.parseEther("9950").toString());
    expect((await myTokenUser.getMyBalance()).toString()).to.equal(ethers.utils.parseEther("9950").toString());

    expect((await myToken.balanceOf(addr1.address)).toString()).to.equal(ethers.utils.parseEther("50").toString());

    // assert.equal((await myToken.balanceOf(addr1.address)).toString(), ethers.utils.parseEther("50").toString());
  });
});

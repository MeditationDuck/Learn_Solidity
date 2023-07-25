const { ethers } = require("hardhat");
const { expect } = require("chai");

describe("MyToken", function () {
    let MyToken, myToken, deployer, addr1;

    beforeEach(async function() {
        [deployer, addr1] = await ethers.getSigners();

        MyToken = await ethers.getContractFactory("MyToken");
        myToken = await MyToken.deploy(ethers.utils.parseEther('1000'));
        await myToken.deployed();
    });

    it("Assigns initial supply to the deployer", async function() {
        const deployerBalance = await myToken.balanceOf(deployer.address);
        expect(deployerBalance.toString()).to.equal(ethers.utils.parseEther('1000').toString());

    });

    it("Allows for token transfers", async function() {
        // Deployer transfers 10 tokens to addr1
        await myToken.connect(deployer).transfer(addr1.address, ethers.utils.parseEther('10'));

        const addr1Balance = await myToken.balanceOf(addr1.address);
        expect(addr1Balance.toString()).to.equal(ethers.utils.parseEther('10').toString());
    });
});

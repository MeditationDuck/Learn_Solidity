// test/MyNFT-test.js
const { expect } = require("chai");

describe("MyNFT", function() {
    let myNFT;
    beforeEach (async function() {
        const MyNFT = await ethers.getContractFactory("MyNFT");
        myNFT = await MyNFT.deploy();
        await myNFT.deployed();
    });
    it("Should mint a new token", async function() {
        const [owner] = await ethers.getSigners();
        await myNFT.mint(owner.address, "https://meditationduck.com/1");
        expect(await myNFT.ownerOf(1)).to.equal(owner.address);


        expect(await myNFT.tokenURI(1)).to.eq("https://meditationduck.com/1");
    });
});

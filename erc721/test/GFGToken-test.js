// test/GFGToken.test.js

const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("GFGToken", function() {
  let GFGToken;
  let gfgToken;
  let owner;
  let addr1;
  let addr2;
  let addrs;

  beforeEach(async function() {
    GFGToken = await ethers.getContractFactory("GFGToken");
    [owner, addr1, addr2, ...addrs] = await ethers.getSigners();
    gfgToken = await GFGToken.deploy();
    await gfgToken.deployed();
  });

  describe("Deployment", function() {
    it("Should set the right owner", async function() {
      expect(await gfgToken.owner()).to.equal(owner.address);
    });

    it("Should assign the total supply of tokens to the owner", async function() {
      const ownerBalance = await gfgToken.balanceOf(owner.address);
      expect((await gfgToken.totalSupply()).toString()).to.equal(ownerBalance.toString());
    });
  });

  describe("Transactions", function() {
    it("Should fail if sender doesn’t have enough tokens", async function() {
      const initialOwnerBalance = await gfgToken.balanceOf(owner.address);

      // Try to send 1 token from addr1 (0 tokens) to owner (1000 tokens).
      // `require` will evaluate false and revert the transaction.
      let reverted = false; 
      try{
        await gfgToken.connect(addr1).transferFrom(addr1.address, owner.address, 1);
      } catch(e){
        // console.log(e);
        reverted = true;
      }
      expect(reverted).to.be.true;

      // Owner balance shouldn't have changed.
      expect((await gfgToken.balanceOf(owner.address)).toString()).to.equal(
        initialOwnerBalance.toString()
      );
    });

    it("Should update balances after transfers", async function() {
      // Mint a new token and capture the emitted event.
      let mintTx = await gfgToken.connect(owner).safeMint("ipfs://uri");
      let receipt = await mintTx.wait();
      let event = receipt.events.filter((x) => {return x.event == "Minted"});
      let tokenId = event[0].args.tokenId;
    
      // Transfer from owner to addr1.
      await gfgToken.connect(owner).transferFrom(owner.address, addr1.address, tokenId);
    
      expect((await gfgToken.balanceOf(owner.address)).toString()).to.equal("0")
      expect((await gfgToken.balanceOf(addr1.address)).toString()).to.equal("1");
      
      // Check token URI
      expect(await gfgToken.tokenURI(tokenId)).to.equal("ipfs://uri");
    });
  });
});

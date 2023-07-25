const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("GFGToken", function() {
  let GFGToken, gfgToken, owner, addr1;
  
  beforeEach(async function () {
    GFGToken = await ethers.getContractFactory("GFGToken");

    [owner] = await ethers.getSigners();
    
    gfgToken = await GFGToken.deploy();
    await gfgToken.deployed();
    
    [addr1] = await ethers.getSigners();
  });

  it("Should safemint", async function() {
    
    await gfgToken.connect(owner).safeMint("https://meditationduck.com/1");

    expect(await gfgToken.ownerOf(0)).to.eq(owner.address);
    expect(await gfgToken.tokenURI(0)).to.eq("https://meditationduck.com/1");
  });

  it("Should only allow owner to mint", async function() {
    await expect(
      gfgToken.connect(addr1).safeMint("https://meditationduck.com/1").catch((err) => {
        throw new Error(err.message);
      })
    ).to.be.eventually.throw("Ownable: caller is not the owner");
  });
  

  
});
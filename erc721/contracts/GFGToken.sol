// SPDX-License-Identifier: MIT

/**
 * Author: Lawrence Onah <paplow01@gmail.com>
 * Github: https://github.com/kodjunkie
 */

pragma solidity ^0.8.1;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

contract GFGToken is ERC721, ERC721Enumerable, ERC721URIStorage, Ownable {
    using Counters for Counters.Counter;
 
    Counters.Counter private _tokenCountCounter;
 
    //set the NFT name and symbol
    constructor() ERC721("GFGToken", "GFG") {}
    //mint the NFT using Owner Address
    function safeMint(string memory _uri) public onlyOwner {
        uint256 tokenCount = _tokenCountCounter.current();
        _tokenCountCounter.increment();
        _safeMint(msg.sender, tokenCount);
        _setTokenURI(tokenCount, _uri);
    }
     
    function _beforeTokenTransfer(address from, address to, uint256 tokenCount, uint256 batchSize)
        internal
        override(ERC721, ERC721Enumerable)
    {
        super._beforeTokenTransfer(from, to, tokenCount, batchSize);
    }
 
    function _burn(uint256 tokenCount) internal override(ERC721, ERC721URIStorage) {
        super._burn(tokenCount);
    }
 
    function tokenURI(uint256 tokenCount) public view override(ERC721, ERC721URIStorage) returns (string memory)
    {
        return super.tokenURI(tokenCount);
    }
 
    function supportsInterface(bytes4 interfaceId) public view override(ERC721, ERC721Enumerable, ERC721URIStorage)returns (bool)
    {
        return super.supportsInterface(interfaceId);
    }
}
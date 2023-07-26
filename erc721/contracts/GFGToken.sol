// SPDX-License-Identifier: GPL-3.0
pragma solidity >=0.8.6 <0.9.0; 
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
/// @title A contract for demonstrate ERC-721 Token
/// @author Jitendra Kumar
/// @notice For now, this contract just show how to create an ERC-721 Token
contract GFGToken is ERC721, ERC721Enumerable, ERC721URIStorage, Ownable {
    using Counters for Counters.Counter;
 
    Counters.Counter private _tokenCountCounter;
    event Minted(address owner, uint256 tokenId);
 
    //set the NFT name and symbol
    constructor() ERC721("GFGToken", "GFG") {}
    //mint the NFT using Owner Address
    function safeMint(string memory _uri) public onlyOwner returns(uint256){
        uint256 tokenCount = _tokenCountCounter.current();
        _tokenCountCounter.increment();
        _safeMint(msg.sender, tokenCount);
        _setTokenURI(tokenCount, _uri);

          emit Minted(msg.sender, tokenCount);  // Emit the event
        return tokenCount;
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
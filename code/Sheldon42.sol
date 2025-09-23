// contracts/Sheldon42.sol
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";

contract Sheldon42 is ERC721URIStorage, Ownable {
    uint256 private _tokenIds;

    constructor() ERC721("Sheldon42", "SHL") Ownable(msg.sender) {}

    // publish the NFT
    function mintNFT(address ownner, string memory tokenURI) public onlyOwner returns (uint256) {
        uint256 newTokenId = _tokenIds;
        _mint(ownner, newTokenId);
        _setTokenURI(newTokenId, tokenURI);

        _tokenIds++;
        return newTokenId;
    }
}
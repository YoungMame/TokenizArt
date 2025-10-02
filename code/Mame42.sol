// contracts/Mame42.sol
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/utils/Strings.sol";
import "hardhat/console.sol";

// Mame42 is a unique token smart contract
contract Mame42 is ERC721URIStorage, Ownable {
    uint256 public  price = 0 ether;
    bool private    _isMinted = false;
    uint256         priceChangeTimestamp = 0;
    string private _baseTokenURI;

    constructor(string memory uri, uint256 newPrice) ERC721("Mame42", "MAM") Ownable(msg.sender) {
        _setPrice(newPrice);
        _baseTokenURI = uri;
    }

    // Overriding NFT URI prefix with base64 data prefix instead of ipfs base address
    function _baseURI() internal view override returns (string memory) {
        return _baseTokenURI;
    }

    function tokenURI(uint256 tokenId) public view override virtual returns (string memory) {
        string memory baseURI = _baseURI();
        return bytes(baseURI).length > 0 ? string(abi.encodePacked(baseURI, Strings.toString(tokenId), ".json")) : "";
    }

    // Event emited on price change by user
    event PriceSet(address author, uint256 newPrice);

    // Event emitted on nft minting
    event NftMinted(address newOwner, uint256 sellPrice);

    function isSold() public view returns (bool) {
        return _isMinted;
    }

    function _setPrice(uint256 newPrice) private {
        price = newPrice;
    }

    function setPrice(uint256 newPrice) public onlyOwner {
        _setPrice(newPrice);
        emit PriceSet(msg.sender, newPrice);
    }

    // buy and mint the NFT
    function mintNFT() public payable returns (uint256) {
        require(_isMinted == false, "NFT already minted");
        require(msg.value >= price, "Insufficient payment");
        _mint(msg.sender, 1);
        

        _isMinted = true;
        emit NftMinted(msg.sender, price);
        return 1;
    }
}

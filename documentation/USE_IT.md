## Functions

isSold(): This functions return true if the NFT has already been minted.

setPrice(uint256 newPrice): This function allows the owner of the contract to set a new price for the NFT. It emits a PriceSet event.

mintNFT(): This function allows a user to mint the NFT by paying the specified price. It checks if the NFT has already been minted and if the payment is sufficient. If successful, it mints the NFT to the caller's address, marks it as minted, and emits an NftMinted event.

## Events to listen to

event PriceSet(address author, uint256 newPrice);

event NftMinted(address newOwner, uint256 sellPrice);
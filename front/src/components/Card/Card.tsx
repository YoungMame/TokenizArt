import React, { useEffect, useState } from 'react';
import "../../css/Card/Card.css"
import { useWeb3 } from "../../context/Web3Contex";

function Card()  {
  const [price, setPrice] = useState<number | string>("Loading...");
  const [name, setName] = useState<string>("Loading...");
  const [description, setDescription] = useState<string>("Loading...");
  const [isSold, setIsSold] = useState<boolean>(false);
  const [artist, setArtist] = useState<string>("Loading...");
  const [base64Img, setBase64Img] = useState<string>("");
  const { web3, connectedAccount, contract } = useWeb3();

  // buy and mint the NFT, send transaction to contract
  const mintNFT = async () => {
    const txRes = await contract.methods.mintNFT().send({ from: connectedAccount });
    console.log(txRes);
  }

  const fetchNFTIsSold = async () => {
      const resIsSold = await contract.methods.isSold().call();
      console.log("isSold:", resIsSold);
      setIsSold(resIsSold);
  }

  const fetchNFTMetadata = async () => {
      const resMetadata64 = await contract.methods.tokenMetadata().call();
      console.log("Metadata (base64):", resMetadata64);
      // const resMetadataJson = new Buffer(resMetadata64, 'base64').toString('ascii').replace('data:application/json;base64,', '');
      const resMetadataJson = atob(resMetadata64.replace('data:application/json;base64,', ''));
      const resMetadataObject = JSON.parse(resMetadataJson);
      console.log("Metadata object:", resMetadataObject);
      setName(resMetadataObject.name);
      setDescription(resMetadataObject.description);
      setArtist(resMetadataObject.artist);
      setBase64Img(resMetadataObject.image);
      console.log("base64Img:", resMetadataObject.image);
  }

  const fetchNFTPrice = async () => {
      const resPrice = await contract.methods.price().call();
      console.log("Price (in wei):", resPrice);
      const priceInAvax = web3.utils.fromWei(resPrice, 'ether');
      console.log("Price (in AVAX):", priceInAvax);
      setPrice(priceInAvax);
  }

  useEffect(() => {
    if (contract) {
      fetchNFTPrice();
      fetchNFTMetadata();
      fetchNFTIsSold();
    }
  }, [contract])

  return (
    <>
      <div className="card">
        {/* image src is something like /image.png */}
        <div className="card-content">
          <img src={(base64Img == "" ) ? null : base64Img} />
          <h2>{name}</h2>
          <h3>{description}</h3>
        </div>
        <button onClick={mintNFT}>{`Buy it for: ${price} AVAX`}</button>
      </div>
    </>
  )
}

export default Card;
import { useEffect, useState } from 'react';
import "../../css/Card/Card.css"
import { useWeb3 } from "../../context/Web3Contex";

interface CardProps {
  price: number;
  name: string;
  description: string;
  image: string;
}

function Card({ price: initialPrice, name: initialName, description: initialDescription, image }: CardProps)  {
  const [price, setPrice] = useState<number | string>(initialPrice);
  const [name, setName] = useState<string>(initialName);
  const [description, setDescription] = useState<string>(initialDescription);
  const [isSold, setIsSold] = useState<boolean>(false);
  const [artist, setArtist] = useState<string>("Loading...");
  const [base64Img, setBase64Img] = useState<string>("");
  const [owner, setOwner] = useState<string | null>(null);
  const { web3, connectedAccount, contract } = useWeb3();

  // buy and mint the NFT, send transaction to contract
  const mintNFT = async () => {
    try {
      const txRes = await contract?.methods.mintNFT().send({ from: connectedAccount, value: web3?.utils.toWei(price.toString(), 'ether') });
      alert(`Transaction successful: ${txRes?.transactionHash}`);
    } catch (error) {
      alert(`There was an error buying nft: ${(error as Error).message || error}`);
    }

  }

  const fetchNFTIsSold = async () => {
      if (contract) {
        const resIsSold = await contract.methods.isSold().call();
        console.log("isSold:", resIsSold);
        setIsSold(Boolean(resIsSold));
      }
  }

  const fetchNFTMetadata = async () => {
      if (contract) {
        const resMetadata64 = await contract.methods.tokenMetadata().call();
        console.log("Metadata (base64):", resMetadata64);
        const resMetadataJson = atob(String(resMetadata64).replace('data:application/json;base64,', ''));
        const resMetadataObject = JSON.parse(resMetadataJson);
        console.log("Metadata object:", resMetadataObject);
        setName(resMetadataObject.name);
        setDescription(resMetadataObject.description);
        setArtist(resMetadataObject.artist);
        setBase64Img(resMetadataObject.image);
        console.log("base64Img:", resMetadataObject.image);
      }
  }

  const fetchNFTPrice = async () => {
      if (contract && web3) {
        const resPrice = await contract.methods.price().call();
        console.log("Price (in wei):", resPrice);
        const priceInAvax = web3.utils.fromWei(String(resPrice), 'ether');
        console.log("Price (in AVAX):", priceInAvax);
        setPrice(priceInAvax);
      }
  }

  const fetchNFTOwner = async () => {
      if (contract) {
        const resOwner = await contract.methods.ownerOf(1).call();
        setOwner(String(resOwner));
      }
  }

  useEffect(() => {
    if (contract) {
      fetchNFTPrice();
      fetchNFTMetadata();
      fetchNFTIsSold();
    }
  }, [contract])

  useEffect(() => {
    if (contract && !isSold) {
      const interval = setInterval(() => {
        fetchNFTIsSold();
      }, 2000);
      return () => clearInterval(interval);
    } else if (isSold) {
      fetchNFTOwner();
    }
  }, [contract, isSold])

  return (
    <>
      <div className="card">
        <h5>{contract ? (contract as any)._address : ""}</h5>
        <div>{`metadata {`}</div>
        <div className="card-content">
          <p>image: </p>
          <img src={(base64Img == "" ) ? image : base64Img} />
          <p>name: <strong>{name}</strong></p>
          <p>description: <strong>{description}</strong></p>
          <p>artist: <strong>{artist}</strong></p>
        </div>
        <div>{`}`}</div>
        <button onClick={mintNFT} disabled={isSold || price === "Loading..."}>{isSold ? `Owned by ${owner}` : `Buy it for: ${price} AVAX`}</button>
      </div>
    </>
  )
}

export default Card;
import React, { useEffect, useState } from 'react';
import "../../css/Card/Card.css"
import { useWeb3 } from "../../context/Web3Contex";

type CardProps = {
  name: string;
  description: string;
  image: string;
  author: string;
};

function Card({ name, image, description, author }: React.FC<CardProps>)  {
  const [gasPrice, setGasPrice] = useState<number | string>("Calculating...");
  const [base64Img, setBase64Img] = useState<string>("");
  const { web3, setAccounts, setConnectedAccount, provider, connectedAccount, contract } = useWeb3();
  
  const mintNFT = () => {

    alert(`Minting NFT with ID: ${name}`);
  }

  const getTokenURI = () => {
    const tokenURI = {
      name: name,
      description: description,
      author: author,
      image: base64Img
    }
    const encoded = btoa(JSON.stringify(tokenURI));
    return encoded;
  }

  const fetchMintFees = async () => {
      const resTokenURI = getTokenURI();
      console.log("resTokenURI", resTokenURI);
      const resGas = await contract.methods.mintNFT(connectedAccount, resTokenURI).estimateGas({ from: connectedAccount });
      const gasPrice = await web3.eth.getGasPrice();
      const txPriceInWei = (resGas * gasPrice);
      const txPriceInEth = web3.utils.fromWei(txPriceInWei.toString(), 'ether');
      const txPriceFixed = Number(txPriceInEth).toPrecision(5);
      setGasPrice(txPriceFixed);
  }

  useEffect(() => {
    if (contract)
      fetchMintFees();
  }, [contract])

  useEffect(() => {
    fetch(image)
      .then(response => response.text())
      .then(base64 => {
        setBase64Img(`data:image/jpg;base64,${base64}`);
      });
  }, []);

  return (
    <>
      <div className="card" onClick={mintNFT}>
        {/* image src is something like /image.png */}
        <img src={(base64Img == "" ) ? null : base64Img} />
        <h2>{name}</h2>
        <h3>{description}</h3>
        <button>{"Mint it for: " + gasPrice + "AVAX"}</button>
      </div>
    </>
  )
}

export default Card;
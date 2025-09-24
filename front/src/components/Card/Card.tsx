import React, { useEffect, useState } from 'react';
import "../../css/Card/Card.css"
import { useWeb3 } from "../../context/Web3Contex";
import fs from "fs"
import path from "path"




type CardProps = {
  name: string;
  description: string;
  image: string;
};

function Card({ name, image, description }: React.FC<CardProps>)  {
  const [gasPrice, setGasPrice] = useState<number | string>("Calculating...")
  const { web3, setAccounts, setConnectedAccount, provider, connectedAccount, contract } = useWeb3();
  
  const mintNFT = () => {

    alert(`Minting NFT with ID: ${nftId}`);
  }

  const getTokenURI = () => {
    const tokenURI = {
      name: name,
      description: description,
    }
    // const mintPath = path.join(__dirname, '../mint/');
    // const imageName = 'image.jpg';
    // const fullImagePath = path.join(mintPath, imageName);

    // const imageData = fs.readFileSync(fullImagePath);
    // const base64Image = imageData.toString('base64');
    // const base64Prefix = 'data:image/png;base64,';
    // const tokenImageURI = base64Prefix + base64Image;
    // console.log(`Token URI: ${tokenImageURI.substring(0, 30)}...`);
    // const encodedTokenURI = Buffer.from(JSON.stringify(tokenURI)).toString('base64');
  }

  const fetchMintFees = async () => {
      const resTokenURI = getTokenURI();
      const resGas = await contract.methods.mintNFT(connectedAccount, resTokenURI).estimateGas({ from: connectedAccount });
      setGasPrice(resGas);
  }

  useEffect(() => {
    if (contract)
      fetchMintFees();
  }, [contract])

  return (
    <>
      <div className="card" onClick={mintNFT}>
        {/* image src is something like /image.png */}
        <img src={imgSrc} />
        <h2>{title}</h2>
        <h3>{nftId}</h3>
        <button>{"Mint it for: " + gasPrice}</button>
      </div>
    </>
  )
}

export default Card;
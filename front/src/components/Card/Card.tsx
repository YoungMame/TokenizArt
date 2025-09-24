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
  const [currentBalance, setCurrentBalance] = useState<string>("0");
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
      const txPriceInWei = resGas * gasPrice;
      const txPriceInEth = web3.utils.fromWei(txPriceInWei.toString(), 'ether');
      setGasPrice(txPriceInEth);
  }

  useEffect(() => {
    if (contract)
      fetchMintFees();
  }, [contract])

  const fetchBalance = async () => {
    if (web3 && connectedAccount) {
      const balanceWei = await web3.eth.getBalance(connectedAccount);
      const balanceEth = web3.utils.fromWei(balanceWei, 'ether');
      setCurrentBalance(web3.utils.fromWei(balanceEth.toString(), 'ether'));
    }
  }

  useEffect(() => {
    fetchBalance();
  }, [web3, connectedAccount]);

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
        <button>{"Mint it for: " + gasPrice + "ETH"}</button>
        <strong>{`Your current balance is: ${currentBalance} ETH`}</strong>
      </div>
    </>
  )
}

export default Card;
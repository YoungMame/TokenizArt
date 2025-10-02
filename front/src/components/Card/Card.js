import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useEffect, useState } from 'react';
import "../../css/Card/Card.css";
import { useWeb3 } from "../../context/Web3Contex";
function Card({ price: initialPrice }) {
    const [price, setPrice] = useState(initialPrice);
    const [isSold, setIsSold] = useState(false);
    const [owner, setOwner] = useState(null);
    const { web3, connectedAccount, contract } = useWeb3();
    // buy and mint the NFT, send transaction to contract
    const mintNFT = async () => {
        try {
            const txRes = await contract?.methods.mintNFT().send({ from: connectedAccount, value: web3?.utils.toWei(price.toString(), 'ether') });
            alert(`Transaction successful: ${txRes?.transactionHash}`);
        }
        catch (error) {
            alert(`There was an error buying nft: ${error.message || error}`);
        }
    };
    const fetchNFTIsSold = async () => {
        if (contract) {
            const resIsSold = await contract.methods.isSold().call();
            console.log("isSold:", resIsSold);
            setIsSold(Boolean(resIsSold));
        }
    };
    const fetchNFTPrice = async () => {
        if (contract && web3) {
            const resPrice = await contract.methods.price().call();
            console.log("Price (in wei):", resPrice);
            const priceInAvax = web3.utils.fromWei(String(resPrice), 'ether');
            console.log("Price (in AVAX):", priceInAvax);
            setPrice(priceInAvax);
        }
    };
    const fetchNFTOwner = async () => {
        if (contract) {
            const resOwner = await contract.methods.ownerOf(1).call();
            setOwner(String(resOwner));
        }
    };
    useEffect(() => {
        if (contract) {
            fetchNFTPrice();
            fetchNFTIsSold();
        }
    }, [contract]);
    useEffect(() => {
        if (contract && !isSold) {
            const interval = setInterval(() => {
                fetchNFTIsSold();
            }, 2000);
            return () => clearInterval(interval);
        }
        else if (isSold) {
            fetchNFTOwner();
        }
    }, [contract, isSold]);
    return (_jsx(_Fragment, { children: _jsxs("div", { className: "card", children: [_jsx("h5", { children: contract ? contract._address : "" }), _jsx("button", { onClick: mintNFT, disabled: isSold || price === "Loading...", children: isSold ? `Owned by ${owner}` : `Buy it for: ${price} AVAX` })] }) }));
}
export default Card;

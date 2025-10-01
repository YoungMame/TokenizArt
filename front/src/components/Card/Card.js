import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useEffect, useState } from 'react';
import "../../css/Card/Card.css";
import { useWeb3 } from "../../context/Web3Contex";
function Card({ price: initialPrice, name: initialName, description: initialDescription, image }) {
    const [price, setPrice] = useState(initialPrice);
    const [name, setName] = useState(initialName);
    const [description, setDescription] = useState(initialDescription);
    const [isSold, setIsSold] = useState(false);
    const [artist, setArtist] = useState("Loading...");
    const [base64Img, setBase64Img] = useState("");
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
            fetchNFTMetadata();
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
    return (_jsx(_Fragment, { children: _jsxs("div", { className: "card", children: [_jsx("h5", { children: contract ? contract._address : "" }), _jsx("div", { children: `metadata {` }), _jsxs("div", { className: "card-content", children: [_jsx("p", { children: "image: " }), _jsx("img", { src: (base64Img == "") ? image : base64Img }), _jsxs("p", { children: ["name: ", _jsx("strong", { children: name })] }), _jsxs("p", { children: ["description: ", _jsx("strong", { children: description })] }), _jsxs("p", { children: ["artist: ", _jsx("strong", { children: artist })] })] }), _jsx("div", { children: `}` }), _jsx("button", { onClick: mintNFT, disabled: isSold || price === "Loading...", children: isSold ? `Owned by ${owner}` : `Buy it for: ${price} AVAX` })] }) }));
}
export default Card;

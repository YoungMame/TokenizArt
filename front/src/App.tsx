import { useState, useEffect } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './css/App.css'
import Navbar from './components/Navbar/Navbar'
import Card from './components/Card/Card'

import { Web3, MetaMaskProvider, Contract } from 'web3';
import tokenJson from '../contracts/Token.json';
import contractAddress from '../contracts/contract-address.json';

import { Web3Context } from './context/Web3Contex';

const abi = tokenJson.abi;
const address = contractAddress.address;


const nftCollection = [
  {
    name: "Sheldon42 #1",
    description: "The first Sheldon42 NFT",
    image: "/sheldon.jpg",
  }
]

declare global {
	interface Window {
		ethereum: MetaMaskProvider;
	}
}

function App() {
  const [web3, setWeb3] = useState<Web3 | null>(null);
  const [accounts, setAccounts] = useState<string[]>([]);
  const [connectedAccount, setConnectedAccount] = useState<string | null>(null);
  const [contract, setContract] = useState<Contract | null>(null)

  const fetchMetamaskAccounts = async () => {
    if (web3 === null) {
      console.log("dont fetch metamask account because of web3 nul")
      return;
    }
    const allAccounts = await web3.eth.getAccounts();
    if (allAccounts[0])
    {
      setAccounts(allAccounts);
      setConnectedAccount(allAccounts[0]);	
    }
	}

  const setNewContract = async () => {
    console.log("setNewContract called", abi, address)
    const tempContract = await new web3.eth.Contract(abi, address);
    setContract(tempContract);
  }

	useEffect(() => {
		// ensure that there is an injected the Ethereum provider
		if (window.ethereum) {
			// use the injected Ethereum provider to initialize Web3.js
			setWeb3(new Web3(window.ethereum));
			// check if Ethereum provider comes from MetaMask
			if (window.ethereum.isMetaMask) {
				// setProvider('Connected to Ethereum with MetaMask.');
			} else {
				// setProvider('Non-MetaMask Ethereum provider detected.');
			}
		} else {
			// setWarning('Please install MetaMask');
		}
	}, []);

  useEffect(() => {
    if (web3) 
      fetchMetamaskAccounts();
  }, [web3])

  useEffect(() => {
    if (connectedAccount && web3)
      setNewContract();
  }, [connectedAccount, web3])

  return (
    <>
      <Web3Context.Provider value={{
        web3: web3,
        setWeb3: setWeb3,
        accounts: accounts,
        setAccounts: setAccounts,
        connectedAccount: connectedAccount,
        setConnectedAccount: setConnectedAccount,
        contract: contract,
        setContract: setContract
      }}>

        <Navbar />
        <div className="nft-collection">
          {nftCollection.map((nft, key) => (
            <Card key={key} description={nft.description} name={nft.name} image={nft.image} />
          ))}
        </div>
      </Web3Context.Provider>
    </>
  )
}

export default App

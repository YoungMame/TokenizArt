import { useState, useEffect } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './css/App.css'
import Navbar from './components/Navbar/Navbar'
import Card from './components/Card/Card'

import { Web3, MetaMaskProvider } from 'web3';
import tokenJson from '../contracts/Token.json';
import contractAddress from '../contracts/contract-address.json';

import { useWeb3 } from './context/Web3Contex';

const abi = tokenJson.abi;
const address = contractAddress.address;

const nftCollection = [
  {
    id: 1,
    name: 'NFT 1',
    image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRvo7yyAUYBGZ0h6K5Ib2zckPhO0B1oFpNkcw&s',
  },
]


declare global {
	interface Window {
		ethereum: MetaMaskProvider;
	}
}


function App() {
  const web3Context = useWeb3();
  const [web3, setWeb3] = useState<Web3 | null>(null);
  const [accounts, setAccounts] = useState<string[]>([]);
  const [connectedAccount, setConnectedAccount] = useState<string | null>(null);
	const [warning, setWarning] = useState<string | null>(null);
	const [provider, setProvider] = useState<string | null>(null);

	useEffect(() => {
		// ensure that there is an injected the Ethereum provider
		if (window.ethereum) {
			// use the injected Ethereum provider to initialize Web3.js
			setWeb3(new Web3(window.ethereum));
			// check if Ethereum provider comes from MetaMask
			if (window.ethereum.isMetaMask) {
				setProvider('Connected to Ethereum with MetaMask.');
			} else {
				setProvider('Non-MetaMask Ethereum provider detected.');
			}
		} else {
			// no Ethereum provider - instruct user to install MetaMask
			setWarning('Please install MetaMask');
		}
	}, []);

  useEffect(() => {
    console.log('abi = ', abi);
    console.log('address = ', address);
  }, [])


  const mintNFT = (id: number) => {
    alert(`Minting NFT with ID: ${id}`);
  }

  return (
    <>
      <web3Context.Provider value={{
        web3: web3,
        setWeb3: setWeb3,
        accounts: accounts,
        setAccounts: setAccounts,
        connectedAccount: connectedAccount,
        setConnectedAccount: setConnectedAccount,
      }}>
        {warning ? <p>{warning}</p> : null}
        {provider ? <p>{provider}</p> : null}
        {connectedAccount && <span>{connectedAccount}</span>}

        <Navbar />
        <div className="nft-collection">
          {nftCollection.map((nft) => (
            <Card onClick={() => mintNFT(nft.id)} key={nft.id} title={nft.name} imgSrc={nft.image} />
          ))}
        </div>
      </web3Context.Provider>
    </>
  )
}

export default App

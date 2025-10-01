import { useState, useEffect } from 'react'
import './css/App.css'
import Navbar from './components/Navbar/Navbar'
import Card from './components/Card/Card'

import { Web3, Contract } from 'web3';
import type { MetaMaskProvider } from 'web3';
import tokenJson from '../contracts/Token.json';
import contractAddress from '../contracts/contract-address.json';

import { Web3Context } from './context/Web3Contex';

const abi = tokenJson.abi;
const address = contractAddress.address;


const nftCollection = [
  {
    name: "Mame42 #1",
    description: "The first Mame42 NFT",
    image: "/image",
    author: "mduvey",
    price: 0.2
  }
]

declare global {
	interface Window {
		ethereum: MetaMaskProvider<Web3>;
	}
}

function App() {
  const [web3, setWeb3] = useState<Web3 | null>(null);
  const [accounts, setAccounts] = useState<string[]>([]);
  const [connectedAccount, setConnectedAccount] = useState<string | null>(null);
  const [contract, setContract] = useState<Contract<any> | null>(null);
  const [currentChainId, setCurrentChainId] = useState<number | null>(null);
  const [currentBalance, setCurrentBalance] = useState<string | null>(null);

  const chainId = (import.meta.env.VITE_ENV == "dev") ? 1337 : 43113; // avalanche testnet chain id or hardhat if env is "dev"
  const chainName = (import.meta.env.VITE_ENV == "dev") ? "Hardhat" : "Avalanche Fuji Testnet"
  const rpcURL = (import.meta.env.VITE_ENV == "dev") ? "http://127.0.0.1:8545/" : " https://api.avax-test.network/ext/bc/c/rpc"
  const nativeCurrency = (import.meta.env.VITE_ENV == "dev") ? { name: "Ethereum", decimals: 18, symbol: "ETH" } : { name: "AVAX", decimals: 18, symbol: "AVAX" }

  const setProperNetwork = async () => {
    const currentChainId = await window.ethereum.request({ method: 'eth_chainId' }) as string;
    if (parseInt(currentChainId, 16) !== chainId) {
      try {
        await window.ethereum.request({
          method: 'wallet_switchEthereumChain',
          params: [{ chainId: web3.utils.toHex(chainId) }]
        });
      } catch (err: any) {
          // This error code indicates that the chain has not been added to MetaMask
        if (err.code === 4902) {
          await window.ethereum.request({
            method: 'wallet_addEthereumChain',
            params: [
              {
                chainName: chainName,
                chainId: web3.utils.toHex(chainId),
                nativeCurrency: nativeCurrency,
                rpcUrls: [rpcURL]
              }
            ]
          });
        }
      }
    }
  }

  window.ethereum.on('accountsChanged', function (accounts) {
    console.log("accountsChanged", accounts);
    // Ici, tu peux réinitialiser web3 avec le nouveau compte si besoin
    setConnectedAccount(accounts[0]);
    setProperNetwork();
    // Faire d'autres actions...
  });

  const fetchMetamaskAccounts = async () => {
    if (web3 === null) {
      return;
    }
    const allAccounts = await web3.eth.getAccounts();
    console.log("Before allAccounts")
    if (!allAccounts[0])
      return ;
    setAccounts(allAccounts);
    setConnectedAccount(allAccounts[0]);
    setProperNetwork();
	}

  const setNewContract = async () => {
    console.log("setNewContract called", abi, address)
    const tempContract = await new web3.eth.Contract(abi, address);
    setContract(tempContract);
  }

  const fetchBalanceAndChainID = async () => {
    const resChainId = await web3.eth.getChainId();
    setCurrentChainId(Number(resChainId));
    console.log(connectedAccount)
    const balanceWei = await web3.eth.getBalance(connectedAccount);
    const balanceEth = web3.utils.fromWei(balanceWei, 'ether');
    const balanceFixed = Number(balanceEth).toFixed(5);
    setCurrentBalance(balanceFixed.toString());
  }

	useEffect(() => {
		// ensure that there is an injected the Ethereum provider
		if (window.ethereum) {
			// use the injected Ethereum provider to initialize Web3.js
			setWeb3(new Web3(window.ethereum as any));
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
    {
      setNewContract();
      fetchBalanceAndChainID();
    }
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
        <p>Your current balance is <strong>{(currentBalance) ? currentBalance : "..."}</strong>AVAX</p>
        <p>Your current Network is <strong>{(currentChainId) ? currentChainId : "..."}</strong></p>
        <div className="nft-collection">
          {nftCollection.map((nft, key) => (
            <Card price={nft.price} key={key} description={nft.description} name={nft.name} image={nft.image} />
          ))}
        </div>
      </Web3Context.Provider>
    </>
  )
}

export default App

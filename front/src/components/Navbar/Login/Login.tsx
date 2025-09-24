import React from 'react'
import { useWeb3 } from "../../../context/Web3Contex";

function Login() {
  const { web3, setAccounts, setConnectedAccount } = useWeb3();

  async function requestAccounts() {
		if (web3 === null) {
			return;
		}

		// request accounts from MetaMask
		await window.ethereum.request({ method: 'eth_requestAccounts' });
		document.getElementById('requestAccounts')?.remove();

		// get list of accounts
		const allAccounts = await web3.eth.getAccounts();
		setAccounts(allAccounts);
		// get the first account and populate placeholder
		setConnectedAccount(`Account: ${allAccounts[0]}`);
	}
  return (
    <>
        <button onClick={requestAccounts}>
            Login with Metamask
        </button>

    </>
  )
}

export default Login
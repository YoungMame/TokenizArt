import React, { useEffect } from 'react'
import { useWeb3 } from "../../../context/Web3Contex";
import "../../../css/Navbar/Login/Login.css"

function Login() {
	const { web3, setAccounts, setConnectedAccount, connectedAccount } = useWeb3();

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
			setConnectedAccount(allAccounts[0]);
		}

	return (
		<>
			<button onClick={requestAccounts} >
				{connectedAccount ? `Connected with ${connectedAccount}` : "Login with Metamask"}
			</button>

		</>
	)
}

export default Login
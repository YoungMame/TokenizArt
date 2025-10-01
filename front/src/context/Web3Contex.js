import React, { createContext, useContext } from 'react';
import { Web3, Contract } from 'web3';
export const Web3Context = createContext({
    web3: null,
    setWeb3: () => { },
    accounts: [],
    setAccounts: () => { },
    connectedAccount: null,
    setConnectedAccount: () => { },
    contract: null,
    setContract: () => { }
});
export const useWeb3 = () => useContext(Web3Context);

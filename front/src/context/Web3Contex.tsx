import React, { createContext, useContext } from 'react';
import { Web3, Contract } from 'web3';

type Web3ContextType = {
  web3: Web3 | null;
  setWeb3: React.Dispatch<React.SetStateAction<Web3 | null>>;
  accounts: string[];
  setAccounts: React.Dispatch<React.SetStateAction<string[]>>;
  connectedAccount: string | null;
  setConnectedAccount: React.Dispatch<React.SetStateAction<string | null>>;
  contract: Contract | null;
  setContract: React.Dispatch<React.SetStateAction<Contract | null>>;
};

export const Web3Context = createContext<Web3ContextType>({
  web3: null,
  setWeb3: () => {},
  accounts: [],
  setAccounts: () => {},
  connectedAccount: null,
  setConnectedAccount: () => {},
  contract: null,
  setContract: () => {}
});

export const useWeb3 = () => useContext(Web3Context);
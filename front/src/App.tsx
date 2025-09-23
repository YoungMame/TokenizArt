import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './css/App.css'
import Navbar from './components/Navbar/Navbar'
import Card from './components/Card/Card'

const nftCollection = [
  {
    id: 1,
    name: 'NFT 1',
    image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRvo7yyAUYBGZ0h6K5Ib2zckPhO0B1oFpNkcw&s',
  },
]

function App() {

  const mintNFT = (id: number) => {
    alert(`Minting NFT with ID: ${id}`);
  }

  return (
    <>
      <div>
        <Navbar />
        <div className="nft-collection">
          {nftCollection.map((nft) => (
            <Card onClick={() => mintNFT(nft.id)} key={nft.id} title={nft.name} imgSrc={nft.image} />
          ))}
        </div>
      </div>
    </>
  )
}

export default App

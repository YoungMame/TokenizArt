import Login from './Login/Login'
import "../../css/Navbar/Navbar.css"
import { useWeb3 } from "../../context/Web3Contex";

function Navbar() {
  const { web3 } = useWeb3();
  
  return (
    <>
      <div className={"navbar"}>
        <h1>My NFT collection</h1>
        <div className={"navbar-buttons"}>
          {web3 ? <Login /> : <p>Please install Metamask etherum on your browser</p>}
        </div>
      </div>
    </>
  )
}

export default Navbar

import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import Login from './Login/Login';
import "../../css/Navbar/Navbar.css";
import { useWeb3 } from "../../context/Web3Contex";
function Navbar() {
    const { web3 } = useWeb3();
    return (_jsx(_Fragment, { children: _jsxs("div", { className: "navbar", children: [_jsx("h1", { children: "My NFT collection" }), _jsx("div", { className: "navbar-buttons", children: web3 ? _jsx(Login, {}) : _jsx("p", { children: "Please install Metamask etherum on your browser" }) })] }) }));
}
export default Navbar;

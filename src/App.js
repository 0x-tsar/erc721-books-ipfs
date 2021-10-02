import "./App.css";
import { useState, useEffect } from "react";
import Web3 from "web3";
import Books from "./contracts/Books.json";

function App() {
  const [info, setInfo] = useState({
    bookContract: "",
    currentAddress: "",
    currentNetwork: "",
  });

  useEffect(() => {
    const loadingNetwork = async () => {
      if (window.ethereum !== "undefined") {
        const web3 = new Web3(window.ethereum);
        const account = await web3.eth.getAccounts();
        const netId = await web3.eth.net.getId();

        const bookContract = new web3.eth.Contract(
          Books.abi,
          Books.networks[netId].address
        );

        console.log(bookContract);

        setInfo((info) => ({
          ...info,
          bookContract: bookContract,
          currentAddress: account[0],
          currentNetwork: netId,
        }));
      } else {
        alert("metamask not installed");
      }
    };

    loadingNetwork();
  }, []);

  return <div className="App"></div>;
}

export default App;

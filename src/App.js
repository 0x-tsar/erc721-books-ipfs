import "./App.css";
import { useState, useEffect, useRef } from "react";
import Web3 from "web3";
import Books from "./contracts/Books.json";

function App() {
  const [info, setInfo] = useState({
    bookContract: null,
    currentAddress: "",
    currentNetwork: "",
  });

  const [data, setData] = useState([]);

  useEffect(() => {
    const loadingNetwork = async () => {
      if (window.ethereum !== "undefined") {
        //crucial for getting this account
        window.ethereum.enable();
        const web3 = await new Web3(window.ethereum);
        const account = await web3.eth.getAccounts();
        // console.log(account);
        const netId = await web3.eth.net.getId();

        const bookContract = await new web3.eth.Contract(
          Books.abi,
          Books.networks[netId].address
        );

        setInfo((info) => ({
          ...info,
          bookContract: bookContract,
          currentAddress: account[0],
          currentNetwork: netId,
        }));

        // const contractBalance = await info.bookContract.methods.balanceOf(
        //   info.bookContract.address
        // );

        // const t = await info.bookContract.tokenOfOwnerByIndex(
        //   info.bookContract.address
        // );

        //tokenOfOwnerByIndex(owner, index);
        // 2 token by index (addr, uint)
        // 3 tokenUri(uint)
      } else {
        alert("metamask not installed");
      }
    };

    loadingNetwork();
  }, []);

  useEffect(() => {
    const done = async () => {
      try {
        const contractAddress = info.bookContract._address;
        const contractBalance = await info.bookContract.methods
          .balanceOf(contractAddress)
          .call();

        console.log(contractBalance);

        //getting all ids from address
        for (let i = 0; i < contractBalance; i++) {
          let tokenId = await info.bookContract.methods
            .tokenOfOwnerByIndex(contractAddress, i)
            .call();

          let token = await info.bookContract.methods
            .tokenByIndex(tokenId)
            .call();

          // mapping(address => mapping(uint256 => BookStruct)) public booksByOwner;
          const tokenURI = await info.bookContract.methods
            .tokenURI(token)
            .call();

          const metadata = await info.bookContract.methods
            .booksByOwner(contractAddress, tokenId)
            .call();
          console.log(metadata);

          console.log(tokenURI);
        }

        // console.log(contractAddress);
        // const t = await info.bookContract.tokenOfOwnerByIndex(
      } catch (error) {
        // console.error(error);
      }
    };
    done();
  }, [info]);

  // const [state, setState] = useState({ name: "" });
  // const isFirstRender = useRef(true);
  // useEffect(() => {
  //   if (isFirstRender.current) {
  //     isFirstRender.current = false; // toggle flag after first render/mounting
  //     return;
  //   }
  //   console.log(state); // do something after state has updated
  // }, [state]);

  // useEffect(() => {
  //   const done = async () => {

  //     // const contractBalance = await info.bookContract.methods.balanceOf(
  //     //   info.bookContract.address
  //     // );

  //     // const t = await info.bookContract.tokenOfOwnerByIndex(
  //     //   info.bookContract.address
  //     // );

  //     //tokenOfOwnerByIndex(owner, index);
  //     // 2 token by index (addr, uint)
  //     // 3 tokenUri(uint)
  //   };
  //   done();
  // }, [info]);

  return (
    <div className="App">
      <button
        onClick={async () => {
          // const value = Web3.utils.toWei("0.001");
          // console.log(parseInt(value));
          // console.log(info.currentAddress);
          // console.log(info.bookContract);
          // const tx = await info.bookContract.methods
          //   .createNewBook("book 2", value)
          //   .send({ from: info.currentAddress });
          // console.log(tx);
          // const tx = await info.bookContract.methods
          // .createNewBook("book 1", 1 * 10 * 16)
          // .send({ from: info.currentAddress });
          // console.log(tx);
          // try {
          //   await contracts.bank.methods
          //     .deposit()
          //     .send({ value: amount.toString(), from: currentUser });
          // } catch (e) {
          //   console.log("Error, deposit: ", e);
          // }
        }}
      >
        Create new book
      </button>
    </div>
  );
}

export default App;

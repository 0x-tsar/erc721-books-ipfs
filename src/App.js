import "./App.css";
import { useState, useEffect, useRef } from "react";
import Web3 from "web3";
import Books from "./contracts/Books.json";
import fleekStorage from "@fleekhq/fleek-storage-js";

function App() {
  const [info, setInfo] = useState({
    bookContract: null,
    currentAddress: "",
    currentNetwork: "",
  });

  const [form, setForm] = useState({
    title: null,
    id: "",
    price: "",
    owner: "",
    url: "",
  });

  const [data, setData] = useState([]);

  const setStorage = async (e) => {
    const data = e.target.files[0];

    try {
      const uploadedFile = await fleekStorage.upload({
        apiKey: "+Gxl/Kv/k+cdc1W4dTyP4Q==",
        apiSecret: "+ldkPR3rw+7jp6j74Koi5/8JHHPD2zwx40uxekH1hEw=",
        key: data.name,
        data: data,
      });

      // const tx = await info.bookContract.methods
      //   .createNewBook("book 2", value, bookUrl)
      //   .send({ from: info.currentAddress });
      // console.log(tx);

      console.log(`picture was uploaded to IPFS`);
      console.log(uploadedFile);

      // setVideo(`https://ipfs.io/ipfs/${uploadedFile.hash}`);

      // const url = `https://ipfs.infura.io/ipfs/${added.path}`;
      // updateFileUrl(url);
      // console.log(`url ipfs: ${url}`);
    } catch (error) {
      console.log("Error uploading file: ", error);
    }
  };

  useEffect(() => {
    const loadingNetwork = async () => {
      if (window.ethereum !== "undefined") {
        setData([]);
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

        setData([]);

        //getting all ids from address
        for (let i = 0; i < contractBalance; i++) {
          let tokenId = await info.bookContract.methods
            .tokenOfOwnerByIndex(contractAddress, i)
            .call();

          let token = await info.bookContract.methods
            .tokenByIndex(tokenId)
            .call();

          const tokenURI = await info.bookContract.methods
            .tokenURI(token)
            .call();

          console.log(tokenURI);

          // const BASE_URI = await info.bookContract.methods._baseURI().call();
          // console.log(await info.bookContract.methods);

          const metadata = await info.bookContract.methods
            .booksByOwner(contractAddress, tokenId)
            .call();

          setData((data) => [...data, metadata]);

          // console.log(tokenURI);
        }
      } catch (error) {
        // console.error(error);
      }
    };
    done();
  }, [info]);

  return (
    <div className="App">
      <h1>Book Store</h1>

      <div>
        Add new Book to Chain and IPFS
        <br></br>
        <input type="file" onChange={setStorage} />
        <br></br>
        <br></br>
        <br></br>
      </div>

      <div>
        {data.map((item, key) => {
          return (
            <div key={key}>
              <div>{item.title}</div>
              <div>{item.price}</div>
              <div>{item.owner}</div>
              <img src={item.url} alt="book img" width="200" />
              <br></br>
            </div>
          );
        })}
      </div>

      <button
        onClick={async () => {
          // const value = Web3.utils.toWei("0.001");
          // console.log(parseInt(value));
          // console.log(info.currentAddress);
          // console.log(info.bookContract);
          // const bookUrl =
          // const tx = await info.bookContract.methods
          //   .createNewBook("book 2", value, bookUrl)
          //   .send({ from: info.currentAddress });
          // console.log(tx);
          // try {
          //   await contracts.bank.methods
          //     .deposit()
          //     .send({ value: amount.toString(), from: currentUser });
          // } catch (e) {
          //   console.log("Error, deposit: ", e);
          // }
          //
        }}
      >
        Create new book
      </button>
    </div>
  );
}

export default App;

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

  const [state, setState] = useState({
    title: "",
    price: "",
    url: "",
  });

  const handler = (e) => {
    setState({
      [e.target.name]: e.target.value,
    });
  };

  const submit = async (e) => {
    e.preventDefault();

    if (state.price !== "" && state.title !== "" && state.url !== "") {
      const tx = await info.bookContract.methods
        .createNewBook(state.title, state.price, state.url)
        .send({ from: info.currentAddress });
      console.log(tx);
      setData((data) => [...data, ""]);
    } else {
      console.log("url not loaded yet..");
    }
  };

  const getStorage = async (fileName) => {
    const myFile = await fleekStorage.get({
      apiKey: "+Gxl/Kv/k+cdc1W4dTyP4Q==",
      apiSecret: "+ldkPR3rw+7jp6j74Koi5/8JHHPD2zwx40uxekH1hEw=",
      key: fileName,
      getOptions: ["data", "bucket", "key", "hash", "publicUrl"],
    });

    return myFile;
  };

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
      setState({ ...state, url: uploadedFile.hash });
      //first try with IPFS later with Fleek
      // setState({ ...state, url: `https://ipfs.io/ipfs/${uploadedFile.hash}`});

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
      if (window.ethereum !== undefined) {
        //crucial for getting this account
        console.log(window.ethereum);
        window.ethereum.enable();
        const web3 = await new Web3(window.ethereum);

        const account = await web3.eth.getAccounts();
        const netId = await web3.eth.net.getId();
        console.log(netId);
        console.log(account);

        if (parseInt(window.ethereum.networkVersion) !== 42) {
          alert("change to kovan network!");
        }

        // detect Metamask account change
        window.ethereum.on("accountsChanged", function (accounts) {
          console.log("accountsChanges", accounts);
          window.location.reload();
        });

        // detect Network account change
        window.ethereum.on("networkChanged", function (networkId) {
          console.log("networkChanged", networkId);
          window.location.reload();
        });

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
        console.log("intall metamask");
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

          const urlToken = await info.bookContract.methods
            .tokenToUrl(token)
            .call();

          console.log("url", urlToken);

          // getStorage

          // const BASE_URI = await info.bookContract.methods._baseURI().call();
          // console.log(await info.bookContract.methods);

          const metadata = await info.bookContract.methods
            .booksByOwner(contractAddress, tokenId)
            .call();

          console.log(metadata);

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
        <br />
        <br />
        <form onSubmit={submit}>
          <input
            name="title"
            value={state.title}
            onChange={(e) => {
              setState({ ...state, title: e.target.value });
            }}
            placeholder="title"
          ></input>

          <input
            name="price"
            value={state.price}
            onChange={(e) => {
              setState({ ...state, price: e.target.value });
            }}
            // onChange={handler}
            placeholder="price"
          ></input>

          {/* <input
            name="isChecked"
            type="checkbox"
            value={this.state.isChecked}
            onChange={this.handler}
          ></input> */}

          {/* <select name="title" value={this.state.title} onChange={this.handler}>
            <option>Zero</option>
            <option>Um</option>
            <option>Dois</option>
            <option>Três</option>
          </select> */}

          <button type="submit">Submit</button>
        </form>
        {/* <form
          onSubmit={(e) => {
            e.preventDefault();
            console.log("ok");
          }}
        >
          <input placeholder="Book name"></input> <br></br>
          <input placeholder="Book price"></input> <br></br>
        </form> */}
        <br></br>
        <br />
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

              <div>
                <img
                  style={{
                    position: "absolute",
                    marginLeft: 80,
                    marginTop: 130,
                    zIndex: -1,
                  }}
                  src="https://c.tenor.com/5o2p0tH5LFQAAAAi/hug.gif"
                  width="40px"
                  height="40px"
                ></img>
                <img
                  style={{
                    minWidth: "200px",
                    minHeight: "300px",
                    background: "rgba(0, 0, 0, 0.3)",
                  }}
                  src={`https://ipfs.io/ipfs/${item.url}`}
                  placeholder
                  alt="book img"
                  width="200"
                />

                <br></br>
              </div>
            </div>
          );
        })}
      </div>

      {/* <button
        onClick={async () => {
          const value = Web3.utils.toWei("0.001");
          console.log(parseInt(value));
          console.log(info.currentAddress);
          console.log(info.bookContract);
          const bookUrl =
          const tx = await info.bookContract.methods
            .createNewBook("book 2", value, bookUrl)
            .send({ from: info.currentAddress });
          console.log(tx);
          try {
            await contracts.bank.methods
              .deposit()
              .send({ value: amount.toString(), from: currentUser });
          } catch (e) {
            console.log("Error, deposit: ", e);
          }
          
        }}
      >
        Create new book
      </button> */}
    </div>
  );
}

export default App;

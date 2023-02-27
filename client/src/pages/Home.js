import React, { useEffect, useState } from "react";
import { accountInfo, currentPriceOf } from "../utils/API";
import { ts } from "../utils/Date";

export default function Home() {
  //websocket subscribe to symbol and unsubscribe to last symbol
  const [Symbol, newSymbol] = useState("");
  const [LastSymbol, setLastSymbol] = useState(false);

  const [isLoading, setLoad] = useState(false);

  //each object recieved from ws message
  const [Ticker, setTicker] = useState(false);
  const [Price, setPrice] = useState(false);
  const [Volume, setVol] = useState(false);
  const [Time, setTime] = useState(false);

  const ws = new WebSocket("ws://localhost:8080");
  ws.onmessage = (event) => {
    const data = event.data;
    if (data.includes("price")) {
      setLoad(false);
      const stockData = JSON.parse(event.data);
      const Time = ts(stockData.Timestamp);
      setTicker(stockData.symbol);
      setPrice(stockData.price);
      setVol(stockData.volume);
      setTime(Time);
    }
    console.log(data);
  };

  //unsubscribe from last symbol and then Subscribe to latest input Symbol
  ws.onopen = () => {
    ws.send(
      JSON.stringify({
        type: "unsubscribe",
        symbol: `${LastSymbol}`,
        quote: true,
      })
    );

    ws.send(
      JSON.stringify({
        type: "subscribe",
        symbol: `${Symbol}`,
        quote: true,
      })
    );
  };

  //unsubscribe from current symbol on page refresh
  useEffect(() => {
    window.addEventListener(
      "beforeunload",
      (event) => {
        event.preventDefault();
        ws.send(
          JSON.stringify({
            type: "unsubscribe",
            symbol: `${Symbol}`,
            quote: true,
          })
        );
      },
      []
    );
  });

  //get account buying power and put it in data state
  const [data, setData] = useState(false);
  accountInfo().then((Data) => {
    if (data === false) {
      setData(Data);
    }
  });

  //when input is changed set newsymbol to its value
  const inputChange = (event) => {
    newSymbol(event.target.value.toUpperCase());
  };

  // const priceOf = () => {
  //   if (Symbol !== "") {
  //     currentPriceOf(Symbol).then((Data) => {
  //       if (Data) {
  //         setPrice(Data);
  //       }
  //     });

  //     const repeat = setInterval(async () => {
  //       try {
  //         currentPriceOf(Symbol).then((Data) => {
  //           if (Data) {
  //             setPrice(Data);
  //             console.log(Data);
  //           }
  //         });
  //       } catch (err) {
  //         console.error(err);
  //       }

  //       if (!nextSymbol) {
  //         clearInterval(repeat);
  //         console.log("ive been cleared");
  //       }
  //     }, 1000);
  //   }
  // };

  return (
    <div className="text-white">
      <h1>Home</h1>
      <h2>my buying power is {data ? data.buying_power : "...Loading"}</h2>
      <div>
        <form
          className="d-flex justify-content-center"
          onSubmit={(event) => {
            event.preventDefault();
          }}
        >
          <input
            id="ticker"
            placeholder="Enter Ticker"
            onChange={inputChange}
            required
          ></input>

          <button
            type="button"
            id="send"
            onClick={() => {
              const ticker = document.getElementById("ticker");
              setLastSymbol(ticker.value.toUpperCase());
              setLoad(!isLoading);
              console.log("button has been clicked");
              console.log(`current symbol: ${Symbol}`);
              console.log(`next symbol:${LastSymbol}`);
              ticker.value = "";
            }}
          >
            Search
          </button>
        </form>
        {isLoading ? (
          <div className="ticker-dash load">
            <h2>...Loading</h2>
          </div>
        ) : Ticker && Price && Volume && Time ? (
          <div className="ticker-dash full">
            <h2>{Ticker ? Ticker : "Ticker"}</h2>
            <ul>
              <li>Price: {`$${Price}`}</li>
              <li>Volume: {Volume}</li>
              <li>Last updated: {Time}</li>
            </ul>
          </div>
        ) : (
          <div className="ticker-dash none"></div>
        )}
      </div>
    </div>
  );
}

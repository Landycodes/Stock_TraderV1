import React, { useState } from "react";
import { accountInfo } from "../utils/API";

export default function Home() {
  const ws = new WebSocket("ws://localhost:8080");
  ws.onmessage = (event) => {
    const stockData = JSON.parse(event.data);
    setPrice(stockData.price);
    // console.log(stockData);
  };
  //unsubscribe from last symbol and then Subscribe to latest input Symbol
  const [Symbol, newSymbol] = useState("");
  const [LastSymbol, setLastSymbol] = useState("*");
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

  const [data, setData] = useState(false);
  accountInfo().then((Data) => {
    if (data === false) {
      setData(Data);
    }
  });
  const [livePrice, setPrice] = useState(false);

  return (
    <div>
      <h1>Home</h1>
      <h2>my buying power is {data ? data.buying_power : "...Loading"}</h2>
      <h2>
        Current price of '{Symbol}' is $
        {livePrice ? livePrice : "...Loading/waiting"}
      </h2>
      <label htmlFor="ticker">ticker symbol</label>
      <input id="ticker" required></input>
      <button
        type="button"
        id="send"
        onClick={() => {
          const ticker = document.getElementById("ticker");
          setLastSymbol(Symbol);
          newSymbol(ticker.value.toUpperCase());
          console.log(`${Symbol}`);
          console.log("button has been clicked");
        }}
      >
        Get live data
      </button>
    </div>
  );
}

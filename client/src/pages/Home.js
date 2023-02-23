import React, { useState } from "react";
import { accountInfo } from "../utils/API";
import { ts } from "../utils/Date";

export default function Home() {
  const [Symbol, newSymbol] = useState("");
  const [LastSymbol, setLastSymbol] = useState("*");

  const [Price, setPrice] = useState(false);
  const [Volume, setVol] = useState(false);
  const [Time, setTime] = useState(false);

  const ws = new WebSocket("ws://localhost:8080");
  ws.onmessage = (event) => {
    const data = event.data;
    if (data.includes("price")) {
      const stockData = JSON.parse(event.data);
      const Time = ts(stockData.Timestamp);
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

  const [data, setData] = useState(false);
  accountInfo().then((Data) => {
    if (data === false) {
      setData(Data);
    }
  });

  const inputChange = (event) => {
    newSymbol(event.target.value.toUpperCase());
  };
  return (
    <div className="text-white">
      <h1>Home</h1>
      <h2>my buying power is {data ? data.buying_power : "...Loading"}</h2>
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
            setLastSymbol(Symbol);
            newSymbol(ticker.value.toUpperCase());
            console.log(Symbol);
            console.log("button has been clicked");
            ticker.value = "";
          }}
        >
          Search
        </button>
      </form>
      <div className="ticker-dash">
        <h2>{Symbol ? Symbol : "Ticker"}</h2>
        <ul>
          <li>Price: {Price ? `$${Price}` : "n/a"}</li>
          <li>Volume: {Volume ? Volume : "n/a"}</li>
          <li>Last updated: {Time ? Time : "n/a"}</li>
        </ul>
      </div>
    </div>
  );
}

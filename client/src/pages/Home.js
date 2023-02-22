import React, { useState } from "react";
import { accountInfo } from "../utils/API";

export default function Home() {
  // const ws = new WebSocket("ws://localhost:8080");
  // ws.onmessage = (event) => {
  //   console.log(event.data);
  // };

  // let Symbol = "qqq";
  // ws.onopen = () => {
  //   ws.send(
  //     JSON.stringify({ type: "subscribe", symbol: `${Symbol}`, quote: true })
  //   );
  //   // ws.send(
  //   //   JSON.stringify({
  //   //     action: "unsubscribe", //unsubscribe subscribe
  //   //     trades: [`${Symbol}`],
  //   //     quotes: [`${Symbol}`],
  //   //     bars: ["*"],
  //   //     dailyBars: ["VOO"],
  //   //     statuses: ["*"],
  //   //   })
  //   // );
  // };
  const [data, setData] = useState(false);
  accountInfo().then((Data) => {
    if (data === false) {
      setData(Data);
    }
  });

  return (
    <div>
      <h1>Home</h1>
      <h2>my buying power is {data ? data.buying_power : "...Loading"}</h2>
      <h2>
        Current price of '{}' is {}
      </h2>
      <label htmlFor="ticker">ticker symbol</label>
      <input id="ticker" required></input>
      <button
        type="button"
        id="send"
        onClick={() => {
          const ticker = document.getElementById("ticker");
          //   ws.send(
          //     JSON.stringify({
          //       type: "unsubscribe",
          //       symbol: `${Symbol}`,
          //       quote: true,
          //     })
          //   );
          let Symbol = ticker.value;
          // if (ws.readyState === ws.OPEN) {
          //   ws.onopen = () => {
          //     ws.send(
          //       JSON.stringify({
          //         type: "subscribe",
          //         symbol: "QQQ",
          //         quote: true,
          //       })
          //     );
          //   };
          // }
          console.log(Symbol);
          console.log("button has been clicked");
        }}
      >
        Get live data
      </button>
    </div>
  );
}

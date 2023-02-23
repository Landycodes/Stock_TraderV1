const express = require("express");
const WebSocket = require("ws");
const routes = require("./routes");
require("dotenv");

const app = express();
const PORT = process.env.PORT || 3001;

const wss = new WebSocket.Server({ port: 8080 });
const finSocket = new WebSocket(
  `wss://ws.finnhub.io?token=${process.env.FIN_key}`
);

///////////////////MIDDLEWARE
//bypasses cors policy to make requests to api on the server side
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "http://localhost:3000");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  next();
});
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(routes);

//////////Local websocket server to connect client to finnhub ws server
wss.on("connection", (client) => {
  console.log("Front-end client connected");
  // Send a welcome message to the client
  client.send("Server connected!");
  client.on("message", (data) => {
    //object that is being sent to the alpaca server console.logged in browser
    client.send(`Received data from client server: ${data}`);
    finSocket.send(data);
  });
  client.on("error", (err) => client.send(err));
});

// finSocket.on("open", () => {
//   finSocket.send(
//     //symbol is case sensitive
//     JSON.stringify({ type: "unsubscribe", symbol: "QQQ", quote: true })
//   );
// });

finSocket.on("message", (data) => {
  let stock = JSON.parse(data);
  if (stock.type === "trade") {
    let array = stock.data;
    console.log(array);
    let lastItem = array[array.length - 1];
    console.log(`Price of ${lastItem.s} is ${lastItem.p}`);
    console.log(`Volume is ${lastItem.v}`);
    console.log(`TimeStamp: ${lastItem.t}`);
    wss.clients.forEach((client) => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(
          JSON.stringify({
            symbol: lastItem.s,
            price: lastItem.p,
            volume: lastItem.v,
            Timestamp: lastItem.t,
          })
        );
      }
    });
  }
});

finSocket.on("message", (data) => {
  const Data = JSON.parse(data);
  if (Data.type === "ping") {
    console.log(Data.type);
    finSocket.send(
      JSON.stringify({
        type: "pong",
      })
    );
    console.log("pong");
  }
});

finSocket.on("error", (err) => console.error(`Error: ${err}`));

finSocket.on("close", () => {
  console.log("Connection has been closed");
});

app.listen(PORT, () => {
  console.log(`Alpaca server running on port http://localhost:${PORT}`);
});

wss.on("listening", () => {
  finSocket.on("open", () => {
    console.log("Finnhub websocket server running on port ws://localhost:8080");
  });
});

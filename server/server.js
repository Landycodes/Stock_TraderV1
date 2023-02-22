const express = require("express");
// const Alpaca = require("@alpacahq/alpaca-trade-api");
const WebSocket = require("ws");
const routes = require("./routes");

const app = express();
const PORT = process.env.PORT || 3001;

////ALPACA INSTANCE VARIABLES
// const alpaca = new Alpaca({
//   keyId: process.env.API_key,
//   secretKey: process.env.API_secret,
//   paper: true,
//   usePolygon: false,
// });

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

const wss = new WebSocket.Server({ port: 8080 });
const finSocket = new WebSocket(
  `wss://ws.finnhub.io?token=${process.env.FIN_key}`
);
// const alpSocket = new WebSocket("wss://stream.data.alpaca.markets/v2/iex");

wss.on("connection", (client) => {
  console.log("WebSocket client connected");
  // Send a welcome message to the client
  client.send("Server connected!");
  client.on("message", (data) => {
    //object that is being sent to the alpaca server console.logged in browser
    client.send(`Received data from client server: ${data.toString()}`);
    finSocket.send(data);
  });
  client.on("error", (err) => client.send(err));
});

finSocket.on("open", () => {
  finSocket.send(
    JSON.stringify({ type: "subscribe", symbol: "QQQ", quote: true })
  );
});
finSocket.on("ping", () => finSocket.pong());

finSocket.on("message", (data) => {
  let stock = JSON.parse(data);
  console.log(stock);
  let array = stock.data;
  if (array !== undefined) {
    let lastItem = array[array.length - 1];
    console.log(`Price of ${lastItem.s} is ${lastItem.p}`);
    console.log(`Volume is ${lastItem.v}`);
    wss.clients.forEach((client) => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(`Price of ${lastItem.s} is $${lastItem.p}`);
        client.send(`Volume is ${lastItem.v}`);
      }
    });
  }
});

finSocket.on("close", () => {
  console.log("Connection has been closed");
});
// alpSocket.on("message", (data) => {
//   //below is console.logged on server
//   console.log("Received data from source server:", data.toString());
//   // Forward data to all connected clients
//   wss.clients.forEach((client) => {
//     if (client.readyState === WebSocket.OPEN) {
//       //response from the alpaca server console.logged in browser
//       client.send(data.toString());
//     }
//   });
// });

///below is not being triggered
// wss.on("message", function incoming(data) {
//   console.log("Received data from client:", data);
//   alpSocket.send(data);
// });

////////AUTHENTICATE ALPACA WEBSOCKET
// alpSocket.on("open", () => {
//   alpSocket.send(
//     JSON.stringify({
//       action: "auth",
//       key: process.env.API_key,
//       secret: process.env.API_secret,
//     })
//   );
// });

// alpSocket.on("error", (err) => {
//   console.log("Error:", err);
// });

app.listen(PORT, () => {
  console.log(`Alpaca server running on port http://localhost:${PORT}`);
});

wss.on("listening", () => {
  finSocket.on("open", () => {
    console.log("Finnhub websocket server is listening on port 8080");
  });
});

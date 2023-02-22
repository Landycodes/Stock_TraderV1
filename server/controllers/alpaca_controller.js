const Alpaca = require("@alpacahq/alpaca-trade-api");
require("dotenv").config({ path: "../.env" });

const alpaca = new Alpaca({
  keyId: process.env.ALP_key,
  secretKey: process.env.ALP_secret,
  paper: true,
  usePolygon: false,
});

module.exports = {
  // GET http://localhost:3001/api/me
  async getMe(req, res) {
    const account = await alpaca.getAccount();
    res.json(account);
  },
  //gets current static price in a post request {"symbol": "[ticker symbol]"}
  //POST http://localhost:3001/api/me
  async currentPriceOf({ body }, res) {
    const symbol = body.symbol;
    const current = await alpaca.getLatestTrade(symbol);
    res.json(`Current price of ${symbol} is $${current.Price}`);
  },
};

const Alpaca = require("@alpacahq/alpaca-trade-api");
const moment = require("moment");
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
    res.json(current.Price);
  },
  async getEMA({ body }, res) {
    // // retrieve historical data for the stock
    // const endDate = moment().subtract(1, "day").toDate();
    // const startDate = moment(endDate)
    //   .subtract(body.emaPeriod * 2, "day")
    //   .toDate();
    // alpaca
    //   .getBars({
    //     symbols: body.symbol,
    //     start: startDate,
    //     end: endDate,
    //     timeframe: body.timeframe,
    //     limit: body.emaPeriod,
    //   })
    //   .then((barset) => {
    //     // convert the data to an array of objects
    //     const bars = barset[symbol];
    //     const barArray = bars.map((bar) => {
    //       return {
    //         time: bar.time,
    //         close: bar.close,
    //       };
    //     });

    //     // calculate the EMA using a loop
    //     let ema = 0;
    //     for (let i = 0; i < barArray.length; i++) {
    //       const weight = 2 / (emaPeriod + 1);
    //       ema = barArray[i].close * weight + ema * (1 - weight);
    //     }

    //     // print the most recent EMA value
    //     console.log(`The 20-day EMA for ${symbol} is ${ema.toFixed(2)}`);
    //   })
    //   .catch((err) => {
    //     console.log(err);
    //   });
    const symbol = "AAPL";
    const timeframe = "day";
    const limit = 10;

    const bars = await alpaca.getBarsV2(symbol, {
      timeframe: timeframe,
      limit: limit,
    });
    res.json(bars);
  },
};

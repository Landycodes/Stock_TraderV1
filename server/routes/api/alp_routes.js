const router = require("express").Router();
const {
  getMe,
  currentPriceOf,
  getEMA,
} = require("../../controllers/alpaca_controller");

router.route("/me").get(getMe).post(currentPriceOf);
router.route("/ema").get(getEMA);

module.exports = router;

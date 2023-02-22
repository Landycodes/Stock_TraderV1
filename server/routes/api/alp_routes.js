const router = require("express").Router();
const { getMe, currentPriceOf } = require("../../controllers/alpaca_controller");

router.route("/me").get(getMe).post(currentPriceOf);

module.exports = router;

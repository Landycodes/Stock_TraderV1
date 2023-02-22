const router = require("express").Router();
const alpRoutes = require("./alp_routes");

router.use("/", alpRoutes);

module.exports = router;

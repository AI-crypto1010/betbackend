const express = require("express");
const {
  getMarkets,
  createMarketController,
  addMarketController,
  addLiquidityController,
  addBetController,
} = require("../controllers/marketController");
const {
  validateCreateMarket,
  validateAddMarket,
  requireMarketId,
} = require("../middleware/validatePayload");

const router = express.Router();

router.get("/get", getMarkets);
router.post("/create", validateCreateMarket, createMarketController);
router.post("/add", validateAddMarket, addMarketController);
router.post("/liquidity", requireMarketId("market_id"), addLiquidityController);
router.post("/betting", requireMarketId("market_id"), addBetController);

module.exports = router;

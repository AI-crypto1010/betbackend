const {
  listMarkets,
  createMarket,
  updateMarketOnChainData,
  addLiquidity,
  addBet,
} = require("../models/marketModel");

const getMarkets = (req, res) => {
  const page = Math.max(parseInt(req.query.page, 10) || 1, 1);
  const limit = Math.max(parseInt(req.query.limit, 10) || 10, 1);
  const marketStatus = req.query.marketStatus;
  const marketField = req.query.marketField;

  const result = listMarkets({ page, limit, marketStatus, marketField });
  res.json(result);
};

const createMarketController = (req, res) => {
  const newMarket = createMarket(req.marketData);
  res.status(200).json({ result: newMarket._id, data: newMarket });
};

const addMarketController = (req, res) => {
  const market = updateMarketOnChainData(req.marketUpdate);
  if (!market) {
    return res.status(404).json({ message: "Market not found." });
  }

  res.json({ data: market });
};

const addLiquidityController = (req, res) => {
  const { amount, investor, active } = req.body || {};
  const market = addLiquidity({ marketId: req.marketId, amount, investor, active });
  if (!market) {
    return res.status(404).json({ message: "Market not found." });
  }

  res.json({ data: market });
};

const addBetController = (req, res) => {
  const { amount, isYes, player } = req.body || {};
  const market = addBet({ marketId: req.marketId, amount, isYes, player });
  if (!market) {
    return res.status(404).json({ message: "Market not found." });
  }

  res.json({ data: market });
};

module.exports = {
  getMarkets,
  createMarketController,
  addMarketController,
  addLiquidityController,
  addBetController,
};

const { v4: uuidv4 } = require("uuid");
const { readDb, writeDb, seedDb } = require("./db");

const toNumber = (val, fallback = 0) => {
  const num = Number(val);
  return Number.isFinite(num) ? num : fallback;
};

seedDb();

const listMarkets = ({ page = 1, limit = 10, marketStatus, marketField }) => {
  const db = readDb();
  let markets = db.markets || [];

  if (marketStatus) {
    markets = markets.filter((m) => m.marketStatus === marketStatus);
  }
  if (marketField !== undefined) {
    markets = markets.filter((m) => Number(m.marketField) === Number(marketField));
  }

  markets = markets.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

  const total = markets.length;
  const start = (page - 1) * limit;
  const data = markets.slice(start, start + limit);

  return { data, total, page, limit };
};

const createMarket = (payload) => {
  const now = new Date().toISOString();
  const newMarket = {
    _id: uuidv4(),
    marketField: Number(payload.marketField) || 0,
    apiType: Number(payload.apiType) || 0,
    task: payload.task,
    creator: payload.creator,
    tokenA: "",
    tokenB: "",
    market: "",
    question: payload.question,
    feedName: payload.feedName,
    value: Number(payload.value) || 0,
    range: Number(payload.range) || 0,
    date: payload.date,
    marketStatus: "INIT",
    imageUrl: payload.imageUrl || "https://placehold.co/96x96",
    createdAt: now,
    playerACount: 0,
    playerBCount: 0,
    totalInvestment: 0,
    tradingAmountA: 0,
    tradingAmountB: 0,
    tokenAPrice: 0,
    tokenBPrice: 0,
    description: payload.description || "",
    comments: 0,
    dataLink: payload.dataLink || "",
    feedAddress: payload.feedAddress || "",
    initAmount: 0,
    investors: [],
    bets: [],
  };

  const db = readDb();
  db.markets = db.markets || [];
  db.markets.push(newMarket);
  writeDb(db);
  return newMarket;
};

const findMarketIndex = (db, id) => db.markets.findIndex((m) => m._id === id);

const updateMarketOnChainData = (payload) => {
  const db = readDb();
  const marketIndex = findMarketIndex(db, payload.id);
  if (marketIndex === -1) return null;

  const market = db.markets[marketIndex];
  market.tokenA = payload.tokenA ? String(payload.tokenA) : market.tokenA;
  market.tokenB = payload.tokenB ? String(payload.tokenB) : market.tokenB;
  market.market = payload.market ? String(payload.market) : market.market;
  market.feedAddress = payload.feedAddress ? String(payload.feedAddress) : market.feedAddress;
  market.marketStatus = "PENDING";
  market.updatedAt = new Date().toISOString();

  db.markets[marketIndex] = market;
  writeDb(db);
  return market;
};

const addLiquidity = ({ marketId, amount, investor, active }) => {
  const db = readDb();
  const marketIndex = findMarketIndex(db, marketId);
  if (marketIndex === -1) return null;

  const market = db.markets[marketIndex];
  const amt = toNumber(amount, 0);
  market.totalInvestment = toNumber(market.totalInvestment, 0) + amt;
  market.initAmount = market.initAmount || 0;
  market.investors = market.investors || [];
  if (investor) {
    market.investors.push({ investor, amount: amt, ts: new Date().toISOString() });
  }

  if (active) {
    market.marketStatus = "ACTIVE";
  }
  market.updatedAt = new Date().toISOString();

  db.markets[marketIndex] = market;
  writeDb(db);
  return market;
};

const addBet = ({ marketId, amount, isYes, player }) => {
  const db = readDb();
  const marketIndex = findMarketIndex(db, marketId);
  if (marketIndex === -1) return null;

  const market = db.markets[marketIndex];
  const amt = toNumber(amount, 0);
  market.totalInvestment = toNumber(market.totalInvestment, 0) + amt;
  market.playerACount = toNumber(market.playerACount, 0) + (isYes ? amt : 0);
  market.playerBCount = toNumber(market.playerBCount, 0) + (!isYes ? amt : 0);
  market.tradingAmountA = toNumber(market.tradingAmountA, 0);
  market.tradingAmountB = toNumber(market.tradingAmountB, 0);
  market.bets = market.bets || [];
  if (player) {
    market.bets.push({ player, amount: amt, isYes: !!isYes, ts: new Date().toISOString() });
  }
  market.updatedAt = new Date().toISOString();

  db.markets[marketIndex] = market;
  writeDb(db);
  return market;
};

module.exports = {
  listMarkets,
  createMarket,
  updateMarketOnChainData,
  addLiquidity,
  addBet,
};

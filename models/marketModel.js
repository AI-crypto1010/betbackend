const Market = require("./Market");

const toNumber = (val, fallback = 0) => {
  const num = Number(val);
  return Number.isFinite(num) ? num : fallback;
};

const seedMarkets = async () => {
  const count = await Market.estimatedDocumentCount();
  if (count > 0) return;

  const now = new Date();
  const inFiveDays = new Date(now.getTime() + 5 * 24 * 60 * 60 * 1000);
  const inTenDays = new Date(now.getTime() + 10 * 24 * 60 * 60 * 1000);

  const seedData = [
    {
      marketField: 0,
      apiType: 0,
      question: "Will Bitcoin reach $120k before year end?",
      feedName: "bitcoin",
      value: 120000,
      totalInvestment: 20.5,
      playerACount: 120,
      playerBCount: 80,
      dataLink: "https://api.coingecko.com/api/v3/simple/price?ids=bitcoin&vs_currencies=usd",
      marketStatus: "ACTIVE",
      date: inFiveDays,
    },
    {
      marketField: 0,
      apiType: 0,
      question: "Will Ethereum break $5,000 this quarter?",
      feedName: "ethereum",
      value: 5000,
      totalInvestment: 14.2,
      playerACount: 90,
      playerBCount: 60,
      dataLink: "https://api.coingecko.com/api/v3/simple/price?ids=ethereum&vs_currencies=usd",
      marketStatus: "ACTIVE",
      date: inTenDays,
    },
    {
      marketField: 1,
      apiType: 0,
      question: "Will the Lakers score 120+ in their next game?",
      feedName: "Lakers",
      value: 120,
      marketStatus: "PENDING",
      date: inTenDays,
      dataLink: "https://api.sportsdata.io/v3/nba/stats/json/PlayerGameStatsByDate/2024-10-10/LAL",
    },
  ];

  await Market.insertMany(seedData);
};

const listMarkets = async ({ page = 1, limit = 10, marketStatus, marketField }) => {
  const query = {};
  if (marketStatus) query.marketStatus = marketStatus;
  if (marketField !== undefined) query.marketField = Number(marketField);

  const [data, total] = await Promise.all([
    Market.find(query)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .lean(),
    Market.countDocuments(query),
  ]);

  return { data, total, page, limit };
};

const createMarket = async (payload) => {
  const market = await Market.create({
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
  });

  return market.toObject();
};

const updateMarketOnChainData = async (payload) => {
  const market = await Market.findById(payload.id);
  if (!market) return null;

  market.tokenA = payload.tokenA ? String(payload.tokenA) : market.tokenA;
  market.tokenB = payload.tokenB ? String(payload.tokenB) : market.tokenB;
  market.market = payload.market ? String(payload.market) : market.market;
  market.feedAddress = payload.feedAddress ? String(payload.feedAddress) : market.feedAddress;
  market.marketStatus = "PENDING";
  market.updatedAt = new Date();

  await market.save();
  return market.toObject();
};

const addLiquidity = async ({ marketId, amount, investor, active }) => {
  const market = await Market.findById(marketId);
  if (!market) return null;

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
  market.updatedAt = new Date();

  await market.save();
  return market.toObject();
};

const addBet = async ({ marketId, amount, isYes, player }) => {
  const market = await Market.findById(marketId);
  if (!market) return null;

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
  market.updatedAt = new Date();

  await market.save();
  return market.toObject();
};

module.exports = {
  listMarkets,
  createMarket,
  updateMarketOnChainData,
  addLiquidity,
  addBet,
  seedMarkets,
};

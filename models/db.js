const fs = require("fs");
const path = require("path");
const { v4: uuidv4 } = require("uuid");

const DB_PATH = path.join(__dirname, "..", "db.json");

const ensureDb = () => {
  if (!fs.existsSync(DB_PATH)) {
    fs.mkdirSync(path.dirname(DB_PATH), { recursive: true });
    fs.writeFileSync(DB_PATH, JSON.stringify({ markets: [] }, null, 2), "utf8");
  }
};

const readDb = () => {
  ensureDb();
  const raw = fs.readFileSync(DB_PATH, "utf8");
  try {
    return JSON.parse(raw);
  } catch (error) {
    console.error("Failed to parse db.json, recreating file", error);
    fs.writeFileSync(DB_PATH, JSON.stringify({ markets: [] }, null, 2), "utf8");
    return { markets: [] };
  }
};

const writeDb = (db) => {
  fs.writeFileSync(DB_PATH, JSON.stringify(db, null, 2), "utf8");
};

const seedDb = () => {
  const db = readDb();
  if (db.markets && db.markets.length > 0) return;

  const now = new Date();
  const inFiveDays = new Date(now.getTime() + 5 * 24 * 60 * 60 * 1000).toISOString();
  const inTenDays = new Date(now.getTime() + 10 * 24 * 60 * 60 * 1000).toISOString();
  const janEnd = new Date("2026-01-31T23:59:59.000Z").toISOString();
  const jan22 = new Date("2026-01-22T23:59:59.000Z").toISOString();
  const jan25 = new Date("2026-01-25T23:59:59.000Z").toISOString();

  const baseMarket = (overrides = {}) => ({
    _id: uuidv4(),
    marketField: overrides.marketField ?? 0,
    apiType: overrides.apiType ?? 0,
    task: overrides.task ?? "price",
    creator: overrides.creator ?? "demo_creator",
    tokenA: overrides.tokenA ?? "TokenA111111111111111111111111111111",
    tokenB: overrides.tokenB ?? "TokenB222222222222222222222222222222",
    market: overrides.market ?? "MarketDemo11111111111111111111111111",
    question: overrides.question ?? "Will SOL flip ETH by market cap this year?",
    feedName: overrides.feedName ?? "Solana",
    value: overrides.value ?? 120,
    range: overrides.range ?? 0,
    date: overrides.date ?? inFiveDays,
    marketStatus: overrides.marketStatus ?? "ACTIVE",
    imageUrl: overrides.imageUrl ?? "https://placehold.co/96x96",
    createdAt: overrides.createdAt ?? now.toISOString(),
    playerACount: overrides.playerACount ?? 50,
    playerBCount: overrides.playerBCount ?? 40,
    totalInvestment: overrides.totalInvestment ?? 12,
    tradingAmountA: overrides.tradingAmountA ?? 0,
    tradingAmountB: overrides.tradingAmountB ?? 0,
    tokenAPrice: overrides.tokenAPrice ?? 0,
    tokenBPrice: overrides.tokenBPrice ?? 0,
    description: overrides.description ?? "",
    comments: overrides.comments ?? 0,
    dataLink: overrides.dataLink ?? "",
    feedAddress: overrides.feedAddress ?? "",
    initAmount: overrides.initAmount ?? 0,
    investors: overrides.investors ?? [],
    bets: overrides.bets ?? [],
  });

  db.markets = [
    baseMarket({
      question: "Will Bitcoin reach $120k before year end?",
      feedName: "bitcoin",
      value: 120000,
      totalInvestment: 20.5,
      playerACount: 120,
      playerBCount: 80,
      dataLink: "https://api.coingecko.com/api/v3/simple/price?ids=bitcoin&vs_currencies=usd",
      marketStatus: "ACTIVE",
      date: inFiveDays,
    }),
    baseMarket({
      question: "Will Ethereum break $5,000 this quarter?",
      feedName: "ethereum",
      value: 5000,
      totalInvestment: 14.2,
      playerACount: 90,
      playerBCount: 60,
      dataLink: "https://api.coingecko.com/api/v3/simple/price?ids=ethereum&vs_currencies=usd",
      marketStatus: "ACTIVE",
      date: inTenDays,
    }),
    baseMarket({
      question: "Will Solana flip Ethereum by market cap in 2026?",
      feedName: "solana",
      value: 1,
      totalInvestment: 8.8,
      playerACount: 70,
      playerBCount: 85,
      dataLink: "https://api.coingecko.com/api/v3/coins/markets?ids=solana&vs_currency=usd",
      marketStatus: "PENDING",
      date: inTenDays,
    }),
    baseMarket({
      marketField: 0,
      apiType: 0,
      question: "Will BTC settle above $100k on Polymarket by year end?",
      feedName: "polymarket_btc_100k",
      value: 100000,
      marketStatus: "ACTIVE",
      dataLink: "https://gamma-api.polymarket.com/markets?search=btc",
      totalInvestment: 16.4,
      playerACount: 110,
      playerBCount: 95,
      date: inFiveDays,
    }),
    baseMarket({
      marketField: 0,
      apiType: 0,
      question: "Will ETH ETFs be approved before Q3?",
      feedName: "polymarket_eth_etf",
      value: 1,
      marketStatus: "PENDING",
      dataLink: "https://gamma-api.polymarket.com/markets?search=etf",
      totalInvestment: 9.1,
      playerACount: 62,
      playerBCount: 58,
      date: inTenDays,
    }),
    baseMarket({
      question: "What price will Bitcoin hit in January?",
      feedName: "bitcoin_jan",
      value: 60000,
      marketStatus: "ACTIVE",
      dataLink: "https://api.coingecko.com/api/v3/simple/price?ids=bitcoin&vs_currencies=usd",
      totalInvestment: 11.2,
      playerACount: 80,
      playerBCount: 70,
      date: janEnd,
    }),
    baseMarket({
      question: "Bitcoin above $70,000 on January 22?",
      feedName: "bitcoin_jan22_70k",
      value: 70000,
      marketStatus: "PENDING",
      dataLink: "https://api.coingecko.com/api/v3/simple/price?ids=bitcoin&vs_currencies=usd",
      totalInvestment: 7.5,
      playerACount: 55,
      playerBCount: 60,
      date: jan22,
    }),
    baseMarket({
      question: "What price will Ethereum hit in January?",
      feedName: "ethereum_jan",
      value: 3500,
      marketStatus: "ACTIVE",
      dataLink: "https://api.coingecko.com/api/v3/simple/price?ids=ethereum&vs_currencies=usd",
      totalInvestment: 9.9,
      playerACount: 72,
      playerBCount: 66,
      date: janEnd,
    }),
    baseMarket({
      question: "What price will Bitcoin hit January 19-25?",
      feedName: "bitcoin_jan19_25",
      value: 65000,
      marketStatus: "PENDING",
      dataLink: "https://api.coingecko.com/api/v3/simple/price?ids=bitcoin&vs_currencies=usd",
      totalInvestment: 6.8,
      playerACount: 48,
      playerBCount: 52,
      date: jan25,
    }),
    baseMarket({
      question: "Bitcoin Up or Down on January 22?",
      feedName: "bitcoin_up_down_jan22",
      value: 1,
      marketStatus: "PENDING",
      dataLink: "https://api.coingecko.com/api/v3/simple/price?ids=bitcoin&vs_currencies=usd",
      totalInvestment: 5.4,
      playerACount: 60,
      playerBCount: 57,
      date: jan22,
    }),
    baseMarket({
      question: "What price will Solana hit in January?",
      feedName: "solana_jan",
      value: 250,
      marketStatus: "ACTIVE",
      dataLink: "https://api.coingecko.com/api/v3/simple/price?ids=solana&vs_currencies=usd",
      totalInvestment: 8.3,
      playerACount: 69,
      playerBCount: 61,
      date: janEnd,
    }),
    baseMarket({
      question: "Seeker FDV above $500M one day after launch?",
      feedName: "seeker_fdv_launch",
      value: 500000000,
      marketStatus: "PENDING",
      dataLink: "https://gamma-api.polymarket.com/markets?search=seeker",
      totalInvestment: 4.1,
      playerACount: 40,
      playerBCount: 44,
      date: jan22,
    }),
    baseMarket({
      question: "Ethereum above $4,000 on January 22?",
      feedName: "ethereum_jan22_4k",
      value: 4000,
      marketStatus: "PENDING",
      dataLink: "https://api.coingecko.com/api/v3/simple/price?ids=ethereum&vs_currencies=usd",
      totalInvestment: 6.2,
      playerACount: 58,
      playerBCount: 59,
      date: jan22,
    }),
    baseMarket({
      marketField: 1,
      apiType: 0,
      question: "Will the Lakers score 120+ in their next game?",
      feedName: "Lakers",
      value: 120,
      marketStatus: "PENDING",
      date: inTenDays,
      dataLink: "https://api.sportsdata.io/v3/nba/stats/json/PlayerGameStatsByDate/2024-10-10/LAL",
    }),
    baseMarket({
      marketField: 1,
      apiType: 1,
      question: "Will the Chiefs win their next game?",
      feedName: "Chiefs",
      value: 1,
      marketStatus: "ACTIVE",
      date: inFiveDays,
      dataLink: "https://api.sportsdata.io/v3/nfl/scores/json/Teams",
    }),
  ];

  writeDb(db);
};

module.exports = {
  DB_PATH,
  ensureDb,
  readDb,
  writeDb,
  seedDb,
};

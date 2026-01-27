const { Schema, model, models } = require("mongoose");

const MarketSchema = new Schema(
  {
    marketField: { type: Number, default: 0 },
    apiType: { type: Number, default: 0 },
    task: { type: String, default: "price" },
    creator: { type: String, default: "demo_creator" },
    tokenA: { type: String, default: "" },
    tokenB: { type: String, default: "" },
    market: { type: String, default: "" },
    question: { type: String, required: true },
    feedName: { type: String, default: "" },
    value: { type: Number, default: 0 },
    range: { type: Number, default: 0 },
    date: { type: Date, required: true },
    marketStatus: { type: String, default: "ACTIVE" },
    imageUrl: { type: String, default: "https://placehold.co/96x96" },
    playerACount: { type: Number, default: 0 },
    playerBCount: { type: Number, default: 0 },
    totalInvestment: { type: Number, default: 0 },
    tradingAmountA: { type: Number, default: 0 },
    tradingAmountB: { type: Number, default: 0 },
    tokenAPrice: { type: Number, default: 0 },
    tokenBPrice: { type: Number, default: 0 },
    description: { type: String, default: "" },
    comments: { type: Number, default: 0 },
    dataLink: { type: String, default: "" },
    feedAddress: { type: String, default: "" },
    initAmount: { type: Number, default: 0 },
    investors: { type: Array, default: [] },
    bets: { type: Array, default: [] },
  },
  {
    timestamps: true,
  }
);

module.exports = models.Market || model("Market", MarketSchema);

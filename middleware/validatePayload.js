const validateCreateMarket = (req, res, next) => {
  const { data, isChecked } = req.body || {};

  if (!isChecked) {
    return res.status(400).json({ message: "Terms checkbox not accepted." });
  }

  const requiredFields = ["marketField", "apiType", "question", "feedName", "dataLink", "date", "task", "value", "creator"];
  const missing = requiredFields.filter((field) => data?.[field] === undefined || data?.[field] === "");
  if (missing.length) {
    return res.status(400).json({ message: `Missing required fields: ${missing.join(", ")}` });
  }

  req.marketData = data;
  next();
};

const validateAddMarket = (req, res, next) => {
  const { data } = req.body || {};
  if (!data || !data.id) {
    return res.status(400).json({ message: "Missing market id in payload." });
  }
  req.marketUpdate = data;
  next();
};

const requireMarketId = (fieldName) => (req, res, next) => {
  const marketId = req.body?.[fieldName];
  if (!marketId) {
    return res.status(400).json({ message: `${fieldName} is required.` });
  }
  req.marketId = marketId;
  next();
};

module.exports = {
  validateCreateMarket,
  validateAddMarket,
  requireMarketId,
};

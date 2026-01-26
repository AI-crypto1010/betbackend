const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const marketRoutes = require("./routes/marketRoutes");
const { seedDb } = require("./models/db");
const { notFound, errorHandler } = require("./middleware/errorHandler");

const PORT = process.env.PORT || 9000;
const app = express();

seedDb();

app.use(cors({ origin: true, credentials: true }));
app.use(express.json({ limit: "1mb" }));
app.use(morgan("dev"));

app.get("/health", (_req, res) => {
    res.json({ status: "ok", ts: new Date().toISOString() });
});

app.use("/api/market", marketRoutes);

app.use(notFound);
app.use(errorHandler);

app.listen(PORT, () => {
    console.log(`Backend API listening on http://localhost:${PORT}`);
});


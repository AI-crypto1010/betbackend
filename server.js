const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const marketRoutes = require("./routes/marketRoutes");
const { notFound, errorHandler } = require("./middleware/errorHandler");
const connectMongo = require("./lib/mongo");
const { seedMarkets } = require("./models/marketModel");

const PORT = process.env.PORT || 9000;
const app = express();

app.use(cors({ origin: true, credentials: true }));
app.use(express.json({ limit: "1mb" }));
app.use(morgan("dev"));

app.get("/health", (_req, res) => {
    res.json({ status: "ok", ts: new Date().toISOString() });
});

app.use("/api/market", marketRoutes);

app.use(notFound);
app.use(errorHandler);

const start = async () => {
    try {
        await connectMongo();
        await seedMarkets();
        app.listen(PORT, () => {
            console.log(`Backend API listening on http://localhost:${PORT}`);
        });
    } catch (err) {
        console.error("Failed to start server:", err);
        process.exit(1);
    }
};

start();


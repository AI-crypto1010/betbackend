const mongoose = require("mongoose");

let connectionPromise = null;

const connectMongo = async () => {
  if (connectionPromise) return connectionPromise;

  const uri =
    process.env.MONGO_URI ||
    "mongodb://127.0.0.1:27017/prediction_market";

  connectionPromise = mongoose
    .connect(uri, {
      autoIndex: true,
    })
    .catch((err) => {
      connectionPromise = null;
      throw err;
    });

  mongoose.connection.on("error", (err) => {
    console.error("Mongo connection error:", err);
  });

  return connectionPromise;
};

module.exports = connectMongo;

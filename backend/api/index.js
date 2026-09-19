import dotenv from "dotenv";
dotenv.config();
import dns from "node:dns/promises";
dns.setServers(["1.1.1.1", "8.8.8.8"]);

import app from "../src/app.js";
import connectDB from "../src/config/database.js";

let isConnected = false;

const handler = async (req, res) => {
  if (!isConnected) {
    try {
      await connectDB();
      isConnected = true;
    } catch (error) {
      console.error("DB connection failed:", error.message);
      return res.status(500).json({
        message: "Database connection failed",
        error: error.message,
      });
    }
  }
  return app(req, res);
};

export default handler;
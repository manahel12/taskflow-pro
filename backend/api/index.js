import dotenv from "dotenv";
dotenv.config();
import dns from "node:dns/promises";
dns.setServers(["1.1.1.1", "8.8.8.8"]);

import app from "../src/app.js";
import connectDB from "../src/config/database.js";

let isConnected = false;

// ✅ Allowed origins (Netlify + Localhost)
const allowedOrigins = [
  "http://localhost:5173",
  "http://localhost:3000",
  "https://taskflowpro-1.netlify.app",
];

const handler = async (req, res) => {
  const origin = req.headers.origin;

  // ✅ CORS Headers manually set karein
  if (allowedOrigins.includes(origin)) {
    res.setHeader("Access-Control-Allow-Origin", origin);
  }
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, PATCH, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization, X-Requested-With, Accept");
  res.setHeader("Access-Control-Allow-Credentials", "true");
  res.setHeader("Access-Control-Max-Age", "86400");

  // ✅ Preflight (OPTIONS) request ko yahin rok dein (Express tak na jaye)
  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  // ✅ DB connection (sirf ek baar)
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

  // ✅ Express app ko request pass karein
  return app(req, res);
};

export default handler;
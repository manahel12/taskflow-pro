import dotenv from "dotenv";
dotenv.config();
import dns from "node:dns/promises";
dns.setServers(["1.1.1.1", "8.8.8.8"]);

import app from "./src/app.js";
import connectDB from "./src/config/database.js";

// Database connect karein (Vercel khud isay on-demand chalayega)
connectDB().catch((error) => {
  console.error("Database connection failed:", error.message);
});

// Vercel ke liye: sirf app export karein
export default app;

// Local development ke liye (sirf tab listen karega jab Vercel par nahi hoga)
if (process.env.NODE_ENV !== "production") {
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => {
    console.log(`TaskFlow Pro API running on port ${PORT}`);
  });
}
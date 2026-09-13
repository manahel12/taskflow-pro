import dotenv from "dotenv";
dotenv.config();
import dns from "node:dns/promises";
dns.setServers(["1.1.1.1", "8.8.8.8"]);

import app from "./src/app.js";
import connectDB from "./src/config/database.js";

const PORT = process.env.PORT || 5000;

connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`TaskFlow Pro API running on port ${PORT}`);
  });
}).catch((error) => {
  console.error("Database connection failed:", error.message);
  process.exit(1);
});

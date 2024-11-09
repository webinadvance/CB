import express from "express";
import cors from "cors";
import { router as pagesRouter } from "./routes/pages.js";
import { initializeDatabase } from "./database/init.js";
import { sequelize } from "./database/config.js";

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use("/api", pagesRouter);

async function startServer() {
  try {
    // Initialize database and seed data
    await initializeDatabase();

    app.listen(port, () => {
      console.log(`Server running on port ${port}`);
    });
  } catch (error) {
    console.error("Failed to start server:", error);
  }
}

startServer();

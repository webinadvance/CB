// server/server.js
import express from "express";
import cors from "cors";
import { router as pagesRouter } from "./routes/pages.js";
import { initializeDatabase } from "./database/init.js";
import { sequelize } from "./database/config.js";

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use("/api", pagesRouter);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send("Something broke!");
});

async function startServer() {
  try {
    // Test database connection
    await sequelize.authenticate();
    console.log("Database connection has been established successfully.");

    // Initialize database and seed data
    await initializeDatabase();
    console.log("Database initialized successfully");

    // Start the server
    app.listen(port, () => {
      console.log(`Server running at http://localhost:${port}`);
    });
  } catch (error) {
    console.error("Unable to start server:", error);
    process.exit(1); // Exit if server fails to start
  }
}

// Handle unhandled promise rejections
process.on("unhandledRejection", (error) => {
  console.error("Unhandled promise rejection:", error);
  process.exit(1);
});

startServer();

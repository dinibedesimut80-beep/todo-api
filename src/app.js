const express = require("express");
const todoRoutes = require("./routes/todo.routes");
const authRoutes = require("./routes/auth.routes");
const statsRoutes = require("./routes/stats.routes");
const logger = require("./middlewares/logger.middleware");
const notFound = require("./middlewares/notFound.middleware");
const errorHandler = require("./middlewares/errorHandler.middleware");

const app = express();

// 1. Core Middlewares
app.use(logger);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 2. Health Check / Root Route
// 2. Health Check / Root Route
app.get("/", (req, res) => {
  res.json({ message: "Todo API is running" });
});

// >>> TAMBAHKAN KODE INI DI SINI <<<
app.get("/api-docs", (req, res) => {
  res.json({ message: "Todo API is running" });
});

// 3. API Routes
app.use("/api/auth", authRoutes);
app.use("/api/todos", todoRoutes);
app.use("/api/stats", statsRoutes);
// 4. Fallback & Error Handling Middlewares
app.use(notFound);
app.use(errorHandler);

module.exports = app;
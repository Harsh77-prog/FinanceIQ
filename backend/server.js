require("dotenv").config();

const express = require("express");
const cors = require("cors");

const authRoutes = require("./routes/auth");
const financeRoutes = require("./routes/finance");
const { errorHandler } = require("./middleware/errorHandler");

const app = express();
const PORT = process.env.PORT || 5000;

/* ===============================
   DEBUG ENV (IMPORTANT)
================================ */
console.log("EMAIL_USER:", process.env.EMAIL_FROM);

/* ===============================
   Middleware
================================ */
app.use(
  cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true,
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

/* ===============================
   Health Check
================================ */
app.get("/health", (req, res) => {
  res.json({ status: "ok", time: new Date() });
});

/* ===============================
   Routes
================================ */
app.use("/api/auth", authRoutes);
app.use("/api/finance", financeRoutes);
app.use("/api/transactions", require("./routes/transactions"));
app.use("/api/goals", require("./routes/goals"));
app.use("/api/savings", require("./routes/savings"));
app.use("/api/debts", require("./routes/debts"));
app.use("/api/portfolio", require("./routes/portfolio"));
app.use("/api/alerts", require("./routes/alerts"));
app.use("/api/analytics", require("./routes/analytics"));
app.use("/api/budget", require("./routes/budget"));
app.use("/api/wealth", require("./routes/wealth"));

/* ===============================
   Error Handler
================================ */
app.use(errorHandler);

/* ===============================
   Start Server
================================ */
app.listen(PORT, () => {
  console.log(`🚀 Backend running on port ${PORT}`);
});
const express = require("express");
const dotenv = require("dotenv");
const db = require("./models/index");
const authRoutes = require("./routes/publicRoute/authRoute");
const protectedRoutes = require("./routes/protectedRoutes/protectedRoute");

dotenv.config();

const app = express();

app.use(express.json());

db.sequelize
  .sync({ force: false })
  .then(() => {
    console.log("Database & tables synced!");
  })
  .catch((err) => {
    console.error("Error syncing database:", err);
  });

app.use("/auth", authRoutes);
app.use("/api", protectedRoutes);

// Export ứng dụng Express để Vercel có thể sử dụng nó
module.exports = app;

// server.js hoặc app.js (Tên file có thể tùy chỉnh)
const express = require("express");
const dotenv = require("dotenv"); // Đảm bảo bạn đã cài đặt dotenv để đọc biến môi trường
const db = require("./models/index");
const authRoutes = require("./routes/publicRoute/authRoute"); // Import các route liên quan đến xác thực
const protectedRoutes = require("./routes/protectedRoutes/protectedRoute"); // Import các route được bảo vệ

dotenv.config(); // Đọc các biến môi trường từ file .env

const app = express();

// Để ứng dụng hiểu dữ liệu JSON từ client
app.use(express.json());

// Đồng bộ hóa cơ sở dữ liệu và các bảng
db.sequelize
  .sync({ force: false }) // force: true drops and recreates tables
  .then(() => {
    console.log("Database has been created!");
  })
  .catch((err) => {
    console.error("Error syncing database:", err);
  });

// Định nghĩa các route
app.use("/auth", authRoutes);
app.use("/api", protectedRoutes);

// Khởi chạy server
const PORT = process.env.PORT || 8080; // Sử dụng cổng từ biến môi trường hoặc cổng mặc định
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

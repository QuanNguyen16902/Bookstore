// middleware/authMiddleware.js
const jwt = require("jsonwebtoken");
const { jwtSecret } = require("../config/config");
const db = require("../models/index");
const BlacklistedToken = db.blacklistToken;

// Middleware để kiểm tra token JWT
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1]; // Lấy token từ header

  if (token == null) return res.status(401).json({ message: "Access Denied" });

  jwt.verify(token, jwtSecret, (err, user) => {
    if (err) return res.status(403).json({ message: "Invalid Token" });

    req.user = user;
    next();
  });
};

// Hàm checkBlacklistedToken
async function checkBlacklistedToken(req, res, next) {
  const token = req.headers["authorization"]?.split(" ")[1];
  if (!token) return next();

  const blacklistedToken = await BlacklistedToken.findOne({ where: { token } });
  if (blacklistedToken) {
    return res.status(401).json({ message: "Token has been expired" });
  }
  next();
}

module.exports = {
  authenticateToken,
  checkBlacklistedToken,
};

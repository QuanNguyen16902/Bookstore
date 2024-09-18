// routes/protectedRoutes.js
const express = require("express");
const {
  authenticateToken,
  checkBlacklistedToken,
} = require("../../middleware/authMiddleware");
const router = express.Router();
const bookRoutes = require("./bookRoute");
const userRoutes = require("./userRoute");
const categoriesRoutes = require("./categoriesRoute");
const cartRoutes = require("./cartRoute");
const checkoutRoutes = require("./checkoutRoute");
const orderRoutes = require("./orderRoute");
//route được bảo vệ
router.get(
  "/protected",
  authenticateToken,
  checkBlacklistedToken,
  (req, res) => {
    res.json({ message: "This is a protected route", user: req.user });
  }
);
router.use("/users", authenticateToken, checkBlacklistedToken, userRoutes);
router.use("/books", authenticateToken, checkBlacklistedToken, bookRoutes);
router.use("/carts", authenticateToken, checkBlacklistedToken, cartRoutes);
router.use(
  "/categories",
  authenticateToken,
  checkBlacklistedToken,
  categoriesRoutes
);
router.use(
  "/checkout",
  authenticateToken,
  checkBlacklistedToken,
  checkoutRoutes
);
router.use("/orders", authenticateToken, checkBlacklistedToken, orderRoutes);

module.exports = router;

const express = require("express");
const router = express.Router();
const db = require("../../models/index");
const Order = db.order;
const Book = db.books;
const OrderItem = db.orderItem;
router.get("/:userId", async (req, res) => {
  try {
    const { userId } = req.params;

    // Tìm các đơn hàng của người dùng
    const orders = await Order.findAll({
      where: { userId },
      include: [
        {
          model: OrderItem,
          as: "order_items",
          include: [{ model: Book, as: "book" }],
        },
      ],
    });

    if (orders.length === 0) {
      return res
        .status(404)
        .json({ message: "Không có đơn hàng nào được tìm thấy" });
    }

    res.json(orders);
  } catch (error) {
    console.error("View order error:", error);
    res.status(500).json({
      message: "Có lỗi xảy ra khi xem đơn hàng",
      error: error.message,
    });
  }
});
module.exports = router;

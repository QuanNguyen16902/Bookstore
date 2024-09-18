const { Op } = require("sequelize");
const express = require("express");
const router = express.Router();
const db = require("../../models/index"); // Điều chỉnh theo đường dẫn thực tế của bạn

router.post("/checkout", async (req, res) => {
  const { userId } = req.body;

  try {
    // 1. Kiểm tra xem giỏ hàng có tồn tại không
    const cart = await db.carts.findOne({
      where: { userId },
      include: [
        {
          model: db.cartItem,
          as: "cart_items",
          include: [
            {
              model: db.books,
              as: "books",
            },
          ],
        },
      ],
    });

    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }

    // 2. Tính tổng số tiền
    let totalAmount = 0;
    const orderItems = [];

    for (const item of cart.cart_items) {
      const book = item.books;

      // Kiểm tra sự tồn tại của book
      if (!book) {
        console.warn("Book not found for cart item:", item.id);
        continue;
      }

      // Kiểm tra giá và số lượng
      const price = book.price;
      const quantity = item.quantity;

      console.log(
        `Processing item: Book ID=${book.id}, Price=${price}, Quantity=${quantity}`
      );

      if (price === undefined) {
        console.warn("Price is undefined for book:", book.id);
        continue;
      }
      if (quantity === undefined) {
        console.warn("Quantity is undefined for cart item:", item.id);
        continue;
      }

      totalAmount += price * quantity;
      orderItems.push({
        bookId: book.id,
        quantity,
        price,
      });
    }

    console.log("Total Amount:", totalAmount);

    // 3. Tạo đơn hàng
    const orderDate = new Date();
    orderDate.setDate(orderDate.getDate() + 2);
    const order = await db.order.create({
      userId,
      totalAmount,
      status: "pending",
      orderDate,
    });

    // 4. Tạo các mục đơn hàng
    await db.orderItem.bulkCreate(
      orderItems.map((item) => ({
        orderId: order.id,
        bookId: item.bookId,
        quantity: item.quantity,
        price: item.price,
      }))
    );

    // 5. Xóa các mục trong giỏ hàng
    await db.cartItem.destroy({
      where: {
        cartId: cart.id,
      },
    });

    res.status(201).json({
      message: "Checkout successful",
      order,
    });
  } catch (error) {
    console.error("Error during checkout:", error);
    res
      .status(500)
      .json({ message: "Error during checkout", error: error.message });
  }
});

module.exports = router;

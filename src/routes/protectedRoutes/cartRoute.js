// Add Cart route (inside your routes file)

const express = require("express");
const router = express.Router();
const db = require("../../models/index");
const Cart = db.carts;
const Book = db.books;
const CartItem = db.cartItem;

router.post("/add", async (req, res) => {
  try {
    const { userId, bookId, quantity } = req.body;

    // Tìm hoặc tạo giỏ hàng cho người dùng
    let cart = await Cart.findOne({ where: { userId } });
    if (!cart) {
      // Nếu giỏ hàng không tồn tại, tạo mới
      cart = await Cart.create({ userId });
    }

    // Kiểm tra xem sách có tồn tại không
    const book = await Book.findByPk(bookId);
    if (!book) {
      return res.status(404).json({ message: "Book not found" });
    }

    // Thêm sách vào giỏ hàng hoặc cập nhật số lượng nếu sách đã có trong giỏ
    const [cartItem, created] = await CartItem.findOrCreate({
      where: { cartId: cart.id, bookId },
      defaults: { quantity },
    });

    if (!created) {
      cartItem.quantity += quantity; // Cộng thêm số lượng
      await cartItem.save();
    }

    res.status(201).json({ message: "Book added to cart", cartItem });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error adding book to cart", error: error.message });
  }
});

router.get("/:cartId", async (req, res) => {
  try {
    const cart = await Cart.findByPk(req.params.cartId, {
      include: [
        {
          model: Book,
          as: "books",
          through: {
            attributes: ["quantity"],
          },
        },
      ],
    });

    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }

    res.json(cart);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching cart", error: error.message });
  }
});

// Update Cart route

router.delete("/cart/remove", async (req, res) => {
  try {
    const { cartId, bookId } = req.body;

    // Kiểm tra xem sách có tồn tại trong giỏ không
    const cartItem = await CartItem.findOne({ where: { cartId, bookId } });

    if (!cartItem) {
      return res.status(404).json({ message: "Book not found in cart" });
    }

    // Xóa sách khỏi giỏ hàng
    await cartItem.destroy();
    res.json({ message: "Book removed from cart" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error removing book from cart", error: error.message });
  }
});

module.exports = router;

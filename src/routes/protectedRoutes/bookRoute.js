const express = require("express");
const router = express.Router();
const db = require("../../models/index");
const Book = db.books;
const Category = db.categories;

router.post("/", async (req, res) => {
  try {
    const { title, author, description, price, quantity, image, categoryName } =
      req.body;

    // Kiểm tra xem category có tồn tại không
    const category = await Category.findOne({ where: { name: categoryName } });
    if (!category) {
      return res.status(404).json({ message: "Category not found" });
    }

    // Tạo sách mới và liên kết với categoryId
    const book = await Book.create({
      title,
      author,
      description,
      price,
      quantity,
      image,
      categoryId: category.id,
    });

    res.status(201).json({ message: "Thêm sách thành công", book });
  } catch (err) {
    res.status(500).json({ message: "Error adding book", error: err.message });
  }
});

// List books route

router.get("/", async (req, res) => {
  try {
    const books = await Book.findAll();
    res.status(200).json(books);
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error fetching books", error: err.message });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const book = await Book.findByPk(id);

    if (book) {
      res.status(200).json({ message: "Sách có ID " + id, book });
    } else {
      res.status(404).json({ message: "Không tìm thấy sách" });
    }
  } catch (err) {
    res.status(500).json({ message: "Error fetch book", error: err.message });
  }
});
// Update book route

router.put("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { title, author, description, price, quantity, image } = req.body;
    const book = await Book.findByPk(id);

    if (book) {
      book.title = title;
      book.author = author;
      book.description = description;
      book.price = price;
      book.quantity = quantity;
      book.image = image;
      await book.save();
      res.status(200).json({ message: "Cập nhật sách thành công", book });
    } else {
      res.status(404).json({ message: "Không tìm thấy sách" });
    }
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error updating book", error: err.message });
  }
});
// Delete book route

router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const book = await Book.findByPk(id);
    if (book) {
      await book.destroy();
      res.status(200).json({ message: "Xóa sách thành công" });
    } else {
      res.status(404).json({ message: "Không tìm thấy sách" });
    }
  } catch (err) {
    res.status(500).json({ message: "Lỗi khi xóa sách", error: err.message });
  }
});

module.exports = router;

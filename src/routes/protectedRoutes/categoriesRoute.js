// Add category route (inside your routes file)

const express = require("express");
const router = express.Router();
const db = require("../../models/index");
const Category = db.categories;
const Book = db.books;

router.post("/", async (req, res) => {
  try {
    const { name, description } = req.body;
    const newCategory = await Category.create({ name, description });
    res.status(201).json({ message: "Đã thêm category", newCategory });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error adding category", error: err.message });
  }
});
// List categorys route

router.get("/", async (req, res) => {
  try {
    const categories = await Category.findAll({
      include: [{ model: Book, as: "books" }],
    });
    res.json(categories);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const category = await Category.findByPk(req.params.id, {
      include: [{ model: Book, as: "books" }],
    });
    if (category) {
      res.json(category);
    } else {
      res.status(404).json({ message: "Không tìm thấy category" });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update category route
router.put("/:id", async (req, res) => {
  const { name, description } = req.body;
  try {
    const category = await Category.findByPk(req.params.id);
    if (category) {
      category.name = name;
      category.description = description;
      await category.save();
      res.json(category);
    } else {
      res.status(404).json({ message: "Không tìm thấy category" });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete category route

router.delete("/:id", async (req, res) => {
  try {
    const category = await Category.findByPk(req.params.id);
    if (category) {
      await category.destroy();
      res.json({ message: "Xóa category thành công" });
    } else {
      res.status(404).json({ message: "Không tìm thấy category" });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Tạo sách mới và thêm vào category
router.post("/:categoryId/books", async (req, res) => {
  const { title, author, description, price, quantity, image } = req.body;
  const { categoryId } = req.params;

  try {
    // Kiểm tra xem category có tồn tại không
    const category = await Category.findByPk(categoryId);
    if (!category) {
      return res.status(404).json({ message: "Category not found" });
    }

    // Tạo sách mới và gán vào category
    const newBook = await Book.create({
      title,
      author,
      description,
      price,
      quantity,
      image,
      categoryId: category.id, // Gán categoryId cho sách
    });

    res.status(201).json({
      message: "Book added to category successfully",
      book: newBook,
    });
  } catch (error) {
    console.error("Error adding book to category:", error);
    res.status(500).json({ error: "Error adding book to category" });
  }
});

// Lấy tất cả sách thuộc category
router.get("/:categoryId/books", async (req, res) => {
  const { categoryId } = req.params;

  try {
    // Tìm category và bao gồm cả sách liên quan
    const category = await Category.findByPk(categoryId, {
      include: [{ model: Book, as: "books" }],
    });

    if (!category) {
      return res.status(404).json({ message: "Category not found" });
    }

    // Trả về danh sách books
    res.json({
      message: `Books in category: ${category.name}`,
      books: category.books,
    });
  } catch (error) {
    console.error("Error fetching books for category:", error);
    res.status(500).json({ error: "Error fetching books for category" });
  }
});

// Thêm sách đã có vào category mà không cần tạo mới
router.put("/:categoryId/books/:bookId", async (req, res) => {
  const { categoryId, bookId } = req.params;

  try {
    // Kiểm tra xem category có tồn tại không
    const category = await Category.findByPk(categoryId);
    if (!category) {
      return res.status(404).json({ message: "Category not found" });
    }

    // Tìm sách theo bookId
    const book = await Book.findByPk(bookId);
    if (!book) {
      return res.status(404).json({ message: "Book not found" });
    }

    // Cập nhật categoryId của sách
    book.categoryId = categoryId;
    await book.save();

    res.json({
      message: "Book added to category successfully",
      book,
    });
  } catch (error) {
    console.error("Error adding existing book to category:", error);
    res.status(500).json({ error: "Error adding existing book to category" });
  }
});

module.exports = router;

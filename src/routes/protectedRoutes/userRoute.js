// routes/userRoutes.js
const express = require("express");
const router = express.Router();
const db = require("../../models/index");
const User = db.users;
const Role = db.roles;
const bcrypt = require("bcrypt");
// Create a new user (POST /users)

router.post("/", async (req, res) => {
  const { username, email, password, enabled, roles } = req.body;
  try {
    // Tạo người dùng mới
    const newUser = await User.create({
      username,
      email,
      password,
      enabled,
    });

    // Gán các roles cho người dùng mới
    if (roles && roles.length > 0) {
      const rolesToAssign = await Role.findAll({
        where: {
          name: roles, // Giả sử roles là một mảng chứa các ID của roles
        },
      });
      await newUser.addRoles(rolesToAssign);
    }
    // Trả về thông tin người dùng cùng với các roles
    const userWithRoles = await User.findByPk(newUser.id, {
      include: [{ model: Role, as: "roles" }],
    });

    res.status(201).json(userWithRoles);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Get all users (GET /users)
router.get("/", async (req, res) => {
  try {
    const users = await User.findAll({
      include: [{ model: Role, as: "roles" }], // Bao gồm các role liên quan
    });
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get user by id (GET /users/:id)
router.get("/:id", async (req, res) => {
  try {
    const userId = req.params.id;
    console.log("ID: ", userId); // Kiểm tra ID

    const user = await User.findByPk(userId, {
      include: [{ model: Role, as: "roles" }],
    });

    if (user) {
      res.json(user);
    } else {
      res.status(404).json({ message: "Không tìm thấy người dùng" });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
// Update user (PUT /users/:id)
router.put("/:id", async (req, res) => {
  const { username, email, password, enabled, roles } = req.body;
  try {
    // Tìm người dùng theo ID
    const user = await User.findByPk(req.params.id, {
      include: [{ model: Role, as: "roles" }],
    });

    if (user) {
      // Cập nhật thông tin người dùng
      user.username = username;
      user.email = email;
      user.password = password;
      user.enabled = enabled;
      await user.save();
      // Cập nhật các roles liên quan
      if (roles) {
        // Xóa các roles hiện tại
        await user.setRoles([]);
        // Thêm các roles mới
        const rolesToAssign = await Role.findAll({
          where: {
            name: roles,
          },
        });
        await user.addRoles(rolesToAssign);
      }
      // Lấy lại thông tin người dùng cùng với các roles mới
      const updatedUser = await User.findByPk(req.params.id, {
        include: [{ model: Role, as: "roles" }],
      });

      res.json(updatedUser);
    } else {
      res.status(404).json({ message: "Không tìm thấy người dùng" });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
// Delete user (DELETE /users/:id)
router.delete("/:id", async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id);
    if (user) {
      await user.destroy();
      res.json({ message: "Xóa người dùng thành công" });
    } else {
      res.status(404).json({ message: "Không tìm thấy người dùng" });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;

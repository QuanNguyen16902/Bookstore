const express = require("express");
const bcrypt = require("bcrypt");
const db = require("../../models/index");
const User = db.users;
const Role = db.roles;
const router = express.Router();
const BlacklistedToken = db.blacklistToken;
// jwt
const jwt = require("jsonwebtoken");
const { jwtSecret } = require("../../config/config");

// Đăng ký người dùng mới (POST /users/register)
router.post("/register", async (req, res) => {
  const { username, email, password, enabled } = req.body;
  try {
    // Kiểm tra xem email có tồn tại chưa
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ message: "Email đã được sử dụng" });
    }

    // Tạo người dùng mới
    const newUser = await User.create({
      username,
      email,
      password,
      enabled,
    });

    // Tìm quyền 'user'
    const userRole = await Role.findOne({ where: { name: "USER" } });

    if (!userRole) {
      return res.status(500).json({ message: "Quyền 'user' không tồn tại" });
    }

    // Gán quyền 'user' cho người dùng mới
    await newUser.addRole(userRole);

    // Trả về thông tin người dùng mới đăng ký (không bao gồm mật khẩu)
    res.status(201).json({
      message: "Đăng ký thành công",
      user: {
        id: newUser.id,
        username: newUser.username,
        email: newUser.email,
        enabled: newUser.enabled,
        roles: ["USER"], // Trả về quyền mặc định là 'user'
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Có lỗi xảy ra khi đăng ký" });
  }
});

// Đăng nhập người dùng (POST /users/login)
router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  try {
    // Tìm người dùng theo email
    const user = await User.findOne({
      where: { email },
      include: [{ model: Role, as: "roles" }],
    });
    if (!user) {
      return res.status(404).json({ message: "Người dùng không tồn tại" });
    }

    // Kiểm tra xem người dùng có được kích hoạt không
    if (!user.enabled) {
      return res
        .status(403)
        .json({ message: "Tài khoản của bạn đã bị vô hiệu hóa" });
    }

    // So sánh mật khẩu
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      // Chỉ log lỗi khi cần thiết cho debugging, nên xóa trước khi triển khai
      console.log("Email:", email);
      console.log("Entered Password:", password);
      console.log("Stored Password Hash:", user.password);

      return res.status(400).json({ message: "Sai thông tin đăng nhập" });
    }

    // Kiểm tra biến môi trường JWT_SECRET
    const jwtSecret = process.env.JWT_SECRET;
    if (!jwtSecret) {
      return res.status(500).json({ message: "JWT_SECRET is not defined" });
    }

    // Tạo token JWT
    const token = jwt.sign(
      { id: user.id, email: user.email },
      jwtSecret,
      { expiresIn: "1h" } // Thay đổi thời gian hết hạn nếu cần
    );

    // Trả về thông tin đăng nhập thành công và token
    res.json({
      message: "Đăng nhập thành công",
      token,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        roles: user.roles ? user.roles.map((role) => role.name) : [],
      },
    });
  } catch (error) {
    console.error("Error during login:", error);
    res.status(500).json({ message: "Có lỗi xảy ra khi đăng nhập" });
  }
});

// Hàm logout
router.post("/logout", async (req, res) => {
  const token = req.headers["authorization"]?.split(" ")[1]; // Lấy token từ header Authorization

  if (!token) {
    return res.status(400).json({ message: "Token missing" });
  }

  // Đưa token vào danh sách đen
  await BlacklistedToken.create({ token });

  res
    .status(200)
    .json({ message: "Đăng xuất thành công, đã thêm token vào blacklist" });
});

module.exports = router;

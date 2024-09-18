const dbConfig = require("../config/db.config.js");

const Sequelize = require("sequelize");
const sequelize = new Sequelize(dbConfig.DB, dbConfig.USER, dbConfig.PASSWORD, {
  host: dbConfig.HOST,
  dialect: dbConfig.dialect,
  operatorsAliases: false,
  logging: console.log,
  pool: {
    max: dbConfig.pool.max,
    min: dbConfig.pool.min,
    acquire: dbConfig.pool.acquire,
    idle: dbConfig.pool.idle,
  },
});

const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

db.users = require("./UserModel.js")(sequelize, Sequelize);
db.carts = require("./CartModel.js")(sequelize, Sequelize);
db.books = require("./BookModel")(sequelize, Sequelize);
db.roles = require("./RoleModel")(sequelize, Sequelize);
db.blacklistToken = require("./BlacklistToken.js")(sequelize, Sequelize);
db.categories = require("./CategoryModel.js")(sequelize, Sequelize);
db.cartItem = require("./CartItemModel.js")(sequelize, Sequelize);
db.order = require("./OrderModel.js")(sequelize, Sequelize);
db.orderItem = require("./OrderItem.js")(sequelize, Sequelize);

// Moi quan he users carts
db.users.hasMany(db.carts, { as: "carts", foreignKey: "userId" });
db.carts.belongsTo(db.users, { foreignKey: "userId", as: "user" });

// mqh books cart
db.carts.belongsToMany(db.books, {
  through: db.cartItem, // Junction table
  as: "books",
  foreignKey: "cartId",
});

db.books.belongsToMany(db.carts, {
  through: db.cartItem, // Junction table
  as: "carts",
  foreignKey: "bookId",
});
db.cartItem.belongsTo(db.books, {
  through: db.cartItem, // Junction table
  as: "books",
  foreignKey: "bookId",
});

db.cartItem.belongsTo(db.carts, {
  through: db.cartItem, // Junction table
  as: "carts",
  foreignKey: "cartId",
});
// mqh users va roles
db.users.belongsToMany(db.roles, {
  through: "users_roles",
  as: "roles",
  foreignKey: "userId",
});

db.roles.belongsToMany(db.users, {
  through: "users_roles",
  as: "users",
  foreignKey: "roleId",
});

// mqh book va category
db.categories.hasMany(db.books, {
  foreignKey: "categoryId",
  as: "books",
});
db.books.belongsTo(db.categories, {
  foreignKey: {
    name: "categoryId",
    allowNull: false,
  },
  as: "categories",
});
// mqh cart và cartItem
db.carts.hasMany(db.cartItem, {
  foreignKey: "cartId",
  as: "cart_items", // Alias được định nghĩa
});

db.cartItem.belongsTo(db.carts, {
  foreignKey: "cartId",
  as: "cart", // Mối quan hệ ngược lại
});

// mqh users và Order
db.order.belongsTo(db.users, {
  foreignKey: "userId",
  as: "user",
});
// mối quan hệ order và order-items
db.order.hasMany(db.orderItem, {
  foreignKey: "orderId",
  as: "order_items",
});

// Them foreign key cho orderItem
db.orderItem.belongsTo(db.order, {
  foreignKey: "orderId",
  as: "order",
});
db.orderItem.belongsTo(db.books, {
  foreignKey: "bookId",
  as: "book",
});

module.exports = db;

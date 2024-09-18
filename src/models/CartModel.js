module.exports = (sequelize, DataTypes) => {
  const Cart = sequelize.define(
    "Cart",
    {
      userId: {
        type: DataTypes.INTEGER,
        allowNull: false, // Mỗi giỏ hàng sẽ thuộc về một người dùng
      },
    },
    {
      tableName: "carts",
      timestamps: true,
    }
  );
  return Cart;
};

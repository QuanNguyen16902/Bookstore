const { DataTypes, DATE } = require("sequelize");
const sequelize = require("./index");

module.exports = (sequelize, DataTypes) => {
  const Order = sequelize.define("Order", {
    totalAmount: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
    status: {
      type: DataTypes.STRING,
      defaultValue: "pending", // Các trạng thái: pending, completed, cancelled
    },
    orderDate: {
      type: DataTypes.DATE,
    },
  });
  return Order;
};

// models/book.js

const { DataTypes } = require("sequelize");
const sequelize = require("./index");

module.exports = (sequelize, DataTypes) => {
  const BlacklistToken = sequelize.define(
    "BlacklistToken",
    {
      token: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
    },
    {
      tableName: "blacklisttokens", // Specify the table name
      timestamps: true, // Disable createdAt and updatedAt fields
    }
  );
  return BlacklistToken;
};

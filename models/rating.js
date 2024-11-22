const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");
const User = require("./user");
const Exhibition = require("./exhibition");

const Rating = sequelize.define("Rating", {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  user_id: {
    type: DataTypes.INTEGER,
    references: {
      model: User,
      key: "id",
    },
    allowNull: false,
  },
  exhibition_id: {
    type: DataTypes.INTEGER,
    references: {
      model: Exhibition,
      key: "id",
    },
    allowNull: false,
  },
  rating: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  comment: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
});

module.exports = Rating;

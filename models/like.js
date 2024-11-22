const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");
const User = require("./user");
const Exhibition = require("./exhibition");

const Like = sequelize.define("Like", {
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
});

module.exports = Like;

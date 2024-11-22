const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");
const User = require("./user");
const Venue = require("./venue");

const VenueLike = sequelize.define("VenueLike", {
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
  venue_id: {
    type: DataTypes.INTEGER,
    references: {
      model: Venue,
      key: "id",
    },
    allowNull: false,
  },
});

module.exports = VenueLike;

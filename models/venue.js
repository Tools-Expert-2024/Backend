const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const Venue = sequelize.define("Venue", {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  place_url: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  place_seq: {
    type: DataTypes.INTEGER,
    unique: true,
    allowNull: false,
  },
  location: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  gps_x: {
    type: DataTypes.DECIMAL(10, 7),
    allowNull: false,
  },
  gps_y: {
    type: DataTypes.DECIMAL(10, 7),
    allowNull: false,
  },
});

module.exports = Venue;

const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");
const Venue = require("./venue");

const ExhibitionDetail = sequelize.define("ExhibitionDetail", {
  seq: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  price: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  contents1: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  contents2: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  url: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  img_url: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  phone: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  place_seq: {
    type: DataTypes.INTEGER,
    references: {
      model: Venue,
      key: "place_seq",
    },
    allowNull: false,
  },
});

module.exports = ExhibitionDetail;

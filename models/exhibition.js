const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");
const ExhibitionDetail = require("./exhibitionDetail");

const Exhibition = sequelize.define("Exhibition", {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  seq: {
    type: DataTypes.INTEGER,
    references: {
      model: ExhibitionDetail,
      key: "seq",
    },
    allowNull: false,
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  start_date: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  end_date: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  area: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  place: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  thumbnail: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  gpsX: {
    type: DataTypes.DECIMAL(10, 7),
    allowNull: false,
  },
  gpsY: {
    type: DataTypes.DECIMAL(10, 7),
    allowNull: false,
  },
});

module.exports = Exhibition;

const Sequelize = require("sequelize");

class Exhibition extends Sequelize.Model {
  static initiate(sequelize) {
    Exhibition.init(
      {
        id: {
          type: Sequelize.INTEGER,
          primaryKey: true,
          autoIncrement: true,
        },
        seq: {
          type: Sequelize.INTEGER,
          allowNull: false,
        },
        title: {
          type: Sequelize.STRING(255),
          allowNull: false,
        },
        start_date: {
          type: Sequelize.DATE,
          allowNull: false,
        },
        end_date: {
          type: Sequelize.DATE,
          allowNull: false,
        },
        area: {
          type: Sequelize.STRING(255),
          allowNull: false,
        },
        place: {
          type: Sequelize.STRING(255),
          allowNull: false,
        },
        thumbnail: {
          type: Sequelize.STRING(255),
          allowNull: false,
        },
        gpsX: {
          type: Sequelize.DECIMAL(10, 7),
          allowNull: false,
        },
        gpsY: {
          type: Sequelize.DECIMAL(10, 7),
          allowNull: false,
        },
      },
      {
        sequelize,
        timestamps: false,
        underscored: false,
        modelName: "Exhibition",
        tableName: "exhibitions",
        paranoid: false,
        charset: "utf8",
        collate: "utf8_general_ci",
      }
    );
  }

  static associate(db) {
    db.Exhibition.belongsTo(db.ExhibitionDetail, {
      foreignKey: "seq",
      targetKey: "seq",
    });
    db.Exhibition.hasMany(db.Like, {
      foreignKey: "exhibition_id",
      sourceKey: "id",
    });
    db.Exhibition.hasMany(db.Rating, {
      foreignKey: "exhibition_id",
      sourceKey: "id",
    });
  }
}

module.exports = Exhibition;

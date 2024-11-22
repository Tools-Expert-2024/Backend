const Sequelize = require("sequelize");

class ExhibitionDetail extends Sequelize.Model {
  static initiate(sequelize) {
    ExhibitionDetail.init(
      {
        seq: {
          type: Sequelize.INTEGER,
          primaryKey: true,
          autoIncrement: true,
        },
        title: {
          type: Sequelize.STRING(255),
          allowNull: false,
        },
        price: {
          type: Sequelize.STRING(255),
          allowNull: false,
        },
        startDate: {
          type: Sequelize.STRING(8),
          allowNull: false,
        },
        endDate: {
          type: Sequelize.STRING(8),
          allowNull: false,
        },
        contents1: {
          type: Sequelize.TEXT,
          allowNull: true,
        },
        contents2: {
          type: Sequelize.TEXT,
          allowNull: true,
        },
        thumbnail: {
          type: Sequelize.STRING(255),
          allowNull: true,
        },
        phone: {
          type: Sequelize.STRING(255),
          allowNull: true,
        },
        place_seq: {
          type: Sequelize.INTEGER,
          allowNull: false,
        },
      },
      {
        sequelize,
        timestamps: false,
        underscored: false,
        modelName: "ExhibitionDetail",
        tableName: "exhibition_details",
        paranoid: false,
        charset: "utf8",
        collate: "utf8_general_ci",
      }
    );
  }

  static associate(db) {
    db.ExhibitionDetail.belongsTo(db.Exhibition, {
      foreignKey: "seq",
      targetKey: "id",
    });
    db.ExhibitionDetail.belongsTo(db.Venue, {
      foreignKey: "place_seq",
      targetKey: "place_seq",
    });
  }
}

module.exports = ExhibitionDetail;

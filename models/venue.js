const Sequelize = require("sequelize");

class Venue extends Sequelize.Model {
  static initiate(sequelize) {
    Venue.init(
      {
        id: {
          type: Sequelize.INTEGER,
          primaryKey: true,
          autoIncrement: true,
        },
        name: {
          type: Sequelize.STRING(255),
          allowNull: false,
        },
        area: {
          type: Sequelize.STRING(255),
          allowNull: false,
        },
        place_url: {
          type: Sequelize.STRING(255),
          allowNull: false,
        },
        place_seq: {
          type: Sequelize.INTEGER,
          unique: true,
          allowNull: false,
        },
        place_addr: {
          type: Sequelize.STRING(255),
          allowNull: false,
        },
        gps_x: {
          type: Sequelize.DECIMAL(10, 7),
          allowNull: true,
        },
        gps_y: {
          type: Sequelize.DECIMAL(10, 7),
          allowNull: true,
        },
      },
      {
        sequelize,
        timestamps: false,
        underscored: false,
        modelName: "Venue",
        tableName: "venues",
        paranoid: false,
        charset: "utf8",
        collate: "utf8_general_ci",
      }
    );
  }

  static associate(db) {
    db.Venue.hasMany(db.VenueLike, { foreignKey: "venue_id", sourceKey: "id" });
    db.Venue.hasMany(db.ExhibitionDetail, {
      foreignKey: "place_seq",
      sourceKey: "place_seq",
    });
  }
}

module.exports = Venue;

const Sequelize = require("sequelize");

class VenueLike extends Sequelize.Model {
  static initiate(sequelize) {
    VenueLike.init(
      {
        id: {
          type: Sequelize.INTEGER,
          primaryKey: true,
          autoIncrement: true,
        },
        user_id: {
          type: Sequelize.INTEGER,
          allowNull: false,
        },
        venue_id: {
          type: Sequelize.INTEGER,
          allowNull: false,
        },
      },
      {
        sequelize,
        timestamps: false,
        underscored: false,
        modelName: "VenueLike",
        tableName: "venue_likes",
        paranoid: false,
        charset: "utf8",
        collate: "utf8_general_ci",
      }
    );
  }

  static associate(db) {
    db.VenueLike.belongsTo(db.User, { foreignKey: "user_id", targetKey: "id" });
    db.VenueLike.belongsTo(db.Venue, {
      foreignKey: "venue_id",
      targetKey: "id",
    });
  }
}

module.exports = VenueLike;

const Sequelize = require("sequelize");

class Rating extends Sequelize.Model {
  static initiate(sequelize) {
    Rating.init(
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
        exhibition_id: {
          type: Sequelize.INTEGER,
          allowNull: false,
        },
        rating: {
          type: Sequelize.INTEGER,
          allowNull: false,
        },
        comment: {
          type: Sequelize.TEXT,
          allowNull: false,
        },
      },
      {
        sequelize,
        timestamps: false,
        underscored: false,
        modelName: "Rating",
        tableName: "ratings",
        paranoid: false,
        charset: "utf8",
        collate: "utf8_general_ci",
      }
    );
  }

  static associate(db) {
    db.Rating.belongsTo(db.User, { foreignKey: "user_id", targetKey: "id" });
    db.Rating.belongsTo(db.Exhibition, {
      foreignKey: "exhibition_id",
      targetKey: "id",
    });
  }
}

module.exports = Rating;

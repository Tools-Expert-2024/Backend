const Sequelize = require("sequelize");

class Like extends Sequelize.Model {
  static initiate(sequelize) {
    Like.init(
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
      },
      {
        sequelize,
        timestamps: false,
        underscored: false,
        modelName: "Like",
        tableName: "likes",
        paranoid: false,
        charset: "utf8",
        collate: "utf8_general_ci",
      }
    );
  }

  static associate(db) {
    db.Like.belongsTo(db.User, { foreignKey: "user_id", targetKey: "id" });
    db.Like.belongsTo(db.Exhibition, {
      foreignKey: "exhibition_id",
      targetKey: "id",
    });
  }
}

module.exports = Like;

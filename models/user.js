const Sequelize = require("sequelize");

class Users extends Sequelize.Model {
  static initiate(sequelize) {
    Users.init(
      {
        idx: {
          type: Sequelize.INTEGER,
          primaryKey: true,
          allowNull: false,
          autoIncrement: true
        },
        id: {
          type: Sequelize.STRING,
          primaryKey: true,
          allowNull: false
        },
        password: {
          type: Sequelize.STRING,
          allowNull: false
        },
        name: {
          type: Sequelize.STRING,
          allowNull: false
        },
        user_name: {
          type: Sequelize.STRING,
          allowNull: false
        },
        email: {
          type: Sequelize.STRING,
          allowNull: false,
          validate: {
            isEmail: true
          }
        },
        phone: {
          type: Sequelize.STRING,
          allowNull: true
        },
        is_admin: {
          type: Sequelize.BOOLEAN,
          defaultValue: false
        },
        regdate: {
          type: Sequelize.DATE,
          defaultValue: Sequelize.NOW
        },

      }, {
      sequelize, // Sequelize 인스턴스 전달
      modelName: "Users",
      tableName: "users",
      timestamps: false,
    }
    );
  }

  static associate(db) {
    db.Users.hasMany(db.Like, { foreignKey: "user_id", sourceKey: "id" });
    db.Users.hasMany(db.Rating, { foreignKey: "user_id", sourceKey: "id" });
    db.Users.hasMany(db.VenueLike, { foreignKey: "user_id", sourceKey: "id" });
  }
}

module.exports = Users;

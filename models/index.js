const Sequelize = require("sequelize");
//const User = require("./user");
//const Comment = require("./comment");

const env = process.env.NODE_ENV || "development";
const config = require("../config/config")[env];
const db = {};

const sequelize = new Sequelize(
  config.database,
  config.username,
  config.password,
  config
);

db.sequelize = sequelize;

//db.User = User;
//db.Comment = Comment;

//User.initiate(sequelize);
//Comment.initiate(sequelize);

//User.associate(db);
//Comment.associate(db);

const { Sequelize } = require("sequelize");
const sequelize = require("../config/database");

const User = require("./user");
const Exhibition = require("./exhibition");
const ExhibitionDetail = require("./exhibitionDetail");
const Venue = require("./venue");
const Like = require("./like");
const Rating = require("./rating");
const VenueLike = require("./venueLike");

// 모델 간의 관계 설정
User.hasMany(Like, { foreignKey: "user_id" });
Like.belongsTo(User, { foreignKey: "user_id" });

User.hasMany(Rating, { foreignKey: "user_id" });
Rating.belongsTo(User, { foreignKey: "user_id" });

User.hasMany(VenueLike, { foreignKey: "user_id" });
VenueLike.belongsTo(User, { foreignKey: "user_id" });

Exhibition.hasMany(Like, { foreignKey: "exhibition_id" });
Like.belongsTo(Exhibition, { foreignKey: "exhibition_id" });

Exhibition.hasMany(Rating, { foreignKey: "exhibition_id" });
Rating.belongsTo(Exhibition, { foreignKey: "exhibition_id" });

Venue.hasMany(VenueLike, { foreignKey: "venue_id" });
VenueLike.belongsTo(Venue, { foreignKey: "venue_id" });

ExhibitionDetail.belongsTo(Venue, { foreignKey: "place_seq" });
Exhibition.belongsTo(ExhibitionDetail, { foreignKey: "seq" });

db.User = User;
db.Exhibition = Exhibition;
db.ExhibitionDetail = ExhibitionDetail;
db.Venue = Venue;
db.Like = Like;
db.Rating = Rating;
db.VenueLike = VenueLike;

module.exports = db;

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

const User = require("./user");
const Exhibition = require("./exhibition");
const ExhibitionDetail = require("./exhibitionDetail");
const Venue = require("./venue");
const Like = require("./like");
const Rating = require("./rating");
const VenueLike = require("./venueLike");

db.User = User;
db.Exhibition = Exhibition;
db.ExhibitionDetail = ExhibitionDetail;
db.Venue = Venue;
db.Like = Like;
db.Rating = Rating;
db.VenueLike = VenueLike;

User.initiate(sequelize);
Exhibition.initiate(sequelize);
ExhibitionDetail.initiate(sequelize);
Venue.initiate(sequelize);
Like.initiate(sequelize);
Rating.initiate(sequelize);
VenueLike.initiate(sequelize);

User.associate(db);
Exhibition.associate(db);
ExhibitionDetail.associate(db);
Venue.associate(db);
Like.associate(db);
Rating.associate(db);
VenueLike.associate(db);

module.exports = db;

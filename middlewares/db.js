const { Sequelize } = require('sequelize');

// 환경 변수에서 DATABASE_URL 가져오기
const databaseUrl = process.env.DATABASE_URL;

if (!databaseUrl) {
  throw new Error('DATABASE_URL is not defined. Please check your .env file.');
}

// URL 수동 분해
const dbConfig = new URL(databaseUrl);

// Sequelize 객체 생성
const sequelize = new Sequelize(dbConfig.pathname.slice(1), dbConfig.username, dbConfig.password, {
  host: dbConfig.hostname,
  port: dbConfig.port || 3306,
  dialect: 'mysql',
  logging: console.log, // SQL 로그 활성화
  pool: {
    max: 10, // 최대 연결 수
    min: 0, // 최소 연결 수
    acquire: 30000, // 연결을 얻기 위한 최대 시간(ms)
    idle: 10000, // 연결 유휴 시간(ms)
  },
});

module.exports = sequelize;

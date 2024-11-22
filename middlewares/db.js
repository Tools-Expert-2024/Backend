const mysql = require('mysql2/promise');
const url = require('url');

// MySQL Connection Pool 설정
const dbUrl = process.env.DATABASE_URL;
const connectionParams = url.parse(dbUrl);
const [username, password] = connectionParams.auth.split(':');

const pool = mysql.createPool({
  host: connectionParams.hostname,
  port: connectionParams.port || 3306,
  user: username,
  password: password,
  database: connectionParams.pathname.replace('/', ''),
  timezone: 'Z',
  waitForConnections: true,
  connectionLimit: 10
});

module.exports = pool;

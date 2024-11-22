const express = require('express');
const ejs = require('ejs');
const app = express();
var bodyParser = require('body-parser');
var session = require('express-session');
require('dotenv').config();
const mysql = require('mysql2');
const url = require('url');
const { format } = require('date-fns');
const flash = require('connect-flash');

//mySQL
const req = require('express/lib/request');
const dbUrl = process.env.DATABASE_URL;
const connectionParams = url.parse(dbUrl);
const [username, password] = connectionParams.auth.split(':');
const connection = mysql.createConnection({
  host: connectionParams.hostname,
  port: connectionParams.port || 3306,
  user: username,
  password: password,
  database: connectionParams.pathname.replace('/', ''),
  timezone: 'Z',
});

connection.connect((err) => {
  if (err) console.error('MySQL 연결 실패:', err);
  console.log('MySQL에 성공적으로 연결되었습니다.');
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, '0.0.0.0', () => {
  console.log(Server running on port ${ PORT });
});

//set
app.set('view engine', 'ejs');
app.set('views', './views');

//use
app.use(flash());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(__dirname + '/public'));
app.use(session({ secret: 'kimt919', resave: true, saveUninitialized: true }));
app.use((req, res, next) => {
  res.locals.user_id = '';
  res.locals.user_pw = '';
  res.locals.user_name = '';
  res.locals.user_phone = '';
  res.locals.user_email = '';
  res.locals.is_admin = '0';
  if (req.session.member) {
    res.locals.user_id = req.session.member.user_id;
    res.locals.user_name = req.session.member.user_name;
    res.locals.user_pw = req.session.member.user_pw;
    res.locals.user_phone = req.session.member.user_phone;
    res.locals.user_email = req.session.member.user_email;
    res.locals.is_admin = req.session.member.is_admin;
  }
  next();
});

//get
app.get('/', (req, res) => {
  res.render('index'); // ./views/index.ejs
});
app.get('/login', (req, res) => {
  res.render('login');
});
app.get('/profile', (req, res) => {
  res.render('profile');
});

app.get('/contact', (req, res) => {
  if (req.session.member && req.session.member.user_id) {
    // 로그인된 상태
    res.render('contact');
  } else {
    // 로그인되지 않은 상태
    res.send('<script>alert("로그인 후 이용 가능"); location.href = "/login"</script>')
  }
});

app.get('/register', (req, res) => {
  res.render('register');
});

app.get('/contactList', (req, res) => {
  let sql = 'select * from contacts';
  connection.query(sql, (err, results) => {
    if (err) throw err;
    res.render('contactList', {
      lists: results,
      is_admin: req.session.member.is_admin,
      user_id: req.session.member.user_id
    });
  });
});

//문의하기
//로그인 후 기능으로 만들기
app.post('/contactProc', (req, res) => {
  const user_id = req.session.member.user_id;
  const user_name = req.session.member.user_name;
  const contactTitle = req.body.contactTitle;
  const details = req.body.details;

  const date = new Date();
  const sql = INSERT INTO contacts (user_id, user_name, contactTitle, details, regdate) VALUES(?, ?, ?, ?, ?);
  connection.query(sql, [user_id, user_name, contactTitle, details, format(date, 'yyyy-MM-dd HH:mm:ss')], (err, results) => {
    if (err) {
      console.error('데이터베이스 저장 오류:', err);
      res.status(500).send('데이터베이스 오류');
      return;
    }
    res.send("<script> alert('등록완료'); location.href='/' ; </script>");
  });
});

//문의삭제
app.get('/contactDelete', (req, res) => {
  let idx = req.query.idx;

  const sql = DELETE FROM contacts WHERE idx = ?; // SQL 쿼리

  connection.query(sql, [idx], (err, results) => {
    if (err) {
      console.error('데이터베이스 삭제 오류:', err);
      res.status(500).send('데이터베이스 오류');
      return;
    }
    res.send("<script> alert('삭제완료'); location.href='/contactList' ; </script>");
  });
});

//회원가입
app.post('/registerProc', (req, res) => {
  const id = req.body.reg_id;
  const password = req.body.reg_pw;
  const name = req.body.reg_name;
  const phone = req.body.reg_phone;
  const email = req.body.reg_email;

  const sql = INSERT INTO member (user_name, user_phone, user_email, user_id, user_pw, regdate) VALUES(?, ?, ?, ?, ?, now());
  connection.query(sql, [name, phone, email, id, password], (err, results) => {
    if (err) {
      console.error('데이터베이스 저장 오류:', err);
      res.status(500).send('데이터베이스 오류');
      return;
    }
    res.send("<script> alert('회원가입 완료'); location.href='/login' ; </script>");
  });
});

//로그인
app.post('/loginProc', (req, res) => {
  const user_id = req.body.user_id;
  const user_pw = req.body.user_pw;

  let sql = SELECT * FROM member WHERE user_id =? and user_pw =?;

  connection.query(sql, [user_id, user_pw], (err, results) => {
    if (err) {
      console.error('오류:', err);
      return;
    }

    if (results.length) {
      req.session.member = results[0];
      console.log(req.session.member.is_admin)
      res.send("<script>alert('로그인 성공'); location.href='/profile';</script>");
    } else {
      res.send("<script>alert('미등록 정보'); location.href='/login';</script>");
    }
  });
});

//로그아웃
app.get('/logout', (req, res) => {
  req.session.destroy();
  res.send("<script>alert('로그아웃'); location.href='/';</script>");
});
const express = require('express');
const router = express.Router();
const pool = require('./db');

// 로그인 처리
router.post('/', async (req, res) => {
  const { id, password } = req.body;


  try {
    const [rows] = await pool.query(
      'SELECT * FROM user WHERE id = ? AND password = ?',
      [id, password]
    );

    if (rows.length > 0) {
      req.session.user = rows[0];
      res.send("<script>alert('로그인 성공'); location.href='/';</script>");
    } else {
      res.send("<script>alert('미등록 정보'); location.href='/login';</script>");
    }
  } catch (err) {
    console.error('오류:', err);
    res.status(500).send('Internal Server Error');
  }
});


module.exports = router;

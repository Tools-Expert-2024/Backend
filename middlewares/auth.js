const express = require('express');
const router = express.Router();
const pool = require('../middlewares/db');

// 로그인 처리
router.post('/login', async (req, res) => {
  const { user_id, user_pw } = req.body;

  try {
    const [rows] = await pool.query(
      'SELECT * FROM member WHERE user_id = ? AND user_pw = ?',
      [user_id, user_pw]
    );

    if (rows.length > 0) {
      req.session.member = rows[0];
      res.send("<script>alert('로그인 성공'); location.href='/profile';</script>");
    } else {
      res.send("<script>alert('미등록 정보'); location.href='/login';</script>");
    }
  } catch (err) {
    console.error('오류:', err);
    res.status(500).send('Internal Server Error');
  }
});

// 로그아웃 처리
router.get('/logout', (req, res) => {
  req.session.destroy();
  res.send("<script>alert('로그아웃'); location.href='/';</script>");
});

module.exports = router;

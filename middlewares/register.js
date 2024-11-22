const express = require('express');
const router = express.Router();
const pool = require('../middlewares/db');

// 회원가입 처리
router.post('/register', async (req, res) => {
  const { reg_id, reg_pw, reg_name, reg_phone, reg_email } = req.body;

  try {
    await pool.query(
      'INSERT INTO member (user_name, user_phone, user_email, user_id, user_pw, regdate) VALUES (?, ?, ?, ?, ?, now())',
      [reg_name, reg_phone, reg_email, reg_id, reg_pw]
    );
    res.send("<script>alert('회원가입 완료'); location.href='/login';</script>");
  } catch (err) {
    console.error('회원가입 오류:', err);
    res.status(500).send('Internal Server Error');
  }
});

module.exports = router;

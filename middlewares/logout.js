const express = require('express');
const router = express.Router();
const pool = require('./db');

// 로그아웃 처리
router.get('/', (req, res) => {
  req.session.destroy();
  res.send("<script>alert('로그아웃'); location.href='/';</script>");
});

module.exports = router;

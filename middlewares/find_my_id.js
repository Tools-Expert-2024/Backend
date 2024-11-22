const express = require('express');
const router = express.Router();
const pool = require('./db'); // 데이터베이스 연결

// 아이디/비밀번호 찾기
router.post('/', async (req, res) => {
  const { name, phone, email } = req.body;

  try {
    // 데이터베이스에서 이름, 전화번호, 이메일로 사용자 조회
    const [rows] = await pool.query(
      'SELECT id, password FROM user WHERE name = ? AND phone = ? AND email = ?',
      [name, phone, email]
    );

    if (rows.length > 0) {
      // 사용자 정보가 존재하는 경우, ID와 비밀번호를 반환
      const { id, password } = rows[0];
      res.send(`<h3>아이디: ${id}</h3><h3>비밀번호: ${password}</h3>`);
    } else {
      // 사용자 정보가 없으면 에러 메시지 반환
      res.send('<script>alert("정보가 일치하지 않습니다."); location.href="/find_my_id";</script>');
    }
  } catch (err) {
    console.error('오류:', err);
    res.status(500).send('Internal Server Error');
  }
});

module.exports = router;

const express = require('express');
const router = express.Router();
const { Users } = require('../models'); // User 모델 가져오기

// 로그인 처리
router.post('/', async (req, res) => {
  const { id, password } = req.body;

  try {
    // Sequelize를 사용해 사용자 찾기
    const user = await Users.findOne({
      where: {
        id: id,
        password: password, // 단순한 비교를 위해 password를 사용했지만, 해싱 필요
      },
    });

    if (user) {
      // 세션에 사용자 정보 저장
      req.session.user = user;
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

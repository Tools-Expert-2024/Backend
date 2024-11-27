const express = require("express");
const router = express.Router();
const { Users } = require("../models"); // User 모델 가져오기

router.post("/", async (req, res) => {


  const {
    reg_id,
    reg_pw,
    reg_name,
    reg_user_name,
    reg_email,
    reg_phone,
    reg_is_admin,
  } = req.body;

  try {
    // User 모델을 사용해 데이터 삽입
    await Users.create({
      id: reg_id,
      password: reg_pw,
      name: reg_name,
      user_name: reg_user_name,
      email: reg_email,
      phone: reg_phone,
      is_admin: reg_is_admin || 0,
      regdate: new Date(),
    });

    res.send(
      '<script>alert("회원가입이 완료되었습니다."); location.href="/login";</script>'
    );
  } catch (err) {
    console.error("회원가입 오류:", err);
    res.status(500).send("Internal Server Error");
  }
});

module.exports = router;


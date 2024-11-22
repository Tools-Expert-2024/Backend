const express = require("express");
const router = express.Router();
const pool = require("./db");

router.post("/", async (req, res) => {
  const { reg_id, reg_pw, reg_name, reg_user_name, reg_email, reg_phone, reg_is_admin } = req.body;

  try {
    await pool.query(
      "INSERT INTO user (id, password, name, user_name, email, phone, is_admin, regdate) VALUES (?, ?, ?, ?, ?, ?, ?, now())",
      [reg_id, reg_pw, reg_name, reg_user_name, reg_email, reg_phone, reg_is_admin || 0]
    );
    res.send('<script>alert("회원가입 완료"); location.href="/login";</script>');
  } catch (err) {
    console.error("회원가입 오류:", err);
    res.status(500).send("Internal Server Error");
  }
});

module.exports = router;

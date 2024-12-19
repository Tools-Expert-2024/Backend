/**
 * @swagger
 * tags:
 *   name: Auth
 *   description: Authentication and user management
 */

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: User login
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               id:
 *                 type: string
 *                 description: User ID
 *               password:
 *                 type: string
 *                 description: User password
 *     responses:
 *       200:
 *         description: Login successful
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /api/auth/logout:
 *   get:
 *     summary: User logout
 *     tags: [Auth]
 *     responses:
 *       200:
 *         description: Logout successful
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /api/auth/register:
 *   post:
 *     summary: User registration
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               id:
 *                 type: string
 *                 description: User ID
 *               password:
 *                 type: string
 *                 description: User password
 *               name:
 *                 type: string
 *                 description: User name
 *               user_name:
 *                 type: string
 *                 description: User username
 *               email:
 *                 type: string
 *                 description: User email
 *               phone:
 *                 type: string
 *                 description: User phone number
 *     responses:
 *       200:
 *         description: Registration successful
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /api/auth/find:
 *   post:
 *     summary: Find user ID and password
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: User name
 *               phone:
 *                 type: string
 *                 description: User phone number
 *               email:
 *                 type: string
 *                 description: User email
 *     responses:
 *       200:
 *         description: User found
 *       404:
 *         description: User not found
 *       500:
 *         description: Internal server error
 */
const express = require("express");
const router = express.Router();
const { sequelize } = require("../../../models"); // User 모델 가져오기

const Users = sequelize.models.Users;
// 로그인 처리
router.post("/login", async (req, res) => {
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
      res.send(
        "<script>alert('미등록 정보'); location.href='/login';</script>"
      );
    }
  } catch (err) {
    console.error("오류:", err);
    res.status(500).send("Internal Server Error");
  }
});

// 로그아웃 처리
router.get("/logout", (req, res) => {
  req.session.destroy();
  res.send("<script>alert('로그아웃'); location.href='/';</script>");
});

//회원가입
router.post("/register", async (req, res) => {
  const { id, password, name, user_name, email, phone } = req.body;

  try {
    // User 모델을 사용해 데이터 삽입
    await Users.create({
      id: id,
      password: password,
      name: name,
      user_name: user_name,
      email: email,
      phone: phone,
    });

    res.send(
      '<script>alert("회원가입이 완료되었습니다."); location.href="/login";</script>'
    );
  } catch (err) {
    console.error("회원가입 오류:", err);
    res.status(500).send("Internal Server Error");
  }
});

// 아이디/비밀번호 찾기
router.post("/find", async (req, res) => {
  const { name, phone, email } = req.body;

  try {
    // 데이터베이스에서 이름, 전화번호, 이메일로 사용자 조회
    const [rows] = await Users.query(
      "SELECT id, password FROM user WHERE name = ? AND phone = ? OR email = ?",
      [name, phone, email]
    );

    if (rows.length > 0) {
      // 사용자 정보가 존재하는 경우, ID와 비밀번호를 반환
      const { id, password } = rows[0];
      res.send(`<h3>아이디: ${id}</h3><h3>비밀번호: ${password}</h3>`);
    } else {
      // 사용자 정보가 없으면 에러 메시지 반환
      res.send(
        '<script>alert("정보가 일치하지 않습니다."); location.href="/find_my_id";</script>'
      );
    }
  } catch (err) {
    console.error("오류:", err);
    res.status(500).send("Internal Server Error");
  }
});

module.exports = router;

// db.js
const db = require("../models"); // 데이터베이스 연결 설정
const jwt = require("jsonwebtoken");

const getUserIsAdminById = async (userId) => {
  const isAdmin = await db.query("SELECT is_admin FROM users WHERE id = ?", [
    userId,
  ]);
  return isAdmin; // true or false
};

export const authorize = () => async (req, res, next) => {
  try {
    // 사용자 ID가 요청에 있는지 확인
    const userId = req.userId;
    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    // 데이터베이스에서 역할 조회
    const isAdmin = await getUserIsAdminById(userId);
    if (!isAdmin) {
      return res.status(403).json({ message: "Forbidden" });
    }

    next();
  } catch (error) {
    console.error("Authorization error:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

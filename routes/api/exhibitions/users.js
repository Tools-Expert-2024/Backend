
const express = require('express');
const router = express.Router();

// POST /api/users/register - 회원가입
router.post('/register', (req, res) => {
  // todo : 회원가입 처리
});

// POST /api/users/login - 로그인
router.post('/login', (req, res) => {
  // todo : 로그인 처리
});

// POST /api/users/find-id - 아이디 찾기
router.post('/find-id', (req, res) => {
  // todo : 아이디 찾기 처리
});

// POST /api/users/reset-password - 비밀번호 찾기
router.post('/reset-password', (req, res) => {
  // todo : 비밀번호 찾기 처리
});

// DELETE /api/users/:id - 회원 탈퇴
router.delete('/:id', (req, res) => {
  // todo : 회원 탈퇴 처리
});

module.exports = router;

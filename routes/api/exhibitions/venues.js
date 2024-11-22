
const express = require('express');
const router = express.Router();

// POST /api/venues/:id/like - 전시장 좋아요
router.post('/:id/like', (req, res) => {
  // todo : 전시장 좋아요 추가 처리
});

// DELETE /api/venues/:id/like - 전시장 좋아요 취소
router.delete('/:id/like', (req, res) => {
  // todo : 전시장 좋아요 취소 처리
});

// GET /api/venues/:id/exhibitions - 좋아요한 전시장 내 진행 중인 전시 리스트
router.get('/:id/exhibitions', (req, res) => {
  // todo : 좋아요한 전시장 진행 중인 전시 리스트 응답
});

// DELETE /api/venues/:id/exhibitions - 전시장에서 진행 중인 전시 리스트 중 취소
router.delete('/:id/exhibitions', (req, res) => {
  // todo : 진행 중인 전시 리스트 중 취소 처리
});

module.exports = router;

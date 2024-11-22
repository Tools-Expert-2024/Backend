
const express = require('express');
const router = express.Router();

// POST /api/exhibitions/:id/like - 전시회 좋아요
router.post('/:id/like', (req, res) => {
  // todo : 전시회 좋아요 추가 처리
});

// DELETE /api/exhibitions/:id/like - 전시회 좋아요 취소
router.delete('/:id/like', (req, res) => {
  // todo : 전시회 좋아요 취소 처리
});

module.exports = router;

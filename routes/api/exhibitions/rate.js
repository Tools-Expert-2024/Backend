
const express = require('express');
const router = express.Router();

// POST /api/exhibitions/:id/rate - 별점 및 댓글 작성
router.post('/:id/rate', (req, res) => {
  // todo : 별점 및 댓글 작성 처리
});

// PUT /api/exhibitions/:id/rate - 댓글 수정
router.put('/:id/rate', (req, res) => {
  // todo : 댓글 수정 처리
});

module.exports = router;

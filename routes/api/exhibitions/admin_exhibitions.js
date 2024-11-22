
const express = require('express');
const router = express.Router();

// POST /api/admin/exhibitions - 전시회 추가
router.post('/', (req, res) => {
  // todo : 전시회 추가 처리
});

// DELETE /api/admin/exhibitions/:id - 전시회 삭제
router.delete('/:id', (req, res) => {
  // todo : 전시회 삭제 처리
});

// PUT /api/admin/exhibitions/:id - 전시회 수정
router.put('/:id', (req, res) => {
  // todo : 전시회 수정 처리
});

module.exports = router;

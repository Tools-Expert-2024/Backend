
const express = require('express');
const router = express.Router();

// GET /api/exhibitions/:id/ratings - 별점 통계
router.get('/:id/ratings', (req, res) => {
  // todo : 별점 통계 응답
});

module.exports = router;

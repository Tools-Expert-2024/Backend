const express = require("express");
const { sequelize } = require("../../../models");

// - `POST /api/venues/:id/like`: 전시장 좋아요
// - `DELETE /api/venues/:id/like`: 전시장 좋아요 취소
// - `GET /api/venues/:id/exhibitions`: 좋아요한 전시장에서 진행 중인 전시 리스트
// - `DELETE /api/venues/:id/exhibitions`: 좋아요한 전시장에서 진행 중인 전시 리스트 중 취소
const router = express.Router();

// POST /api/venues/:id/like: 전시장 좋아요
router.post("/:id/like", (req, res) => {
  // 좋아요 처리 로직
  sequelize.models.VenueLike.create({
    venue_id: req.params.id,
    user_id: req.body.userId,
  })
    .then((result) => {
      res.send("Like added");
    })
    .catch((error) => {
      console.error(error);
      res.status(500).json({ message: "Internal Server Error" });
    });
});

// DELETE /api/venues/:id/like: 전시장 좋아요 취소
router.delete("/:id/like", (req, res) => {
  // 좋아요 취소 처리 로직
  sequelize.models.VenueLike.destroy({
    where: {
      venue_id: req.params.id,
      user_id: req.body.userId,
    },
  })
    .then((result) => {
      res.send("Like removed");
    })
    .catch((error) => {
      console.error(error);
      res.status(500).json({ message: "Internal Server Error" });
    });
});

// GET /api/venues/:id/exhibitions: 좋아요한 전시장에서 진행 중인 전시 리스트
router.get("/:id/exhibitions", (req, res) => {
  // 전시 리스트 조회 로직
  sequelize.models.Exhibition.findAll({
    where: {
      venue_id: req.params.id,
      user_id: req.body.userId,
      startDate: { [sequelize.Sequelize.Op.lte]: req.body.startDate },
      endDate: { [sequelize.Sequelize.Op.gte]: req.body.endDate },
    },
  })
    .then((result) => {
      res.json(result);
    })
    .catch((error) => {
      console.error(error);
      res.status(500).json({ message: "Internal Server Error" });
    });
  res.send("Exhibition list");
});

// DELETE /api/venues/:id/exhibitions: 좋아요한 전시장에서 진행 중인 전시 리스트 중 취소
router.delete("/:id/exhibitions", (req, res) => {
  // 전시 리스트 중 취소 처리 로직
  res.send("Exhibition removed");
});

module.exports = router;

// - `POST /api/admin/exhibitions`: 전시회 추가
// - `DELETE /api/admin/exhibitions/:id`: 전시회 삭제
// - `PUT /api/admin/exhibitions/:id`: 전시회 수정

const express = require("express");
const { sequelize } = require("../../../models");
const router = express.Router();

// POST /api/admin/exhibitions - 전시회 추가
router.post("/", (req, res) => {
  // 전시회 추가 처리
  const {
    title,
    startDate,
    endDate,
    price,
    contents1,
    contents2,
    thumbnail,
    phone,
    place_seq,
  } = req.body;
  sequelize.models.ExhibitionDetail.create({
    title,
    startDate,
    endDate,
    price,
    contents1,
    contents2,
    thumbnail,
    phone,
    place_seq,
  })
    .then((result) => {
      res.send("전시회 상세 추가 완료");
    })
    .catch((error) => {
      console.error(error);
      res.status(500).json({ message: "Internal Server Error" });
    });
});

// DELETE /api/admin/exhibitions/:id - 전시회 삭제
router.delete("/:id", (req, res) => {
  // 전시회 삭제 처리
  const { id } = req.params;
  Promise.all([
    sequelize.models.ExhibitionDetail.destroy({ where: { seq: id } }),
    sequelize.models.Exhibition.destroy({ where: { id: id } }),
  ])
    .then(() => {
      res.send("전시회 삭제 완료");
    })
    .catch((error) => {
      console.error(error);
      res.status(500).json({ message: "Internal Server Error" });
    });
});
// PUT /api/admin/exhibitions/:id - 전시회 수정
router.put("/:id", (req, res) => {
  // todo : 전시회 수정 처리
  sequelize.models.ExhibitionDetail.update(req.body, {
    where: { seq: req.params.id },
  })
    .then((result) => {
      res.send("전시회 수정 완료");
    })
    .catch((error) => {
      console.error(error);
      res.status(500).json({ message: "Internal Server Error" });
    });
});

module.exports = router;

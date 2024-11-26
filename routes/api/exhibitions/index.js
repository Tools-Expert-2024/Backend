const express = require("express");
const { sequelize } = require("../../../models");
const router = express.Router();
const { Op } = require("sequelize");
const {
  getExternalAPIExhibitions,
} = require("../../../lib/getExternalAPIExhibitions");
// - `GET /api/exhibitions`: 전시회 리스트
// - `GET /api/exhibitions/search`: 전시회 검색
// - `GET /api/exhibitions/:id`: 전시회 상세 정보
// - `POST /api/exhibitions/:id/like`: 전시회 좋아요
// - `DELETE /api/exhibitions/:id/like`: 전시회 좋아요 취소
// - `POST /api/exhibitions/:id/rate`: 전시회 별점 및 댓글 작성
// - `PUT /api/exhibitions/:id/rate`: 전시회 댓글 수정
// - `GET /api/exhibitions/:id/ratings`: 전시회 별점 통계
router.get("/", (req, res) => {
  // 전시회 리스트
  const { startDate, endDate } = req.body;
  sequelize.models.Exhibition.findAll({
    where: {
      [Op.or]: [
        {
          start_date: {
            [Op.gte]: endDate,
          },
          end_date: {
            [Op.lte]: startDate,
          },
        },
        {
          start_date: {
            [Op.between]: [startDate, endDate],
          },
        },
        {
          end_date: {
            [Op.between]: [startDate, endDate],
          },
        },
      ],
    },
  })
    .then((result) => {
      res.json(result);
    })
    .catch((error) => {
      console.error(error);
      res.status(500).json({ message: "Internal Server Error" });
    });
});

router.get("/search", (req, res) => {
  // 전시회 검색
  res.send("전시회 검색");
});

router.get("/getExternal", (req, res) => {
  startDate = req.body.startDate;
  endDate = req.body.endDate;
  getExternalAPIExhibitions(startDate, endDate, 1)
    .then((result) => {
      res.json(result);
    })
    .catch((error) => {
      console.error(error);
      res.status(500).json({ message: "Internal Server Error" });
    });
});

router.get("/:id", (req, res) => {
  // 전시회 상세 정보
  sequelize.models.ExhibitionDetail.findOne({
    where: {
      seq: req.params.id,
    },
  })
    .then((result) => {
      res.json(result);
    })
    .catch((error) => {
      console.error(error);
      res.status(500).json({ message: "Internal Server Error" });
    });
});

router.post("/:id/like", (req, res) => {
  // 전시회 좋아요
  sequelize.models.Like.create({
    exhibition_id: req.params.id,
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

router.delete("/:id/like", (req, res) => {
  // 전시회 좋아요 취소
  sequelize.models.Like.destroy({
    where: {
      exhibition_id: req.params.id,
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

router.post("/:id/rate", (req, res) => {
  // 전시회 별점 및 댓글 작성
  sequelize.models.ExhibitionRating.create({
    exhibition_id: req.params.id,
    user_id: req.body.userId,
    rating: req.body.rating,
    comment: req.body.comment,
  })
    .then((result) => {
      res.send("Rating added");
    })
    .catch((error) => {
      console.error(error);
      res.status(500).json({ message: "Internal Server Error" });
    });
});

router.put("/:id/rate", (req, res) => {
  // 전시회 댓글 수정
  sequelize.models.Rating.update(req.body, {
    where: { exhibition_id: req.params.id, user_id: req.body.userId },
  })
    .then((result) => {
      res.send("Rating updated");
    })
    .catch((error) => {
      console.error(error);
      res.status(500).json({ message: "Internal Server Error" });
    });
  res.send(`전시회 댓글 수정: ${req.params.id}`);
});

router.get("/:id/ratings", (req, res) => {
  // 전시회 별점 통계
  sequelize.models.Rating.findAll({
    where: {
      exhibition_id: req.params.id,
    },
    attributes: [[sequelize.fn("avg", sequelize.col("rating")), "avgRating"]],
  })
    .then((result) => {
      res.json(result);
    })
    .catch((error) => {
      console.error(error);
      res.status(500).json({ message: "Internal Server Error" });
    });
});

module.exports = router;

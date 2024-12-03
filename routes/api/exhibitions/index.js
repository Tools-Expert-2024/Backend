const express = require("express");
const { sequelize } = require("../../../models");
const router = express.Router();
const { Op } = require("sequelize");
const { fetchAndSaveExhibitions } = require("../../../config/cron");
// - `GET /api/exhibitions`: 전시회 리스트
// - `GET /api/exhibitions/search`: 전시회 검색
// - `GET /api/exhibitions/:id`: 전시회 상세 정보
// - `POST /api/exhibitions/:id/like`: 전시회 좋아요
// - `DELETE /api/exhibitions/:id/like`: 전시회 좋아요 취소
// - `POST /api/exhibitions/:id/rate`: 전시회 별점 및 댓글 작성
// - `PUT /api/exhibitions/:id/rate`: 전시회 댓글 수정
// - `GET /api/exhibitions/:id/ratings`: 전시회 별점 통계
/**
 * @swagger
 * paths:
 *  /api/exhibitions:
 *    get:
 *      summary: "전시회 리스트 조회"
 *      description: "시작일과 종료일을 기준으로 전시회 목록을 조회합니다."
 *      tags: [Exhibitions]
 *      parameters:
 *        - in: path
 *          name: startDate
 *          schema:
 *            type: string
 *            format: date
 *          description: "해당 날짜 이후 시작하는 전시회를 조회합니다."
 *        - in: path
 *          name: endDate
 *          schema:
 *            type: string
 *            format: date
 *          description: "해당 날짜 이전에 종료하는 전시회를 조회합니다."
 *      responses:
 *        "200":
 *          description: "전시회 목록 조회 성공"
 *          content:
 *            application/json:
 *              schema:
 *                type: array
 *                items:
 *                  type: object
 *                  properties:
 *                    id:
 *                      type: integer
 *                      description: "전시회 ID"
 *                    title:
 *                      type: string
 *                      description: "전시회 제목"
 *                    start_date:
 *                      type: string
 *                      format: date
 *                      description: "전시회 시작 날짜"
 *                    end_date:
 *                      type: string
 *                      format: date
 *                      description: "전시회 종료 날짜"
 */

router.get("/", (req, res) => {
  // 전시회 리스트
  const { startDate, endDate } = req.query;
  sequelize.models.Exhibition.findAll({
    where: {
      [Op.or]: [
        {
          start_date: {
            [Op.gte]: startDate,
          },
          end_date: {
            [Op.lte]: endDate,
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

router.get("/external", (req, res) => {
  startDate = req.body.startDate;
  endDate = req.body.endDate;
  fetchAndSaveExhibitions(startDate, endDate)
    .then((result) => {
      res.json(result);
    })
    .catch((error) => {
      console.error(error);
      res.status(500).json({ message: "Internal Server Error" });
    });
});
/**
 * @swagger
 * paths:
 *  /api/exhibitions/{id}:
 *    get:
 *      summary: "전시회 상세 정보 조회"
 *      description: "특정 전시회의 상세 정보를 조회합니다."
 *      tags: [Exhibitions]
 *      parameters:
 *        - in: path
 *          name: id
 *          required: true
 *          schema:
 *            type: integer
 *          description: "전시회 ID"
 *      responses:
 *        "200":
 *          description: "전시회 상세 정보 조회 성공"
 *          content:
 *            application/json:
 *              schema:
 *                type: object
 *                properties:
 *                  id:
 *                    type: integer
 *                    description: "전시회 ID"
 *                  title:
 *                    type: string
 *                    description: "전시회 제목"
 *                  description:
 *                    type: string
 *                    description: "전시회 설명"
 *                  start_date:
 *                    type: string
 *                    format: date
 *                    description: "전시회 시작 날짜"
 *                  end_date:
 *                    type: string
 *                    format: date
 *                    description: "전시회 종료 날짜"
 */

router.get("/:id", (req, res) => {
  // 전시회 상세 정보
  sequelize.models.ExhibitionDetail.findOne({
    where: {
      seq: req.params.id,
    },
  })
    .then((exhibitionDetail) => {
      if (!exhibitionDetail) {
        return res.status(404).json({ message: "Exhibition not found" });
      }
      return sequelize.models.Venue.findOne({
        where: {
          place_seq: exhibitionDetail.place_seq,
        },
      }).then((venue) => {
        if (!venue) {
          return res.status(404).json({ message: "Venue not found" });
        }
        res.json({
          exhibitionDetail,
          venue,
        });
      });
    })
    .catch((error) => {
      console.error(error);
      res.status(500).json({ message: "Internal Server Error" });
    });
});
/**
 * @swagger
 * paths:
 *  /api/exhibitions/{id}/like:
 *    post:
 *      summary: "전시회 좋아요 추가"
 *      description: "특정 전시회에 좋아요를 추가합니다."
 *      tags: [Exhibitions]
 *      parameters:
 *        - in: path
 *          name: id
 *          required: true
 *          schema:
 *            type: integer
 *          description: "전시회 ID"
 *      requestBody:
 *        required: true
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                userId:
 *                  type: integer
 *                  description: "사용자 ID"
 *      responses:
 *        "200":
 *          description: "좋아요 추가 성공"
 */

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
/**
 * @swagger
 * paths:
 *  /api/exhibitions/{id}/like:
 *    delete:
 *      summary: "전시회 좋아요 취소"
 *      description: "특정 전시회에 대한 좋아요를 취소합니다."
 *      tags: [Exhibitions]
 *      parameters:
 *        - in: path
 *          name: id
 *          required: true
 *          schema:
 *            type: integer
 *          description: "전시회 ID"
 *      requestBody:
 *        required: true
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                userId:
 *                  type: integer
 *                  description: "사용자 ID"
 *      responses:
 *        "200":
 *          description: "좋아요 취소 성공"
 */

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
/**
 * @swagger
 * paths:
 *  /api/exhibitions/{id}/rate:
 *    post:
 *      summary: "전시회 별점 및 댓글 작성"
 *      description: "특정 전시회에 별점과 댓글을 작성합니다."
 *      tags: [Exhibitions]
 *      parameters:
 *        - in: path
 *          name: id
 *          required: true
 *          schema:
 *            type: integer
 *          description: "전시회 ID"
 *      requestBody:
 *        required: true
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                userId:
 *                  type: integer
 *                  description: "사용자 ID"
 *                rating:
 *                  type: number
 *                  format: float
 *                  description: "전시회 별점"
 *                comment:
 *                  type: string
 *                  description: "전시회 댓글"
 *      responses:
 *        "200":
 *          description: "별점 및 댓글 작성 성공"
 */

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
/**
 * @swagger
 * paths:
 *  /api/exhibitions/{id}/rate:
 *    put:
 *      summary: "전시회 별점 및 댓글 수정"
 *      description: "특정 전시회에 대한 별점과 댓글을 수정합니다."
 *      tags: [Exhibitions]
 *      parameters:
 *        - in: path
 *          name: id
 *          required: true
 *          schema:
 *            type: integer
 *          description: "전시회 ID"
 *      requestBody:
 *        required: true
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                userId:
 *                  type: integer
 *                  description: "사용자 ID"
 *                rating:
 *                  type: number
 *                  format: float
 *                  description: "수정된 별점"
 *                comment:
 *                  type: string
 *                  description: "수정된 댓글"
 *      responses:
 *        "200":
 *          description: "별점 및 댓글 수정 성공"
 */

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
/**
 * @swagger
 * paths:
 *  /api/exhibitions/{id}/ratings:
 *    get:
 *      summary: "전시회 별점 통계 조회"
 *      description: "특정 전시회의 별점 통계를 조회합니다."
 *      tags: [Exhibitions]
 *      parameters:
 *        - in: path
 *          name: id
 *          required: true
 *          schema:
 *            type: integer
 *          description: "전시회 ID"
 *      responses:
 *        "200":
 *          description: "별점 통계 조회 성공"
 *          content:
 *            application/json:
 *              schema:
 *                type: object
 *                properties:
 *                  avgRating:
 *                    type: number
 *                    format: float
 *                    description: "평균 별점"
 */

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

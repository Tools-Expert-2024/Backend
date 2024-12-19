const express = require("express");
const { sequelize } = require("../../../models");
const { verifyToken } = require("../../../lib/authentication");

// - `POST /api/venues/:id/like`: 전시장 좋아요
// - `DELETE /api/venues/:id/like`: 전시장 좋아요 취소
// - `GET /api/venues/:id/exhibitions`: 좋아요한 전시장에서 진행 중인 전시 리스트
// - `DELETE /api/venues/:id/exhibitions`: 좋아요한 전시장에서 진행 중인 전시 리스트 중 취소
const router = express.Router();

// POST /api/venues/:id/like: 전시장 좋아요
/**
 * @swagger
 * paths:
 *  /api/venues/{id}/like:
 *    post:
 *      summary: "전시장 좋아요 추가"
 *      description: "특정 전시장에 좋아요를 추가합니다."
 *      tags: [Venues]
 *      parameters:
 *        - in: path
 *          name: id
 *          required: true
 *          schema:
 *            type: integer
 *          description: "전시장 ID"
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

router.post("/:id/like", verifyToken, (req, res) => {
  // 좋아요 처리 로직
  sequelize.models.VenueLike.create({
    venue_id: req.params.id,
    user_id: req.userId,
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
/**
 * @swagger
 * paths:
 *  /api/venues/{id}/like:
 *    delete:
 *      summary: "전시장 좋아요 취소"
 *      description: "특정 전시장에 대한 좋아요를 취소합니다."
 *      tags: [Venues]
 *      parameters:
 *        - in: path
 *          name: id
 *          required: true
 *          schema:
 *            type: integer
 *          description: "전시장 ID"
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

router.delete("/:id/like", verifyToken, (req, res) => {
  // 좋아요 취소 처리 로직
  sequelize.models.VenueLike.destroy({
    where: {
      venue_id: req.params.id,
      user_id: req.userId,
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
/**
 * @swagger
 * paths:
 *  /api/venues/{id}/exhibitions:
 *    get:
 *      summary: "좋아요한 전시장에서 진행 중인 전시 리스트 조회"
 *      description: "특정 전시장에서 현재 진행 중인 전시회의 목록을 조회합니다."
 *      tags: [Venues]
 *      parameters:
 *        - in: path
 *          name: id
 *          required: true
 *          schema:
 *            type: integer
 *          description: "전시장 ID"
 *        - in: query
 *          name: startDate
 *          schema:
 *            type: string
 *            format: date
 *          description: "전시 시작 날짜"
 *        - in: query
 *          name: endDate
 *          schema:
 *            type: string
 *            format: date
 *          description: "전시 종료 날짜"
 *      responses:
 *        "200":
 *          description: "전시 리스트 조회 성공"
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
router.get("/:id/exhibitions", verifyToken, (req, res) => {
  // 좋아요 누른 전시장에서 진행 중인 전시 리스트 조회 로직
  sequelize.models.Exhibition.findAll({
    include: [
      {
        model: sequelize.models.VenueLike,
        where: {
          venue_id: req.params.id,
          user_id: req.userId,
        },
      },
    ],
    where: {
      startDate: { [sequelize.Sequelize.Op.lte]: req.query.startDate },
      endDate: { [sequelize.Sequelize.Op.gte]: req.query.endDate },
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

// GET /api/venues/liked: 좋아요 누른 전시장 리스트
/**
 * @swagger
 * paths:
 *  /api/venues/liked:
 *    get:
 *      summary: "좋아요 누른 전시장 리스트 조회"
 *      description: "사용자가 좋아요를 누른 전시장의 목록을 조회합니다."
 *      tags: [Venues]
 *      responses:
 *        "200":
 *          description: "좋아요 누른 전시장 리스트 조회 성공"
 *          content:
 *            application/json:
 *              schema:
 *                type: array
 *                items:
 *                  type: object
 *                  properties:
 *                    id:
 *                      type: integer
 *                      description: "전시장 ID"
 *                    name:
 *                      type: string
 *                      description: "전시장 이름"
 *                    location:
 *                      type: string
 *                      description: "전시장 위치"
 */
router.get("/liked", verifyToken, (req, res) => {
  // 좋아요 누른 전시장 리스트 조회 로직
  sequelize.models.VenueLike.findAll({
    where: {
      user_id: req.userId,
    },
    include: [
      {
        model: sequelize.models.Venue,
        attributes: ["id", "name", "location"],
      },
    ],
  })
    .then((result) => {
      const likedVenues = result.map((like) => like.Venue);
      res.json(likedVenues);
    })
    .catch((error) => {
      console.error(error);
      res.status(500).json({ message: "Internal Server Error" });
    });
});

module.exports = router;

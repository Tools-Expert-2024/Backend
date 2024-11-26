const express = require("express");
const { sequelize } = require("../../../models");

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
/**
 * @swagger
 * paths:
 *  /api/venues/{id}/exhibitions:
 *    delete:
 *      summary: "좋아요한 전시장에서 진행 중인 전시 취소"
 *      description: "특정 전시장에서 현재 진행 중인 전시회를 취소합니다."
 *      tags: [Venues]
 *      parameters:
 *        - in: path
 *          name: id
 *          required: true
 *          schema:
 *            type: integer
 *          description: "전시장 ID"
 *        - in: query
 *          name: exhibitionId
 *          schema:
 *            type: integer
 *          description: "취소할 전시회 ID"
 *      responses:
 *        "200":
 *          description: "전시 취소 성공"
 */

router.delete("/:id/exhibitions", (req, res) => {
  // 전시 리스트 중 취소 처리 로직
  res.send("Exhibition removed");
});

module.exports = router;

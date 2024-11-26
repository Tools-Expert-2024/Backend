// - `POST /api/admin/exhibitions`: 전시회 추가
// - `DELETE /api/admin/exhibitions/:id`: 전시회 삭제
// - `PUT /api/admin/exhibitions/:id`: 전시회 수정

const express = require("express");
const { sequelize } = require("../../../models");
const router = express.Router();

// POST /api/admin/exhibitions - 전시회 추가
/**
 * @swagger
 * paths:
 *  /api/admin/exhibitions:
 *    post:
 *      summary: "전시회 추가"
 *      description: "관리자가 새로운 전시회를 추가합니다."
 *      tags: [Admin]
 *      requestBody:
 *        required: true
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                title:
 *                  type: string
 *                  description: "전시회 제목"
 *                startDate:
 *                  type: string
 *                  format: date
 *                  description: "전시 시작 날짜"
 *                endDate:
 *                  type: string
 *                  format: date
 *                  description: "전시 종료 날짜"
 *                price:
 *                  type: integer
 *                  description: "전시회 가격"
 *                contents1:
 *                  type: string
 *                  description: "전시회 주요 내용"
 *                contents2:
 *                  type: string
 *                  description: "전시회 부가 내용"
 *                thumbnail:
 *                  type: string
 *                  description: "전시회 썸네일 이미지 URL"
 *                phone:
 *                  type: string
 *                  description: "전시회 문의 전화번호"
 *                place_seq:
 *                  type: integer
 *                  description: "전시 장소 ID"
 *      responses:
 *        "200":
 *          description: "전시회 추가 성공"
 */

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
/**
 * @swagger
 * paths:
 *  /api/admin/exhibitions/{id}:
 *    delete:
 *      summary: "전시회 삭제"
 *      description: "관리자가 특정 전시회를 삭제합니다."
 *      tags: [Admin]
 *      parameters:
 *        - in: path
 *          name: id
 *          required: true
 *          schema:
 *            type: integer
 *          description: "전시회 ID"
 *      responses:
 *        "200":
 *          description: "전시회 삭제 성공"
 */

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
/**
 * @swagger
 * paths:
 *  /api/admin/exhibitions/{id}:
 *    put:
 *      summary: "전시회 수정"
 *      description: "관리자가 특정 전시회의 정보를 수정합니다."
 *      tags: [Admin]
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
 *                title:
 *                  type: string
 *                  description: "전시회 제목"
 *                startDate:
 *                  type: string
 *                  format: date
 *                  description: "전시 시작 날짜"
 *                endDate:
 *                  type: string
 *                  format: date
 *                  description: "전시 종료 날짜"
 *                price:
 *                  type: integer
 *                  description: "전시회 가격"
 *                contents1:
 *                  type: string
 *                  description: "전시회 주요 내용"
 *                contents2:
 *                  type: string
 *                  description: "전시회 부가 내용"
 *                thumbnail:
 *                  type: string
 *                  description: "전시회 썸네일 이미지 URL"
 *                phone:
 *                  type: string
 *                  description: "전시회 문의 전화번호"
 *                place_seq:
 *                  type: integer
 *                  description: "전시 장소 ID"
 *      responses:
 *        "200":
 *          description: "전시회 수정 성공"
 */
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

const axios = require("axios");
const { Exhibition, ExhibitionDetail, Venue } = require("../models");
const cron = require("node-cron");
const { Op } = require("sequelize");
const { getExhibitions } = require("../lib/getExhibitions");
// 공공 API에서 데이터를 가져와 로컬 데이터베이스에 저장
const fetchAndSaveExhibitions = async () => {
  try {
    const response = await getExhibitions(20240901, 20240919, 1, 10, "D000");
    const exhibitions = response; // 실제 데이터 구조에 맞게 변경하세요
    console.log(exhibitions);
    for (const exhibition of exhibitions) {
      // 전시회장 정보 저장
      //   const [venue, created] = await Venue.findOrCreate({
      //     where: { place_seq: exhibition.place_seq },
      //     defaults: {
      //       name: exhibition.place,
      //       place_url: exhibition.place_url,
      //       location: exhibition.place_addr,
      //       gps_x: exhibition.gpsX,
      //       gps_y: exhibition.gpsY,
      //       area: exhibition.area,
      //     },
      //   });

      // 전시회 상세 정보 저장
      //   const [exhibitionDetail, detailCreated] =
      //     await ExhibitionDetail.findOrCreate({
      //       where: { seq: exhibition.seq },
      //       defaults: {
      //         title: exhibition.title,
      //         price: exhibition.price,
      //         contents1: exhibition.contents1,
      //         contents2: exhibition.contents2,
      //         url: exhibition.url,
      //         img_url: exhibition.img_url,
      //         phone: exhibition.phone,
      //         place_seq: venue.place_seq,
      //       },
      //     });

      // 전시회 정보 저장
      await Exhibition.findOrCreate({
        where: { id: exhibition.seq },
        defaults: {
          title: exhibition.title,
          start_date: exhibition.startDate,
          end_date: exhibition.endDate,
          area: exhibition.area,
          place: exhibition.place,
          thumbnail: exhibition.thumbnail,
          gpsX: exhibition.gpsX,
          gpsY: exhibition.gpsY,
        },
      });
    }

    console.log("Exhibitions fetched and saved successfully");
  } catch (error) {
    console.error("Failed to fetch and save exhibitions", error);
  }
};

// 매일 자정에 데이터 동기화 작업 실행
cron.schedule("* * * * *", fetchAndSaveExhibitions);

module.exports = {
  fetchAndSaveExhibitions,
};

exports.getExhibitions = async (req, res) => {
  try {
    const { startDate, endDate, location } = req.query;
    const where = {};

    if (startDate) {
      where.start_date = { [Op.gte]: new Date(startDate) };
    }
    if (endDate) {
      where.end_date = { [Op.lte]: new Date(endDate) };
    }
    if (location) {
      where.location = location;
    }

    const exhibitions = await Exhibition.findAll({ where });
    res.json(exhibitions);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch exhibitions" });
  }
};

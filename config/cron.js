const axios = require("axios");
const { Exhibition, ExhibitionDetail, Venue } = require("../models");
const { Op } = require("sequelize");
const {
  getExternalAPIExhibitions,
} = require("../lib/getExternalAPIExhibitions");
const { getExhibitionDetail } = require("../lib/getExhibitionDetails");
// 공공 API에서 데이터를 가져와 로컬 데이터베이스에 저장
const fetchAndSaveExhibitions = async () => {
  try {
    const today = new Date();
    const startDate = today.toISOString().split("T")[0].replace(/-/g, "");
    const endDate = startDate; // Assuming you want to fetch exhibitions for today only
    const response = await getExternalAPIExhibitions(startDate, endDate, 1);
    const exhibitions = response; // 실제 데이터 구조에 맞게 변경하세요

    for (const exhibition of exhibitions) {
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
          gpsX: exhibition.gpsX == "" ? null : exhibition.gpsX,
          gpsY: exhibition.gpsY == "" ? null : exhibition.gpsY,
        },
      });
      const exhibitionDetail = await ExhibitionDetail.findOne({
        where: { seq: exhibition.seq },
      });

      if (!exhibitionDetail) {
        const data = await getExhibitionDetail(exhibition.seq);
        console.log(data);
        // 전시회장 정보 저장
        const [venue, created] = await Venue.findOrCreate({
          where: { place_seq: data.placeSeq },
          defaults: {
            name: data.place,
            place_url: data.placeUrl,
            place_addr: data.placeAddr,
            area: data.area,
            gpsX: data.gpsX == "" ? null : data.gpsX,
            gpsY: data.gpsY == "" ? null : data.gpsY,
            area: data.area,
          },
        });

        //   전시회 상세 정보 저장
        const [exhibitionDetail, detailCreated] =
          await ExhibitionDetail.findOrCreate({
            where: { seq: data.seq },
            defaults: {
              title: data.title,
              price: data.price,
              startDate: data.startDate,
              endDate: data.endDate,
              contents1: data.contents1,
              contents2: data.contents2,
              thumbnail: data.imgUrl,
              phone: data.phone,
              place_seq: venue.place_seq,
            },
          });
      }
    }

    console.log("Exhibitions fetched and saved successfully");
  } catch (error) {
    console.error("Failed to fetch and save exhibitions", error);
  }
};

module.exports = {
  fetchAndSaveExhibitions,
};
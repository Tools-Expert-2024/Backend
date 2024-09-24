const { default: axios } = require("axios");
const express = require("express");

const router = express.Router();
const { XMLParser, XMLValidator } = require("fast-xml-parser");
const { decode } = require("entities"); // entities 모듈에서 decode 함수 사용

// HTML 인코딩된 문자열을 디코딩하는 함수
function decodeDataArray(dataArray) {
  return dataArray.map((item) => {
    const decodedItem = {};
    for (const key in item) {
      if (typeof item[key] === "string") {
        decodedItem[key] = decode(item[key]); // 문자열 필드만 디코딩
      } else {
        decodedItem[key] = item[key];
      }
    }
    return decodedItem;
  });
}

const getExhibits = async (from, to, page, rows) => {
  //   const { page, rows } = params;

  try {
    const data = await axios.get(
      `http://www.culture.go.kr/openapi/rest/publicperformancedisplays/realm?serviceKey=aBCeE33mjmqEhr%2F2mSYiVTzbvscZ7pIVretDFwq6tGRTMY3ovfshg6OYTPGUgFHPfAwsHRF%2Bn7Pm4%2FRlE3Y%2BWQ%3D%3D`,
      {
        params: {
          from: "20240901",
          to: "20240919",
          cPage: "1",
          rows: "10",
          realmCode: "D000",
        },
      }
    );
    const parser = new XMLParser();
    let jObj = parser.parse(data.data);
    const refinedData = jObj.response.msgBody.perforList;
    const decodedData = decodeDataArray(refinedData);
    return decodedData;
  } catch (err) {
    console.error("API 요청 중 오류 발생");
    return { success: false };
  }
};

router.get("/", async (req, res, next) => {
  try {
    const params = req.params;
    const exhibits = await getExhibits(
      params.from,
      params.to,
      params.page,
      params.rows
    );
    // console.log(exhibits);
    // res.json(exhibits);
    console.log(exhibits);
    res.json(exhibits);
  } catch (err) {
    console.error(err);
    next(err);
  }
});

module.exports = router;

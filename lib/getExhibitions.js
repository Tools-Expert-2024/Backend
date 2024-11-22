const { default: axios } = require("axios");
const { XMLParser, XMLValidator } = require("fast-xml-parser");
const { decode } = require("entities"); // entities 모듈에서 decode 함수 사용

// HTML 인코딩된 문자열을 디코딩하는 함수
function decodeDataArray(dataArray) {
  if (!Array.isArray(dataArray)) {
    throw new TypeError("Expected an array");
  }

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

const getExhibitions = async (from, to, page, rows) => {
  try {
    const data = await axios.get(
      `http://www.culture.go.kr/openapi/rest/publicperformancedisplays/realm?serviceKey=${process.env.OPENAPI_KEY}`,
      {
        params: {
          from,
          to,
          cPage: page,
          rows,
          realmCode: "D000",
        },
      }
    );

    const parser = new XMLParser();
    let jObj = parser.parse(data.data);

    // 데이터 구조 확인
    // console.log(jObj);

    // exhibitions 배열로 변환
    const exhibitions = Array.isArray(jObj.response.msgBody.perforList)
      ? jObj.response.msgBody.perforList
      : [jObj.response.msgBody.perforList];
    // console.log(exhibitions);

    // HTML 인코딩된 문자열을 디코딩
    const decodedExhibitions = decodeDataArray(exhibitions);
    // console.log(decodedExhibitions);

    return decodedExhibitions;
  } catch (error) {
    console.error("Failed to fetch exhibitions", error);
    throw error;
  }
};

module.exports = { getExhibitions };

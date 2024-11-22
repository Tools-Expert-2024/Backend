const { default: axios } = require("axios");
const { XMLParser } = require("fast-xml-parser");
const { decodeDataArray } = require("./decodeDataArray");

const getExhibitionDetail = async (id) => {
  try {
    const data = await axios.get(
      `http://www.culture.go.kr/openapi/rest/publicperformancedisplays/d/?serviceKey=${process.env.OPENAPI_KEY}`,
      {
        params: {
          seq: id,
        },
      }
    );

    const parser = new XMLParser();
    let jObj = parser.parse(data.data);

    // 데이터 구조 확인
    // console.log(jObj);

    // exhibitionDetail 객체로 변환
    const exhibitionDetail = jObj.response.msgBody.perforInfo;

    // HTML 인코딩된 문자열을 디코딩
    const decodedExhibitionDetail = decodeDataArray([exhibitionDetail]);

    return decodedExhibitionDetail[0];
  } catch (error) {
    console.error("Failed to fetch exhibition detail", error);
    throw error;
  }
};

module.exports = { getExhibitionDetail };

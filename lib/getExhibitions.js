const { default: axios } = require("axios");
const { XMLParser, XMLValidator } = require("fast-xml-parser");
const { decodeDataArray } = require("./decodeDataArray");

const getExhibitions = async (from, to, page) => {
  try {
    const data = await axios.get(
      `http://www.culture.go.kr/openapi/rest/publicperformancedisplays/realm?serviceKey=${process.env.OPENAPI_KEY}`,
      {
        params: {
          from,
          to,
          cPage: page,
          rows: 50,
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
    let currentPage = page;
    let allExhibitions = decodedExhibitions;

    while (decodedExhibitions.length === 50) {
      currentPage += 1;
      const nextPageData = await axios.get(
        `http://www.culture.go.kr/openapi/rest/publicperformancedisplays/realm?serviceKey=${process.env.OPENAPI_KEY}`,
        {
          params: {
            from,
            to,
            cPage: currentPage,
            rows: 50,
            realmCode: "D000",
          },
        }
      );

      const nextPageObj = parser.parse(nextPageData.data);
      const nextPageExhibitions = Array.isArray(
        nextPageObj.response.msgBody.perforList
      )
        ? nextPageObj.response.msgBody.perforList
        : [nextPageObj.response.msgBody.perforList];

      const decodedNextPageExhibitions = decodeDataArray(nextPageExhibitions);
      allExhibitions = allExhibitions.concat(decodedNextPageExhibitions);

      if (decodedNextPageExhibitions.length < 50) {
        break;
      }
    }

    return allExhibitions;
  } catch (error) {
    console.error("Failed to fetch exhibitions", error);
    throw error;
  }
};

module.exports = { getExhibitions };

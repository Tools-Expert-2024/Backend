const { decode } = require("entities");
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
module.exports = { decodeDataArray };

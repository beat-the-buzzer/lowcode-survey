/**
 * 对象去除空值
 * @param obj
 */
export const clearEmpty = (obj: object) => {
  const curVal = {};
  const toString = Object.prototype.toString;
  for (const key in obj) {
    const value = obj[key];
    const type = toString.call(value);
    if (value || type === "[object Number]" || type === "[object Boolean]") {
      switch (type) {
        case "[object Object]":
          if (Object.keys(value).length > 0) {
            curVal[key] = value;
          }
          break;
        case "[object Array]":
          if (value.length > 0) {
            curVal[key] = value;
          }
          break;
        default:
          curVal[key] = value;
          break;
      }
    }
  }
  return curVal;
};

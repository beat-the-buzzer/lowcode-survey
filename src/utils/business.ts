import { last } from "lodash-es";

// 业务范围
const range = ["zs", "yx", "jy", "lx", "xy", "xg"];

/**
 * 根据当前地址提取业务来源
 */
export const getBusiness = () => {
  const pathname = location.pathname;
  const pathArr = pathname.split("/");
  const lastFlag = last(pathArr) as string;
  if (range.includes(lastFlag)) {
    return lastFlag;
  } else {
    return "";
  }
};

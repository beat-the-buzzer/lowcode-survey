// export default {
//   optionSpan: { 一列: 1, 两列: 2, 三列: 3, 四列: 4 },
//   dataType: { 下拉选项: "select", 单行文本: "text" },
// };

const spanOptions = [
  { label: "一列", value: 1 },
  { label: "两列", value: 2 },
  { label: "三列", value: 3 },
  { label: "四列", value: 4 },
];

const spanOptionsMobile = [
  { label: "一行一个选项", value: 'block' },
  { label: "从左到右依次排列", value: 'inline-flex' },
];

const dataType = [
  { label: "下拉选项", value: "select" },
  { label: "单行文本", value: "text" },
];

const inputType = [
  { label: "文本", value: "string" },
  { label: "数字", value: "number" },
];

const timeType = [
  { label: "日期", value: "date" },
  { label: "日期时间", value: "datetime" },
  { label: "时间", value: "time" },
];

const timeFormat = {
  date: "YYYY-MM-DD",
  datetime: "YYYY-MM-DD HH:mm:ss",
  time: "HH:mm:ss",
};

const fileType = [
  { label: "不限", value: "*" },
  { label: "图片", value: ".jpg,.png,.bmp" },
  { label: "PDF", value: ".pdf" },
  { label: "Word", value: ".doc,.docx" },
  { label: "Excel", value: ".xls,.xlsx" },
  { label: "压缩文件", value: ".zip,.rar" },
];


// 指标等级
const zbdjArr = [{
  label: '数学与计算机科学学院学生评价等级',
  value: '1'
}]

export default {
  spanOptions,
  spanOptionsMobile,
  dataType,
  inputType,
  timeType,
  timeFormat,
  fileType,
  zbdjArr
};

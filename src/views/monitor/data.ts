import { getStudent, getCompany, getTeacher } from "@/api/monitor";

export const api = {
  student: getStudent,
  teacher: getTeacher,
  company: getCompany,
};

const studentColumn = [
  { label: "学号", value: "yhm" },
  { label: "姓名", value: "xm" },
  { label: "毕业年份", value: "bynf" },
  { label: "学校", value: "xxmc" },
  { label: "学院", value: "xymc" },
  { label: "专业", value: "zymc" },
  { label: "手机号", value: "sjhm" },
  { label: "答卷状态", value: "djzt" },
];

const teacherColumn = [
  { label: "用户名", value: "yhm" },
  { label: "姓名", value: "xm" },
  { label: "所在学校", value: "xxmc" },
  { label: "所在学院", value: "xymc" },
  { label: "手机号", value: "sjhm" },
  { label: "答卷状态", value: "djzt" },
];

const companyColumn = [
  { label: "单位名称", value: "xm" },
  { label: "单位性质", value: "dwxzmc" },
  { label: "单位行业", value: "dwhymc" },
  { label: "单位规模", value: "dwgmmc" },
  { label: "单位所在地", value: "dwszd" },
  { label: "联系人", value: "dwlxr" },
  { label: "手机号", value: "sjhm" },
  { label: "答卷状态", value: "djzt" },
];

export const column = {
  student: studentColumn,
  teacher: teacherColumn,
  company: companyColumn,
};

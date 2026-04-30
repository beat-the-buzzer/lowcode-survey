import request from "@/utils/request";

export const getTeacher = (params: any) =>
  request.post<any>("/wjdc/wjhs/teacher", params);

export const getStudent = (params: any) =>
  request.post<any>("/wjdc/wjhs/student", params);

export const getCompany = (params: any) =>
  request.post<any>("/wjdc/wjhs/company", params);

export const delAnswer = (params: any) =>
  request.post<any>("/wjdc/djxx/dj/delete", params);

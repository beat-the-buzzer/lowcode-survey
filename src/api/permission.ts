import request from "@/utils/request";

export const getMenus = (params: any) =>
  request.get<any>("/yhzx/sqgl/dlyhjk", params);

export const getMenuChildren = (params: any) =>
  request.get<any>("/yhzx/sqgl/getRouters", params);

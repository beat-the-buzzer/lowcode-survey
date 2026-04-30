import request from "@/utils/request";

// 获取分发对象
export const getIdentities = () => request.get<any>("/wjdc/wjff/ffdx");

// 获取分发条件
export const getQuery = () => request.get<any>("/wjdc/wjff/fftj");

// 获取高级查询
export const getFilterFields = (params: any) =>
  request.get<any>("/jcfw/search/getSimpleFields", params);

// 获取查询条件数据源
export const getFiledOptions = (params: any) => {
  const { method, api, fetchParam } = params;
  if (method === "GET") {
    return request.get<any>(api, fetchParam);
  }
  if (method === "POST") {
    return request.post<any>(api, fetchParam);
  }
};

// 获取分发条件
export const getOptions = (params: any) =>
  request.get<any>("/wjdc/jcsj", params);

// 获取触发条件
export const getTriggers = () => request.get<any>("/wjdc/wjff/cftj");

// 获取分发人数
export const getDistributeNums = (params: any) =>
  request.post<any>("/wjdc/wjff/ffrs", params);

// 问卷分发
export const distribute = (params: any) =>
  request.post<any>("/wjdc/wjff", params);

export const getRecords = (params: any) =>
  request.post<any>("/wjdc/wjff/ffjl", params);

export const checkAnswer = (params: any) =>
  request.post<any>("/wjdc/wjff/answered", params);

// 获取外部导入人员
export const getOuterUsers = (params: any) =>
  request.post<any>("/wjdc/user/page", params);

// 获取外部人员导入字段
export const getOuterFields = (params: any) =>
  request.post<any>("/wjdc/user/meta", params);

// 获取外部人员校验字段
export const getOuterCheckFields = (params: any) =>
  request.get<any>("", params);

// 外部人员分发
export const outerUserDistribute = (params: any) =>
  request.post<any>("/wjdc/user/sync", params);

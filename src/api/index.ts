import request from "@/utils/request";


// 分页获取问卷列表
export const getSurveyList = (params: any) =>
  request.post<any>("/wjdc/wjxx/page", params);

// 新增问卷
export const addSurvey = (params: any) =>
  request.post<any>("/wjdc/wjxx", params);

// 删除问卷
export const deleteSurvey = (params: any) =>
  request.delete<any>("/wjdc/wjxx", params);

// 更新问卷
export const updateSurvey = (params: any) =>
  request.put<any>("/wjdc/wjxx", params);



// 更新问卷状态
export const updateSurveyState = (params: any) =>
  request.patch<any>("/wjdc/wjxx", params);

// 获取问卷详情
export const getSurvey = (params: any) =>
  request.get<any>("/wjdc/wjxx", params);



// 获取问卷设置
export const getConfig = (params: any) =>
  request.get<any>("/wjdc/wjxx/config", params);

// 更新问卷设置
export const updateSurveyConfig = (params: any) =>
  request.put<any>("/wjdc/wjxx/config", params);

// 提交问卷答案
export const submitAnswer = (params: any) =>
  request.put<any>("/wjdc/djxx", params);

// 获取问卷答案
export const getAnswer = (params: any) =>
  request.get<any>("/wjdc/djxx", params);

// 获取问卷统计
export const getStatistics = (params: any) =>
  request.get<any>("/wjdc/wjxx/tjcx", params);

// 分页查询问卷答案
export const getAnswers = (params: any) =>
  request.post<any>("/wjdc/djda/page", params);

// 获取级联统计
export const getCascaderStatistics = (params: any) =>
  request.post<any>("/wjdc/wjxx/cascader/wttj", params);

export const getPoster = (params: any) =>
  request.get<any>("/wjdc/wjhb", params);

export const savePoster = (params: any) =>
  request.post<any>("/wjdc/wjhb", params);

export const getOptionTags = (params: any) =>
  request.get<any>("/wjdc/jcsj/label", params);

export const getOptions = (params: any) =>
  request.get<any>("/wjdc/jcsj/cascader", params);

export const getSurveyAnswers = (params: any) =>
  request.get<any>("/wjdc/djxx/dj", params);

export const getDownloadList = () =>
  request.get<any>("/wjdc/djda/download/list");

export const addTask = ({ type, id }) =>
  request.get<any>(`/wjdc/djda/download/${type}/${id}`);



// 问卷提交接口
export const saveSurvey = (params: any) =>
request.post<any>("/api/wjmbgl/saveWjmbxq", params);

// 获取问卷详情
export const getSurveyDetail = (params: any) =>
  request.post<any>("/api/wjmbgl/cxWjmbpzxq", params);

  // 获取问卷填报信息
export const getSurveyTbxx = (params: any, ywlx) => {
  let url = ''
  if(ywlx == '1' || ywlx == '2') {
    url = "/api/lcsjjxhdgl/xcjltb/cxXcjlxq"
  }
  if(ywlx == '3') {
    url = "/api/pjgl/xspj/cxXspjnr"
  }
  if(ywlx == '4' || ywlx == '5') {
    url = "/api/lcsjjxhd/ksxctb/cxKsxctbxq"
  }
  return request.post<any>(url, params);
}

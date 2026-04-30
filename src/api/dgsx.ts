import request from "@/utils/request";



export const getOptionList = (params: any) =>
  request.post<any>(`/dgsx/sxpjgl/xxmbwh/getOptionList.zf`, params);

export const saveSurvey = (params: any) =>
  request.post<any>(`/dgsx/sxpjgl/pjmbwh/szBcPjmbDetail.zf`, params);

export const getSurvey = (pjmbmcb_id, params: any) =>
  request.get<any>(`/dgsx/sxpjgl/pjmbwh/cxPjmbDetail.zf?pjmbmcb_id=${pjmbmcb_id}`, params);

export const saveAnswer = (params: any) =>
  request.post<any>(`/dgsx/sxpjgl/sxpj/zjBcSxpj.zf`, params);

export const submitAnswer = (params: any, ywlx: String) => {
  const ywUrl = {
    1: '/api/lcsjjxhdgl/xcjltb/saveXcjlxq', // 巡查记录填报
    2: '/api/lcsjjxhdgl/xcjltb/xgXcjlxq', // 巡查记录修改
    3: '/api/pjgl/xspj/bcXspj', // 提交评价的功能
    4: '/api/lcsjjxhd/ksxctb/saveKsxc', // 科室巡查保存
    5: '/api/lcsjjxhd/ksxctb/xgKsxc', // 科室巡查提交

  }
  return request.post<any>(ywUrl[ywlx], params);
}
  

export const getAnswer = (xspjxxbId, params: any) =>
  request.get<any>(`/dgsx/sxpjgl/sxpj/cxXspjDetail.zf?xspjxxb_id=${xspjxxbId}`, params);  

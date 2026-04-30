import request from "@/utils/request";

export const uploadFile = (params: any) => {
  return request.upload<any>("/api/file/upload", params);
};

export const previewFile = (id: any) =>
  request.post<any>("/api/file/convert/pdf?id=" + id);

export const downloadFile = (params: any) =>
  request.post<any>("/wjdc/file/downloadZipFile", params);

export const uploadVideo = (params: any) =>
  request.upload<any>("/zhfw/spfw/upload", params);

export const deleteVideo = (params: any) =>
  request.delete<any>("/zhfw/spfw/del", params);

// 上传外部人员导入文件
export const uploadExportFile = (wjid: any, params: any) =>
  request.upload<any>(`/wjdc/user/upload?wjid=${wjid}`, params);

import request from "@/utils/request";

export const getOptions = (params: any) => {
  const { apiMethod, api, fetchParam } = params;
  if (apiMethod === "GET") {
    return request.get<any>(api, fetchParam);
  }
  if (apiMethod === "POST") {
    return request.post<any>(api, fetchParam);
  }
};

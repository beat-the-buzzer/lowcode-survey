import request from "@/utils/request";
import qs from "qs";

// 获取登录加密公钥
export const getPubKey = () => request.get<any>("/yhzx/auth/pubKey");

// 用户登录
export const login = (params: any) =>
  request.post<any>("/yhzx/auth/login", qs.stringify(params), {
    headers: {
      "Content-Type": "application/x-www-form-urlencoded;",
    },
  });

// 获取用户信息
export const getUserInfo = () => request.get<any>("/yhzx/sqgl/dlyhxx");

// 用户注销
// export const logout = () => request.delete<any>("/yhzx/auth/logout");

// 获取菜单
export const getMenus = () => request.get<any>("/yhzx/sqgl/dlyhjk");

export const getprimaryColor = () => request.get<any>("/yhzx/yhgzt/zts");

export const auth = (params: any) =>
  request.get<any>("/wjdc/auth/code2Token", params);

export const logout = () => request.delete<any>("/wjdc/auth/logout");

export const isAnswerRange = (params: any) =>
  request.get<any>("/wjdc/wjff/filter", params);

export const zf_auth = (params: any) =>
  request.get<any>("/wjdc/zfsso/oauth/login", params);

export const getCodeUrl = (params?: any) =>
  request.get<any>("/wjdc/zfsso/getCodeUrl", params);

export const checkOuter = (params: any) =>
  request.post<any>("/wjdc/djxx/checkUser", params);

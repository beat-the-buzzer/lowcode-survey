import axios from "axios";
import type {
  AxiosInstance,
  AxiosError,
  AxiosRequestConfig,
  AxiosResponse,
} from "axios";
import { ElMessage } from "element-plus";
import { isString } from "./is";
import { getToken, removeToken } from "./cookies";

// 数据返回的接口
// 定义请求响应参数，不含data
interface Result {
  code: number;
  msg: string;
}

// 请求响应参数，包含data
interface ResultData<T = any> extends Result {
  data?: T;
  message: string;
  code: number;
}
const URL: string = "";
enum RequestEnums {
  TIMEOUT = 20 * 60 * 1000,
  OVERDUE = 11, // 登录失效
  FAIL = 999, // 请求失败
  SUCCESS = 0, // 请求成功
}
const config = {
  // 默认地址
  baseURL: URL as string,
  // 设置超时时间
  timeout: RequestEnums.TIMEOUT as number,
  // 跨域时候允许携带凭证
  // withCredentials: true
};

class RequestHttp {
  // 定义成员变量并指定类型
  service: AxiosInstance;
  public constructor(config: AxiosRequestConfig) {
    // 实例化axios
    this.service = axios.create(config);
    /**
     * 请求拦截器
     * 客户端发送请求 -> [请求拦截器] -> 服务器
     * token校验(JWT) : 接受服务器返回的token,存储到vuex/pinia/本地储存当中
     */

    this.service.interceptors.request.use(
      (config: any) => {
        // 不用Nginx的阴间写法
        if(import.meta.env.MODE === "production") {
          if(config.url.indexOf('/api/file') >= 0) {
            config.url = `/service-file${config.url}`;
          } else {
            config.url = `/service-sxgl${config.url}`;
          }
        } else {
          config.url = `/zfsoft-api${config.url}`;
        }
        const token = getToken() || "";
        const { headers } = config;
        const _header = {
          ...headers,
          zfsoftToken: token, // 请求头中携带token信息
          lang: localStorage.getItem("LOCALE__") ?? "zh_CN",
        };
        let sessionId = localStorage.getItem('SESSIONID')
        if (sessionId) {
          document.cookie = `JSESSIONID=${sessionId};path=/`
        } 
        return {
          ...config,
          headers: _header,
        };
      },
      (error: AxiosError) => {
        // 请求报错
        Promise.reject(error);
      }
    );
    /**
     * 响应拦截器
     * 服务器换返回信息 -> [拦截统一处理] -> 客户端JS获取到信息
     */

    this.service.interceptors.response.use(
      (response: AxiosResponse) => {
        const { data } = response; // 解构
        console.log(data)
        if (data.code === RequestEnums.OVERDUE) {
          // 登录信息失效，应跳转到登录页面，并清空本地的token
          ElMessage.error(data.message);
          removeToken();
          window.location.replace(`${location.origin}/sxgl`); // 跳转到登录页
          return Promise.reject(data);
        } // 全局错误信息拦截（防止下载文件得时候返回数据流，没有code，直接报错）
        if (data.code && data.code != RequestEnums.SUCCESS) {
          ElMessage.error(data.message); // 此处也可以使用组件提示报错信息
          return Promise.reject(data);
        }
        return data;
      },
      (error: AxiosError) => {
        const { response } = error;
        if (response) {
          this.handleCode(response.status);
          return Promise.reject(error);
        }
        if (!window.navigator.onLine) {
          ElMessage.error("网络连接失败"); // 可以跳转到错误页面，也可以不做操作 // return router.replace({ // path: '/404' // });
          return Promise.reject(error);
        }
      }
    );
  }
  handleCode(code: number): void {
    switch (code) {
      case 401:
        ElMessage.error("登录失败，请重新登录");
        break;
      default:
        ElMessage.error("请求失败");
        break;
    }
  }

  // 常用方法封装
  get<T>(url: string, params?: any): Promise<ResultData<T>> {
    if (isString(params)) {
      return this.service.get(`${url}/${params}`);
    } else {
      return this.service.get(url, { params });
    }
  }
  post<T>(
    url: string,
    params?: object,
    config?: object
  ): Promise<ResultData<T>> {
    return this.service.post(url, params, config);
  }
  put<T>(
    url: string,
    params?: object,
    config?: object
  ): Promise<ResultData<T>> {
    return this.service.put(url, params, config);
  }
  patch<T>(url: string, params?: object): Promise<ResultData<T>> {
    return this.service.patch(url, params);
  }
  delete<T>(url: string, params?: object): Promise<ResultData<T>> {
    if (isString(params)) {
      return this.service.delete(`${url}/${params}`);
    } else {
      return this.service.delete(url, { params });
    }
  }
  upload<T>(url: string, params: any): Promise<ResultData<T>> {
    const formData = new window.FormData();
    const customFilename = params.name || "file";

    if (params.filename) {
      formData.append(customFilename, params.file, params.filename);
    } else {
      formData.append(customFilename, params.file);
    }

    if (params.data) {
      Object.keys(params.data).forEach((key) => {
        const value = params.data![key];
        if (Array.isArray(value)) {
          value.forEach((item) => {
            formData.append(`${key}[]`, item);
          });
          return;
        }

        formData.append(key, params.data![key]);
      });
    }
    return this.service.post(url, formData, {
      headers: {
        "Content-type": "multipart/form-data;charset=UTF-8",
      },
      timeout: 20 * 60 * 1000,
    });
  }
}

// 导出一个实例对象
export default new RequestHttp(config);

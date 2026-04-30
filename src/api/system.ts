import request from "@/utils/request";
import qs from "qs";

export const getSystemConfig = () => request.get<any>("/yhzx/auth/settings");

import type { RouteRecordRaw } from "vue-router";
import { createRouter, createWebHistory, createWebHashHistory } from "vue-router";
import { createRouterGuards } from "./guard/permission";
import type { App } from "vue";
import { basic, login, result } from "./staticModules";
import {
  REDIRECT_ROUTE,
  PAGE_NOT_FOUND_ROUTE,
} from "@/router/staticModules/extra";

const whiteNameList = [
  "login",
  "detail",
  "success",
  "exception",
  "timeout",
  "Test",
  "AuthLogin",
  "design"
];

// 需要放在所有路由之后的路由
const endRoutes: RouteRecordRaw[] = [REDIRECT_ROUTE, PAGE_NOT_FOUND_ROUTE];

export const routes: Array<RouteRecordRaw> = [
  ...login,
  {
    path: "/:ywlx",
    meta: { title: "首页" },
    name: "Home",
    component: () => import("@/layout/index.vue"),
    children: [],
  },
  ...basic,
  ...result,
  {
    path: "/test",
    name: "Test",
    meta: { title: "测试" },
    component: () => import("@/views/detail/check.vue"),
  },
  ...endRoutes,
];

const router = createRouter({
  // createWebHashHistory
  history: createWebHashHistory(import.meta.env.BASE_URL), //import.meta.env.BASE_URL
  routes,
});

export async function setupRouter(app: App) {
  // 创建路由守卫
  createRouterGuards(router, whiteNameList);

  app.use(router);

  // 路由准备就绪后挂载APP实例
  await router.isReady();
}
export default router;

import type { RouteRecordRaw } from "vue-router";

const routes: Array<RouteRecordRaw> = [
  {
    path: "/login",
    name: "login",
    meta: { title: "登录" },
    component: () => import("@/views/login/index.vue"),
  },
  {
    path: "/authlogin",
    name: "AuthLogin",
    meta: { title: "认证登录" },
    component: () => import("@/views/login/AuthLogin.vue"),
  },
];

export default routes;

import type { RouteRecordRaw } from "vue-router";

const routes: Array<RouteRecordRaw> = [
  {
    path: "/success",
    name: "success",
    meta: { title: "问卷提交成功" },
    component: () => import("@/views/result/success.vue"),
  },
  {
    path: "/timeout",
    name: "timeout",
    meta: { title: "问卷提交超时" },
    component: () => import("@/views/result/timeout.vue"),
  },
  {
    path: "/exception",
    name: "exception",
    meta: { title: "问卷答题异常" },
    component: () => import("@/views/result/exception.vue"),
  },
  {
    path: "/403",
    name: "403",
    meta: { title: "答卷权限不足" },
    component: () => import("@/views/result/403.vue"),
  },
];

export default routes;

import type { RouteRecordRaw } from "vue-router";

const routes: Array<RouteRecordRaw> = [
  {
    path: "/design/xg",
    name: "design",
    meta: { title: "问卷模板设置" },
    component: () => import("@/views/design/index.vue")
  },
  {
    path: "/detail",
    name: "detail",
    meta: { title: "" },
    component: () => import("@/views/detail/index.vue"),
  }
];

export default routes;

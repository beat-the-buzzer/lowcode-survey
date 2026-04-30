import type { RouteRecordRaw } from "vue-router";
import RouterView from "@/layout/router-view/index.vue";
import router from "@/router";
/**
 * 重定向路由 主要用于刷新当前页面
 */
export const REDIRECT_ROUTE: RouteRecordRaw = {
  path: "/redirect",
  name: "RedirectTo",
  meta: {
    title: "Redirect",
  },
  children: [
    {
      path: ":path(.*)",
      name: "Redirect",
      component: RouterView,
      meta: {
        title: "Redirect",
      },
      beforeEnter: (to) => {
        const { params, query } = to;
        const { path, redirectType = "path" } = params;

        Reflect.deleteProperty(params, "_redirect_type");
        Reflect.deleteProperty(params, "path");

        const _path = Array.isArray(path) ? path.join("/") : path;
        setTimeout(() => {
          if (redirectType === "name") {
            router.replace({
              name: _path,
              query,
              params,
            });
          } else {
            router.replace({
              path: _path.startsWith("/") ? _path : `/${_path}`,
              query,
            });
          }
        });
        return true;
      },
    },
  ],
};

export const PAGE_NOT_FOUND_ROUTE: RouteRecordRaw = {
  path: "/:pathMatch(.*)*",
  name: "NotFound",
  meta: {
    title: "PageNotFound",
  },
  children: [
    {
      path: "/:pathMatch(.*)*",
      name: "NotFound",
      component: () => import("@/views/error/404.vue"),
      meta: {
        title: "PageNotFound",
      },
    },
  ],
};

export default [PAGE_NOT_FOUND_ROUTE];

import { getToken } from "@/utils/cookies";
import NProgress from "nprogress";
import "nprogress/nprogress.css";
import type { Router } from "vue-router";
import { useUserStore } from "@/stores/modules/user";
import { useSysStore } from "@/stores/modules/system";

const defaultRoutePath = "/list/xg";

export function createRouterGuards(router: Router, whiteNameList: string[]) {
  router.beforeEach(async (to: any, from: any, next: Function) => {
    NProgress.start();
    const userStore = useUserStore();
    const sysStore = useSysStore();

    if (sysStore.lastUpdateTime === 0) {
      await sysStore.getSetting();
    }
    

    const { code } = to.query;
    if (to.name !== "AuthLogin" && code) {
      await userStore.auth({ code });
      const query = JSON.parse(JSON.stringify(to.query));
      delete query["code"];
      changeTitle(to);
      next({ path: to.path, query, replace: true });
    } else {
      // 直接所有页面免登陆
      if (getToken() || true) {
        if (to.name === "login") {
          changeTitle(null);
          next({ path: defaultRoutePath });
        } else {
          const hasRoute = router.hasRoute(to.name!);
          if (userStore.lastUpdateTime === 0) {
            await userStore.afterLogin();
            // 解决警告：No match found for location with path "xxxxxx"
            if (to.name === "NotFound") {
              changeTitle(to);
              next({ path: to.fullPath, query: to.query, replace: true });
            } else if (!hasRoute) {
              // 如果该路由不存在，可能是动态注册的路由，它还没准备好，需要再重定向一次到该路由
              changeTitle(to);
              next({ ...to, replace: true });
              NProgress.done();
            } else {
              // 首页Redirect
              if (to.name === "Home") {
                changeTitle(to);
                next({ name: "list", params: to.params, replace: true });
                NProgress.done();
              } else {
                changeTitle(to);
                next();
                NProgress.done();
              }
            }
          } else {
            changeTitle(to);
            next();
            NProgress.done();
          }
        }
      } else {
        if (whiteNameList.some((n) => n === to.name)) {
          // 在免登录名单，直接进入
          next();
          NProgress.done();
        } else {
          next({
            name: "login",
            replace: true,
          });
          NProgress.done();
        }
      }
    }
  });
}

const changeTitle = (to:any) => {
  if (to.hasOwnProperty('meta') && to.meta && to.meta.hasOwnProperty('title') && to.meta.title) {
    document.title = to.meta.title
  } else {
    document.title = ''
  }
}

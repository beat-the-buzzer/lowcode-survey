import { constantRouterComponents } from "@/router/asyncModules";
import router, { routes } from "@/router";

export const generateRouters = (allMemus: any[], business): any => {
  // 过滤获取当前业务对应的菜单按钮授权
  const arr = allMemus.filter((item) => item["yhzyw"] === business);
  const result: any[] = [];
  // 有无权限判断
  const main = arr.find((item) => item["viewPath"] === "survey");

  if (!main) return { menus: [], buttons: [] };
  const pathPrefix = main["router"];
  // 列表页面添加
  result.push(createMenu("list", "问卷列表"));
  // 预览权限默认添加
  result.push(createMenu("preview", "问卷预览"));
  // 根据按钮权限渲染其他功能
  const buttons: any[] = arr.filter((item) => item["viewPath"] !== "survey");
  buttons.map((item) => {
    // 编辑权限（包括【新增、编辑、问卷配置】）
    if (item["router"] === "edit") {
      result.push(createMenu("add", "问卷新增"));
      result.push(createMenu("design", "问卷编辑"));
      result.push(createMenu("setting", "问卷配置"));
    }
    // 分发权限（包括【海报、分发、回收监测】）
    else if (item["router"] === "publish") {
      result.push(createMenu("publish", "问卷分发"));
      result.push(createMenu("poster", "问卷海报"));
      result.push(createMenu("monitor", "回收监测"));
    }
    // 其他权限(与按钮标识对应)
    else {
      result.push(createMenu(item["router"], item["name"]));
    }
  });

  console.log(result);

  // 添加路由
  const layout = routes.find((item) => item.name == "Home")!;
  layout.children = [...result];
  // 添加路由
  router.addRoute(layout);

  return { menus: result, buttons: buttons.map((item) => item["router"]) };
};

/**
 * 生成菜单
 * @param flag 菜单标识
 * @param title 菜单名称
 */
const createMenu = (flag: string, title: string) => {
  return {
    name: flag,
    path: `/${flag}/:ywlx`,
    meta: {
      title,
    },
    component: constantRouterComponents[flag],
  };
};

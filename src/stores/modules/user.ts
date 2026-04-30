import { getToken, removeToken, setToken } from "@/utils/cookies";
import { defineStore } from "pinia";
import { auth, getprimaryColor, getUserInfo, login, zf_auth } from "@/api/user";
import { getMenus } from "@/api/permission";
import { generateRouters } from "@/utils/generateRouter";
import { store } from "@/stores";
import { getBusiness } from "@/utils/business";

export const useUserStore = defineStore("user", {
  state: () => {
    return {
      token: getToken(),
      roles: [] as any,
      menus: [] as any,
      buttons: [] as any,
      userInfo: {} as any,
      lastUpdateTime: 0,
    };
  },
  actions: {
    setToken(val: string | undefined) {
      this.token = val || "";
      setToken(val);
    },
    // 登录
    async Login(params: any) {
      try {
        const { data } = await login(params);
        this.setToken(data);
        return this.afterLogin("xg");
      } catch (error) {
        return Promise.reject(error);
      }
    },
    // 单点登录
    async auth(params: any) {
      try {
        const { data } = await auth(params);
        this.setToken(data);
        return;
      } catch (error) {
        return Promise.reject(error);
      }
    },
    async zfAuth(params: any) {
      try {
        const { data } = await zf_auth(params);
        this.setToken(data.token);
        return;
      } catch (error) {
        return Promise.reject(error);
      }
    },
    async afterLogin(default_business?: string) {
      try {
        // const { data: info } = await getUserInfo();
        // this.userInfo = info;
        const business = getBusiness();
        // const { data: menuMap } = await getMenus({
        //   sfid: "teacher",
        //   ywfl: "survey",
        // });

        let qx = {"message":"成功!","code":0,"data":{"survey":[{"id":"1800730725559177218","parentId":"56231964687794176","name":"分发","router":"publish","type":2,"icon":null,"orderNum":null,"viewPath":null,"keepalive":1,"isShow":null,"isExt":0,"openMode":1,"ywbs":"survey","sfbs":"teacher","allowh5":1,"service":null,"color":null,"apiSign":null,"yhzsf":"teacher","yhzyw":"xg","yhzids":null},{"id":"1800731095303852034","parentId":"56231964687794176","name":"下载","router":"download","type":2,"icon":null,"orderNum":null,"viewPath":null,"keepalive":1,"isShow":null,"isExt":0,"openMode":1,"ywbs":"survey","sfbs":"teacher","allowh5":1,"service":null,"color":null,"apiSign":null,"yhzsf":"teacher","yhzyw":"yx","yhzids":null},{"id":"56231964687794176","parentId":null,"name":"问卷调查","router":"/survey","type":1,"icon":"tiaochawenjuan","orderNum":1,"viewPath":"survey","keepalive":1,"isShow":1,"isExt":0,"openMode":1,"ywbs":"survey","sfbs":"teacher","allowh5":0,"service":2,"color":"#fcc02e","apiSign":null,"yhzsf":"teacher","yhzyw":"yx","yhzids":null},{"id":"56231964687794176","parentId":null,"name":"问卷调查","router":"/survey","type":1,"icon":"tiaochawenjuan","orderNum":1,"viewPath":"survey","keepalive":1,"isShow":1,"isExt":0,"openMode":1,"ywbs":"survey","sfbs":"teacher","allowh5":0,"service":2,"color":"#fcc02e","apiSign":null,"yhzsf":"teacher","yhzyw":"lx","yhzids":null},{"id":"1800730725559177218","parentId":"56231964687794176","name":"分发","router":"publish","type":2,"icon":null,"orderNum":null,"viewPath":null,"keepalive":1,"isShow":null,"isExt":0,"openMode":1,"ywbs":"survey","sfbs":"teacher","allowh5":1,"service":null,"color":null,"apiSign":null,"yhzsf":"teacher","yhzyw":"lx","yhzids":null},{"id":"1800730830521634817","parentId":"56231964687794176","name":"统计","router":"statistics","type":2,"icon":null,"orderNum":null,"viewPath":null,"keepalive":1,"isShow":null,"isExt":0,"openMode":1,"ywbs":"survey","sfbs":"teacher","allowh5":1,"service":null,"color":null,"apiSign":null,"yhzsf":"teacher","yhzyw":"lx","yhzids":null},{"id":"1800730361837522945","parentId":"56231964687794176","name":"编辑","router":"edit","type":2,"icon":null,"orderNum":null,"viewPath":null,"keepalive":1,"isShow":null,"isExt":0,"openMode":1,"ywbs":"survey","sfbs":"teacher","allowh5":1,"service":null,"color":null,"apiSign":null,"yhzsf":"teacher","yhzyw":"yx","yhzids":null},{"id":"1800730830521634817","parentId":"56231964687794176","name":"统计","router":"statistics","type":2,"icon":null,"orderNum":null,"viewPath":null,"keepalive":1,"isShow":null,"isExt":0,"openMode":1,"ywbs":"survey","sfbs":"teacher","allowh5":1,"service":null,"color":null,"apiSign":null,"yhzsf":"teacher","yhzyw":"yx","yhzids":null},{"id":"56231964687794176","parentId":null,"name":"问卷调查","router":"/survey","type":1,"icon":"tiaochawenjuan","orderNum":1,"viewPath":"survey","keepalive":1,"isShow":1,"isExt":0,"openMode":1,"ywbs":"survey","sfbs":"teacher","allowh5":0,"service":2,"color":"#fcc02e","apiSign":null,"yhzsf":"teacher","yhzyw":"xg","yhzids":null},{"id":"1800730725559177218","parentId":"56231964687794176","name":"分发","router":"publish","type":2,"icon":null,"orderNum":null,"viewPath":null,"keepalive":1,"isShow":null,"isExt":0,"openMode":1,"ywbs":"survey","sfbs":"teacher","allowh5":1,"service":null,"color":null,"apiSign":null,"yhzsf":"teacher","yhzyw":"yx","yhzids":null},{"id":"1800730361837522945","parentId":"56231964687794176","name":"编辑","router":"edit","type":2,"icon":null,"orderNum":null,"viewPath":null,"keepalive":1,"isShow":null,"isExt":0,"openMode":1,"ywbs":"survey","sfbs":"teacher","allowh5":1,"service":null,"color":null,"apiSign":null,"yhzsf":"teacher","yhzyw":"lx","yhzids":null},{"id":"1800730830521634817","parentId":"56231964687794176","name":"统计","router":"statistics","type":2,"icon":null,"orderNum":null,"viewPath":null,"keepalive":1,"isShow":null,"isExt":0,"openMode":1,"ywbs":"survey","sfbs":"teacher","allowh5":1,"service":null,"color":null,"apiSign":null,"yhzsf":"teacher","yhzyw":"xg","yhzids":null},{"id":"1800731095303852034","parentId":"56231964687794176","name":"下载","router":"download","type":2,"icon":null,"orderNum":null,"viewPath":null,"keepalive":1,"isShow":null,"isExt":0,"openMode":1,"ywbs":"survey","sfbs":"teacher","allowh5":1,"service":null,"color":null,"apiSign":null,"yhzsf":"teacher","yhzyw":"lx","yhzids":null},{"id":"1800730361837522945","parentId":"56231964687794176","name":"编辑","router":"edit","type":2,"icon":null,"orderNum":null,"viewPath":null,"keepalive":1,"isShow":null,"isExt":0,"openMode":1,"ywbs":"survey","sfbs":"teacher","allowh5":1,"service":null,"color":null,"apiSign":null,"yhzsf":"teacher","yhzyw":"xg","yhzids":null},{"id":"1800731095303852034","parentId":"56231964687794176","name":"下载","router":"download","type":2,"icon":null,"orderNum":null,"viewPath":null,"keepalive":1,"isShow":null,"isExt":0,"openMode":1,"ywbs":"survey","sfbs":"teacher","allowh5":1,"service":null,"color":null,"apiSign":null,"yhzsf":"teacher","yhzyw":"xg","yhzids":null}]},"time":"2024-07-31 10:10:42"}
        let menuMap = qx.data
        const { menus, buttons } = generateRouters(
          menuMap?.["survey"] ?? [],
          business || default_business
        );
        this.menus = menus;
        this.buttons = buttons;
        this.lastUpdateTime = new Date().getTime();
        // return { ...info };
      } catch (error) {
        return Promise.reject(error);
      }
    },
    async getPrimaryColor(): Promise<any | null> {
      const { data } = await getprimaryColor();
      const el = document.documentElement;
      el.style.setProperty("--el-color-primary", data?.zts || "#1890ff");
    },
    // 退出系统
    LogOut() {
      removeToken();
      this.token = "";
      this.userInfo = {};
    },
  },
});

// 在组件setup函数外使用
export function useUserStoreWithOut() {
  return useUserStore(store);
}

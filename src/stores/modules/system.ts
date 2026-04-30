import { store } from "@/stores";
import { defineStore } from "pinia";
import { getSystemConfig } from "@/api/system";
import { useTitle, useFavicon } from "@vueuse/core";

const title = useTitle(null);
const favicon = useFavicon();

export const useSysStore = defineStore("system", {
  state: () => ({
    lastUpdateTime: 0,
    siteTitle: "",
    favicon: "",
    logo: "",
    logo_text: "",
    copyright: "",
  }),
  actions: {
    async getSetting() {
      try {
        // const { data } = await getSystemConfig();
        // if (data) {
        //   this.siteTitle = data.title;
        //   // title.value = data.title;
        //   this.favicon = data.favicon;
        //   favicon.value = data.favicon;
        //   this.logo = data.logo;
        //   this.logo_text = data.logo_text;
        //   this.copyright = data.copyright;
        // }
      } catch (e) {
        return Promise.reject(e);
      } finally {
        this.lastUpdateTime = new Date().getTime();
      }
    },
  },
});

export function useSysStoreWithOut() {
  return useSysStore(store);
}

import { createApp } from "vue";
import { setupGlobDirectives } from "@/directives";
import "virtual:windi.css";
import "virtual:svg-icons-register";
import "@/assets/css/layout.css";
import "@/assets/css/form.css";
// if (import.meta.env.DEV) {
import "element-plus/dist/index.css";
// }
import App from "./App.vue";
import { setupStore } from "@/stores";
import { setupRouter } from "./router";

let instance: any = null;

function render() {
  instance = createApp(App);
  // 注册store
  setupStore(instance);
  // 注册路由
  setupRouter(instance);
  // 注册指令
  setupGlobDirectives(instance);

  instance.mount("#app");
}

render();

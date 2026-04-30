import { fileURLToPath, URL } from "node:url";
import type { UserConfig, ConfigEnv } from "vite";
import { loadEnv } from "vite";
import AutoImport from "unplugin-auto-import/vite";
import Components from "unplugin-vue-components/vite";
import {
  ElementPlusResolver,
  VantResolver,
} from "unplugin-vue-components/resolvers";
import vue from "@vitejs/plugin-vue";
import vueJsx from "@vitejs/plugin-vue-jsx";
import WindiCSS from "vite-plugin-windicss";
import legacy from "@vitejs/plugin-legacy";
// import path from "node:path";
import { createSvgIconsPlugin } from "vite-plugin-svg-icons";

const CWD = process.cwd();

export default ({ command, mode }: ConfigEnv): UserConfig => {
  // 环境变量
  const { VITE_BASE_URL } = loadEnv(mode, CWD);
  const isBuild = command === "build";

  return {
    base: VITE_BASE_URL,
    plugins: [
      vue(),
      vueJsx(),
      WindiCSS(),
      AutoImport({
        resolvers: [ElementPlusResolver()],
      }),
      Components({
        resolvers: [ElementPlusResolver(), VantResolver()],
        directoryAsNamespace: true,
      }),
      // legacy({
      //   targets: ["chrome 52"],
      //   additionalLegacyPolyfills: ["regenerator-runtime/runtime"],
      //   modernPolyfills: ["es.promise.finally", "es/array", "es/map", "es/set"],
      // }),
      createSvgIconsPlugin({
        iconDirs: [path.resolve(process.cwd(), "src/assets/svg")],
        symbolId: "svg-icon-[dir]-[name]",
      }),
    ],
    resolve: {
      alias: {
        "@": fileURLToPath(new URL("./src", import.meta.url)),
        vue: "vue/dist/vue.esm-bundler.js", // 定义vue的别名，如果使用其他的插件，可能会用到别名
      },
    },
    css: {
      preprocessorOptions: {
        less: {
          javascriptEnabled: true,
        },
      },
    },
    server: {
      host: "0.0.0.0",
      // host: "http://localhost",
      port: 6789,
      proxy: {
        "/zfsoft-api": {
          // target: "http://10.71.60.90:8099",
          target: "http://10.71.29.130:10030/",
          changeOrigin: true,
          rewrite: (path) => path.replace("/zfsoft-api", "/service-sxgl"),
        },
      },
    },
    esbuild: {
      pure: isBuild ? ["console.log", "debugger"] : [],
    },
    build: {
      outDir: "lowcode-survey",
    },
  };
};

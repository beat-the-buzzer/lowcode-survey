<template>
  <div class="login-container">
    <div class="header">
      <div class="min-w-1280px max-w-1440px flex items-center mx-auto">
        <img class="logo" :src="sysStore.logo_text" alt="" />
        <div class="divider"></div>
        <span class="title" :style="config['titleStyle']">{{
          config["title"]
        }}</span>
      </div>
    </div>
    <Login />
    <div
      class="copyright"
      :style="config['copyrightStyle']"
      v-html="sysStore['copyright']"
    ></div>
  </div>
</template>

<script setup lang="ts">
import Login from "./Login.vue";
import { useSysStore } from "@/stores/modules/system";
import { ref } from "vue";

const sysStore = useSysStore();

const config = ref({
  title: "问卷调查系统v1.0",
  copyright:
    '版权所有 Copyright 1999-2023 正方软件股份有限公司 <a href="http://beian.miit.gov.cn/" target="_blank" style="color:#0000FF!important;">&nbsp;浙ICP备11024936号-1</a>',
  titleStyle: "font-size:24px;font-weight:bold;",
  copyrightStyle: "font-size:12px",
});
</script>

<style lang="less" scoped>
.login-container {
  width: 100vw;
  height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
  background-image: url("/images/background.png");
  background-position: 100%;
  background-repeat: no-repeat;
  background-size: 100% 100%;
}

.header {
  height: 100px;
  display: flex;
  align-items: center;

  .logo {
    height: 50px;
    object-fit: fill;
  }
  .divider {
    width: 2px;
    height: 40px;
    margin: 0 20px;
    background-color: #90caf9;
  }
  .title {
    font-size: 24px;
    font-weight: bold;
  }
}

.copyright {
  height: 100px;
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>

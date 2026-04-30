<script setup lang="ts">
import zhCn from "element-plus/dist/locale/zh-cn.mjs";
import { RouterView } from "vue-router";
</script>

<template>
  <el-config-provider :locale="zhCn">
    <div id="app">
      <RouterView />
    </div>
  </el-config-provider>
</template>

<style lang="less" scoped></style>

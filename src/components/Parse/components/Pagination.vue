<template>
  <div class="flex items-center justify-center w-full">
    <el-button type="primary" v-if="config.attribute?.current > 1"
      >上一页</el-button
    >
    <el-button type="primary">下一页</el-button>
    <span class="text-slate-400 ml-20px">{{
      `第${config.attribute?.current}页/共${config.attribute?.total}页`
    }}</span>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";

const props = withDefaults(
  defineProps<{
    config: any;
  }>(),
  {
    config: () => {},
  }
);
</script>

<style></style>

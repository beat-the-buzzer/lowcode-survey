<template>
  <div class="w-100vw h-100vh flex justify-center items-center">
    <el-result
      icon="warning"
      title="问卷答题失败"
      :sub-title="messageEnum[route.query.state]"
    >
    </el-result>
  </div>
</template>

<script setup lang="ts">
import { reactive } from "vue";
import { useRoute } from "vue-router";
import { useBrowserLocation } from "@vueuse/core";

const location = useBrowserLocation();
console.log(location);

const messageEnum = {
  1: "问卷还在准备中...",
  2: "问卷已停止运行",
  3: "问卷尚未开放",
  4: "您不在问卷的答题指定范围内",
  5: "您已经回答过该问卷，请勿反复答卷",
};

const route = useRoute();
</script>

<style lang="less" scoped></style>

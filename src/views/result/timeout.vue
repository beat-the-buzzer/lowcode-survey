<template>
  <div class="w-100vw h-100vh flex justify-center items-center">
    <el-result icon="error" title="问卷答题超时" sub-title="感谢您的参与！">
      <template #extra>
        <el-button type="primary" v-if="route.query?.id" @click="handleBack"
          >重新作答</el-button
        >
      </template>
    </el-result>
  </div>
</template>

<script setup lang="ts">
import { useRoute, useRouter } from "vue-router";

const route = useRoute();
const router = useRouter();

const handleBack = () => {
  router.push({ name: "detail", query: { id: route.query?.id } });
};
</script>

<style lang="less" scoped></style>

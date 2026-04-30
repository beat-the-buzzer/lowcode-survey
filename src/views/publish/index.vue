<template>
  <div class="min-w-1280px max-w-1440px mx-auto">
    <Open />
    <div v-if="mode === 'user'" class="distribute">
      <div class="text-lg">问卷分发</div>
      <el-divider />
      <!--      <User v-if="!isBusiness" />-->
      <Business />
    </div>
  </div>
</template>
<script setup lang="ts">
import { ref, onMounted, computed } from "vue";
import { getConfig } from "@/api";
import Open from "./components/open.vue";
import User from "./components/user.vue";
import Business from "./components/business.vue";
import { ElMessage } from "element-plus";
import { useRoute } from "vue-router";
import { getRecords } from "@/api/distribute";

const route = useRoute();

const isBusiness = computed(() => route.params.ywlx !== "ty");

const mode = ref("open");

const initConfig = async () => {
  if (route.query?.id) {
    const { data } = await getConfig(route.query?.id);
    mode.value = data.dtr;
  }
};

onMounted(() => {
  initConfig();
});
</script>
<style lang="less" scoped>
.distribute {
  margin-top: 20px;
  padding: 20px 50px;
  box-shadow: rgba(0, 0, 0, 0.16) 0 1px 4px;
}

:deep(.el-divider--horizontal) {
  margin: 15px 0;
}
</style>

<template>
  <div
    v-loading="loading"
    class="w-100vw h-100vh flex flex-col justify-center items-center"
  >
    <div>
      <div v-html="message" class="richText" v-if="route.query?.id"></div>
      <el-result
        v-else
        icon="success"
        title="您的信息已提交"
        sub-title="感谢参与！"
      >
      </el-result>
    </div>
    <div class="text-center mt-50px" v-if="goButton">
      <el-button type="primary" @click="handleNext">下一步</el-button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import { getSurvey } from "@/api";
import { useRoute } from "vue-router";
import { ElMessage } from "element-plus";
import { useTitle } from "@vueuse/core";

const route = useRoute();
const loading = ref(false);
const message = ref("");
const goButton = ref(false);
const link = ref("");

const handleNext = () => {
  if (link.value) {
    window.location.replace(`${window.location.protocol}//${link.value}`);
  }
};

onMounted(async () => {
  if (route.query?.id) {
    loading.value = true;
    const { data } = await getSurvey(route.query?.id);
    useTitle(data["wjmc"]);
    try {
      if (data.wjnr) {
        const survey = JSON.parse(data.wjnr);
        message.value = survey.config?.afterSubmit?.content || "";
        goButton.value = survey.config?.afterSubmit?.action.includes("2");
        link.value = survey.config?.afterSubmit?.link || "";
      }
    } catch (error) {
      ElMessage.error("问卷格式异常，请联系管理员查看！");
    } finally {
      loading.value = false;
    }
  }
});
</script>

<style lang="less" scoped>
.richText {
  :deep(img) {
    display: inline-block;
  }
}
</style>

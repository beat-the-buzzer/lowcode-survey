<template>
  <div id="survey-answer-container" v-loading="loading" class="min-h-100vh">
    <div v-if="!loading">
      <mobile
        v-if="isMobile"
        read-only
        :surveyData="survey"
        :answers="answers"
      />
      <pc v-else read-only collect :surveyData="survey" :answers="answers" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, nextTick, onMounted, ref } from "vue";
import pc from "./components/pc.vue";
import mobile from "./components/mobile.vue";
import { getSurvey, getSurveyAnswers } from "@/api";
import { useRoute, useRouter } from "vue-router";
import { ElMessage } from "element-plus";
import { calcHeight } from "@/microapp/message";
import { emptySurvey } from "@/const/survey";

const survey = ref<any>({});
const answers = ref<any>({});
const loading = ref(true);

const route = useRoute();
const router = useRouter();

const isMobile = computed(() => {
  return navigator.userAgent.match(
    /(phone|pad|pod|iPhone|iPod|ios|iPad|Android|Mobile|BlackBerry|IEMobile|MQQBrowser|JUC|Fennec|wOSBrowser|BrowserNG|WebOS|Symbian|Windows Phone)/i
  );
});

const initSurvey = async () => {
  if (route.query?.id) {
    loading.value = true;
    try {
      const { data } = await getSurvey(route.query?.id);
      const { data: _answers } = await getSurveyAnswers(route.query.djid);
      if (data.wjnr) {
        survey.value = JSON.parse(data.wjnr);
      } else {
        survey.value = emptySurvey(data.wjmc);
      }
      if (_answers?.djnr) {
        answers.value = JSON.parse(_answers?.djnr);
      }
    } catch (error) {
      ElMessage.error("问卷格式异常，请联系管理员查看！");
    } finally {
      loading.value = false;
    }
  }
};

onMounted(async () => {
  await initSurvey();
  nextTick(() => {
    calcHeight(
      document.getElementById("survey-answer-container")?.offsetHeight
    );
  });
});
</script>

<style lang="less" scoped>
.affix {
  width: 100vw;
  position: fixed;
  top: 0;
  z-index: 100;
  background-color: #fff;
  box-shadow: rgba(0, 0, 0, 0.24) 0 0 8px;
}
.header {
  height: 40px;
  margin: 0 auto;
  display: flex;
  align-items: center;
  position: relative;
}
</style>

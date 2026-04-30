<template>
  <div id="survey-answer-container" v-loading="loading" class="min-h-100vh">
    <div v-if="!loading">
      <div
        class="affix"
        v-if="survey.config?.countdown || survey.config?.progress"
      >
        <div class="header" :style="{ width: isMobile ? '100%' : '1280px' }">
          <Progress
            :style="{ width: isMobile ? 'calc(100vw - 100px)' : '800px' }"
            v-if="survey.config?.progress"
            :current="progressConfig.current"
            :total="progressConfig.total"
            :type="survey.config.progress"
          />
          <Countdown
            class="w-85px absolute right-0"
            v-if="survey.config?.countdown"
            :config="countdownConfig"
            @finish="handleCountdownFinish"
          />
        </div>
      </div>
      <MobileParse
        v-if="isMobile"
        :surveyData="survey"
        :form="formModel"
        collect
        @answer-success="handleAnswerSuccess"
        @answer-error="handleAnswerError"
        @answer-submit="handleAnswerSubmit"
        @page-change="handlePageChange"
      />
      <Parse
        v-else
        :surveyData="survey"
        :form="formModel"
        collect
        @answer-success="handleAnswerSuccess"
        @answer-error="handleAnswerError"
        @answer-submit="handleAnswerSubmit"
        @page-change="handlePageChange"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref, computed, onMounted, nextTick } from "vue";
import Parse from "@/components/Parse/index.vue";
import MobileParse from "@/components/mobile";
import Progress from "@/components/Progress/index.vue";
import Countdown from "@/components/Countdown/index.vue";
import { getSurvey, getSurveyAnswers, submitAnswer } from "@/api";
import { isAnswerRange } from "@/api/user";
import { useRoute, useRouter } from "vue-router";
import { ElMessage, ElMessageBox } from "element-plus";
import { answerComplete, calcHeight } from "@/microapp/message";
import { emptySurvey } from "@/const/survey";

const survey = ref<any>({});
const config = ref<any>({});
const loading = ref(true);
const surveyType = ref("wj");
const formModel = ref<any>({});

const route = useRoute();
const router = useRouter();

const isMobile = computed(() => {
  return navigator.userAgent.match(
    /(phone|pad|pod|iPhone|iPod|ios|iPad|Android|Mobile|BlackBerry|IEMobile|MQQBrowser|JUC|Fennec|wOSBrowser|BrowserNG|WebOS|Symbian|Windows Phone)/i
  );
});

const progressConfig = reactive({
  current: 0,
  total: 10,
  type: "question",
});

const countdownConfig = reactive({
  timeLength: 0,
  timeType: "1",
  timeUnit: "1",
});

let map = new Map();

const initConfig = (config: any) => {
  // 答题进度条
  const { progress } = config;
  if (progress === "1") {
    progressConfig.total = survey.value.list.filter(
      (item) => !["pagination", "paragraph"].includes(item.type)
    ).length;
  } else if (progress === "2") {
    const pagination = survey.value.list.find(
      (item) => item.type === "pagination"
    );
    progressConfig.total = pagination ? pagination.attribute.total : 1;
  }
  // 倒计时
  const { countdown, timeType, timeUnit, timeLength } = config;
  if (countdown) {
    countdownConfig.timeLength = timeLength;
    countdownConfig.timeType = timeType;
    countdownConfig.timeUnit = timeUnit;
  }
};

const handleAnswerSuccess = (id: string, value: any) => {
  map.set(id, value);
  const { progress } = config.value;
  if (progress === "1") {
    progressConfig.current = map.size;
  }
};

const handleAnswerError = (id: string) => {
  if (map.has(id)) {
    map.delete(id);
    const { progress } = config.value;
    if (progress === "1") {
      progressConfig.current = map.size;
    }
  }
};

const handlePageChange = (current: number) => {
  const { progress } = config.value;
  if (progress === "2") {
    progressConfig.current = current;
  }
};

// 问卷提交
const handleAnswerSubmit = async (values: any) => {
  const body: any = {
    wjid: route.query?.id,
    djnr: JSON.stringify(values),
    sblx: isMobile.value ? "mobile" : "pc",
    sfnm: config.value.submitMethod,
  };

  if (surveyType.value === "cj") {
    body.djrlx = "student";
    body.sfnm = "0";
  }
  if (route.query?.xsid) {
    body.djr = route.query.xsid;
  }
  if (route.query?.djid) {
    body.djid = route.query.djid;
  }
  try {
    await submitAnswer(body);
    if (route.query?.id) {
      answerComplete(route.query.id as string);
    }
    handleAfterSubmitMethod(values);
  } catch (e) {
    console.log(e);
  }
};

/**
 * @description: 提交后显示
 * @param values 答卷
 * @return {*}
 */
const handleAfterSubmitMethod = (values: any) => {
  const { afterSubmit } = config.value;
  // 有条件跳转
  if (afterSubmit.method === "1") {
    //
    let flag = true;
    const groups = afterSubmit.conditionsGroup;
    for (let index = 0; index < groups.length; index++) {
      const group = groups[index];
      const conditions = group.conditions;
      for (let i = 0; i < conditions.length; i++) {
        if (!flag) break;
        const condition = conditions[i];
        const { question, answer, operator } = condition;
        // 等于(=)
        if (operator === "1" && !values[question]?.[answer]) {
          flag = false;
          break;
          //
        }
      }
    }
    if (flag) {
      handleAfterSubmitAction();
    } else {
      router.push({ name: "success" });
    }
  }
  // 无条件跳转
  else if (afterSubmit.method === "2") {
    handleAfterSubmitAction();
  } else {
    router.push({ name: "success" });
  }
};

/**
 * @description: 提交后执行动作
 * @return {*}
 */
const handleAfterSubmitAction = () => {
  const { afterSubmit } = config.value;
  if (afterSubmit.action.includes("1")) {
    // 显示信息
    router.push({ name: "success", query: { id: route.query?.id } });
  } else if (afterSubmit.action.includes("2")) {
    // 链接跳转
    window.location.replace(`${window.location.protocol}//${afterSubmit.link}`);
  } else {
    // 默认
    router.push({ name: "success", query: { id: route.query?.id } });
  }
};

const handleCountdownFinish = () => {
  ElMessage.warning("问卷答题已超时！");
  router.push({ name: "timeout", query: { id: route.query?.id } });
};

const initSurvey = async () => {
  if (route.query?.id) {
    loading.value = true;
    try {
      const { data } = await getSurvey(route.query?.id);
      surveyType.value = data["wjlx"];
      if (data.wjnr) {
        survey.value = JSON.parse(data.wjnr);
      } else {
        survey.value = emptySurvey(data.wjmc);
      }
      if (surveyType.value === "cj" && route.query.djid) {
        const { data: _answers } = await getSurveyAnswers(route.query.djid);
        formModel.value = JSON.parse(_answers?.djnr);
      }
      config.value = survey.value.config;
      initConfig(config.value);
    } catch (error) {
      ElMessage.error("问卷格式异常，请联系管理员查看！");
    } finally {
      loading.value = false;
    }
  }
};

const isUserCanAnswer = async () => {
  let bool: any = null;
  try {
    const { data } = await isAnswerRange({
      wjid: route.query?.id,
      user: route.query.user,
    });
    bool = data;
  } finally {
    if (bool == "0") {
      window.location.replace("/survey/403");
    } else {
      if (bool == "2") {
        router.push({ name: "IdentityCheck", query: route.query });
      } else {
        await initSurvey();
        nextTick(() => {
          calcHeight(
            document.getElementById("survey-answer-container")?.offsetHeight
          );
        });
      }
    }
  }
};

onMounted(async () => {
  await isUserCanAnswer();
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

<template>
  <div id="survey-answer-container" v-loading="loading" class="min-h-100vh">
    <div v-if="!loading">
      <mobile
        v-if="isMobile"
        read-only
        class="py-50px"
        :surveyData="survey"
        :answers="answers"
      />
      <pc
        v-else
        read-only
        :surveyData="survey"
        :answers="answers"
        class="py-50px min-h-100vh"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, nextTick, onMounted, ref } from "vue";
import pc from "./components/pc.vue";
import mobile from "./components/mobile.vue";
import { 
  // getSurvey, 
  getSurveyAnswers
   } from "@/api";
import { useRoute, useRouter } from "vue-router";
import { ElMessage } from "element-plus";
import { calcHeight } from "@/microapp/message";
import { emptySurvey } from "@/const/survey";
import { getSurvey, getAnswer } from "@/api/dgsx";

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

const parseQueryStr = (query: string): any => {
  const obj: any = {};
  const kvMatches = query.matchAll(/([^?=&]*)=([^&]*)/g);
  for (const match of kvMatches) {
    obj[match[1]] = match[2];
  }
  return obj;
};

const initSurvey = async () => {
  if (route.query?.pjmbmcb_id) {
    loading.value = true;
    try {
      const { data } = await getSurvey(route.query?.pjmbmcb_id, null);
      let survetTmp = JSON.parse(data.mbJsonString)
      console.log(survetTmp)
      survetTmp.list.push({
        attribute: {required: true, qzz: 1, zblx: '', skipPath: ''},
        children: [{
          attribute: { inputType: "string" },
          id: "py_children"
        }],
        id: "py",
        // index: 4,
        title: "评语",
        type: "mult_text"
      })
      // survey.value = JSON.parse(data.mbJsonString)
      survey.value = survetTmp
      console.log(survey.value)

      let res = await getAnswer(route.query?.xspjxxb_id)
      if (res.status === 'success') {
      let pjxxObj = JSON.parse(res.data.pjxxJsonString)
        answers.value = pjxxObj.answer;
        console.log(answers.value)
      }

      // useTitle(data["wjmc"]);
      // surveyType.value = data["wjlx"];
      // if (data.wjnr) {
      //   survey.value = JSON.parse(data.wjnr);
      // } else {
      //   survey.value = emptySurvey(data.wjmc);
      // }
      // if (surveyType.value === "cj" && route.query.djid) {
      //   const { data: _answers } = await getSurveyAnswers(route.query.djid);
      //   formModel.value = JSON.parse(_answers?.djnr);
      // }
      // config.value = survey.value.config;
      // initConfig(config.value);
    } catch (error) {
      ElMessage.error("问卷格式异常，请联系管理员查看！");
    } finally {
      loading.value = false;
    }
  }
  return;
  // if (route.query?.id) {
  //   loading.value = true;
  //   try {
  //     const queryParams = parseQueryStr(
  //       decodeURIComponent(window.location.href)
  //     );
  //     const _wjid = queryParams.id.split("&djid");
  //     const { data } = await getSurvey(_wjid[0]);
  //     const { data: _answers } = await getSurveyAnswers(queryParams.djid);
  //     if (data.wjnr) {
  //       survey.value = JSON.parse(data.wjnr);
  //     } else {
  //       survey.value = emptySurvey(data.wjmc);
  //     }
  //     if (_answers?.djnr) {
  //       answers.value = JSON.parse(_answers?.djnr);
  //     }
  //   } catch (error) {
  //     ElMessage.error("问卷格式异常，请联系管理员查看！");
  //   } finally {
  //     loading.value = false;
  //   }
  // }
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

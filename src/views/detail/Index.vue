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
        class="py-50px"
        :surveyData="survey"
        :form="formModel"
        :readOnly="readOnly"
        @answer-success="handleAnswerSuccess"
        @answer-error="handleAnswerError"
        @answer-submit="handleAnswerSubmit"
        @answer-save="handleAnswerSave"
        @page-change="handlePageChange"
      />
      <Parse
        v-else
        :surveyData="survey"
        :form="formModel"
        class="py-50px min-h-100vh"
        :readOnly="readOnly"
        @answer-success="handleAnswerSuccess"
        @answer-error="handleAnswerError"
        @answer-submit="handleAnswerSubmit"
        @answer-save="handleAnswerSave"
        @page-change="handlePageChange"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref, computed, onMounted, nextTick } from "vue";
import Parse from "@/components/Parse/index.vue";
import MobileParse from "@/components/Parse/mobile.vue";
import Progress from "@/components/Progress/index.vue";
import Countdown from "@/components/Countdown/index.vue";
import { 
  getSurveyDetail,
  getSurveyTbxx,
  } from "@/api";
import { getSurvey, saveAnswer, submitAnswer, getAnswer } from "@/api/dgsx";
import { isAnswerRange } from "@/api/user";
import { useRoute, useRouter } from "vue-router";
import { ElMessage, ElMessageBox } from "element-plus";
import { answerComplete, calcHeight } from "@/microapp/message";
import { emptySurvey } from "@/const/survey";
import { useTitle } from "@vueuse/core";

const survey = ref<any>({});
const config = ref<any>({});
const loading = ref(true);
const surveyType = ref("wj");
const formModel = ref<any>({});
const readOnly = ref(false)
const ywId = ref<string>('')
const pjmbmcbId = ref<string>('')
const xspjxxbId = ref<string>('')

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

const genSubmitParam = (values: any) => {
  let otherParams = route.query.params // 如果URL上携带了这个参数，就拼一下
  let params = {
    tb_json_str: JSON.stringify(values),
    id: route.query.ywid,
    wjmbb_id: route.query.wjmbb_id,
    // 如果存在第三个参数，就带一下
  }
  if(!!otherParams) {
    params.params = JSON.parse(otherParams)
  }
  return params
}
function updateOpener() {
    let opener = window.opener;
    opener && opener.postMessage('update');
  }
// 问卷提交
const handleAnswerSubmit = async (values: any) => {
  const ywlx = route.query?.ywlx
  const params = genSubmitParam(values)
  let res = await submitAnswer(params, ywlx)
  // 自动关闭
  ElMessage({
    message: '已提交！',
    type: 'success',
  })
  updateOpener() // 触发前一个页面的更新页面的方法

  if(ywlx == '3') {
    // 评价提交后，跳转到查看的页面 又把业务写到这里了
    const url = `${window.location.origin}/survey-sxgl/#/detail?wjmbb_id=${route.query?.wjmbb_id}&ywlx=3&ywid=${res?.data?.pj_id || ''}&isView=1`;
    location.replace(url)
  } else if(ywlx == '1') {
    const url = `${window.location.origin}/survey-sxgl/#/detail?wjmbb_id=${route.query?.wjmbb_id}&ywlx=2&ywid=${res?.data || ''}&isView=1`;
    location.replace(url)
  } else if(ywlx == '2') {
    const url = `${window.location.origin}/survey-sxgl/#/detail?wjmbb_id=${route.query?.wjmbb_id}&ywlx=2&ywid=${route.query?.ywid}&isView=1`;
    location.replace(url)
  } else if(ywlx == '4') {
    const url = `${window.location.origin}/survey-sxgl/#/detail?wjmbb_id=${route.query?.wjmbb_id}&ywlx=5&ywid=${res?.data || ''}&isView=1`;
    location.replace(url)
  } else if(ywlx == '5') {
    const url = `${window.location.origin}/survey-sxgl/#/detail?wjmbb_id=${route.query?.wjmbb_id}&ywlx=5&ywid=${route.query?.ywid}&isView=1`;
    location.replace(url)
  }

  location.reload()

};

const handleAnswerSave = async (values: any) => {
  const params = genSubmitParam(values)
  let res = await saveAnswer(params)
  console.log(res)
  if (res.status.includes('success')) {
    ElMessage({
      message: res.message,
      type: 'success',
    }) 
    xspjxxbId.value = res.data
    // console.log(2222222222)
    // console.log(xspjxxbId.value)
  }
}

/**
 * @description: 提交后执行动作
 * @return {*}
 */
const handleAfterSubmitAction = () => {
  const { afterSubmit } = config.value;
  if (afterSubmit.action.includes("1")) {
    // 显示信息
    // router.push({ name: "success", query: { id: route.query?.id } });
    window.location.replace(`/survey/success?id=${route.query?.id}`);
  } else if (afterSubmit.action.includes("2")) {
    // 链接跳转
    window.location.replace(`${window.location.protocol}//${afterSubmit.link}`);
  } else {
    // 默认
    window.location.replace(`/survey/success?id=${route.query?.id}`);
    // router.push({ name: "success", query: { id: route.query?.id } });
  }
};

const handleCountdownFinish = () => {
  ElMessage.warning("问卷答题已超时！");
  // let map = new Map(Object.entries(obj));
  window.location.replace(`/survey/timeout?id=${route.query?.id}`);
  // router.push({ name: "timeout", query: { id: route.query?.id } });
};

const initSurvey = async () => {
  if (route.query?.wjmbb_id) {
    // loading.value = true;
    // loading.value = false;
    try {
      const { data } = await getSurveyDetail({ wjmbb_id: route.query?.wjmbb_id });
      let survetTmp = JSON.parse(data.mb_json_str)
      survey.value = survetTmp
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
  // let bool: any = null;
  // try {
  //   const { data } = await isAnswerRange({
  //     wjid: route.query?.id,
  //     user: route.query.user,
  //   });
  //   bool = data;
  // } finally {
  //   if (bool == "0") {
  //     window.location.replace("/survey/403");
  //   } else {
  //     if (bool == "2") {
  //       router.push({ name: "IdentityCheck", query: route.query });
  //     } else {
        await initSurvey(); // 先渲染出来问卷了

      

    //     nextTick(() => {
    //       calcHeight(
    //         document.getElementById("survey-answer-container")?.offsetHeight
    //       );
    //     });
    //   }
    // }
  // }
};

onMounted(async () => {
  const currentRouteObj: any = { ...router.currentRoute }
  const queryParams = currentRouteObj._value.query

  // if (queryParams && queryParams.hasOwnProperty('sessionid')) {
  //   console.log('SESSIONID', queryParams.sessionid)
  //   localStorage.setItem('SESSIONID', queryParams.sessionid)
  // }

  // if (queryParams) {
  //   if (queryParams.hasOwnProperty('ywId')) {
  //     ywId.value = queryParams.ywId
  //   }

  //   if (queryParams.hasOwnProperty('pjmbmcb_id')) {
  //     pjmbmcbId.value = queryParams.pjmbmcb_id
  //   }

  //   if (queryParams.hasOwnProperty('xspjxxb_id')) {
  //     xspjxxbId.value = queryParams.xspjxxb_id
  //   }
  // }

  await isUserCanAnswer();

  // isView 1-查看 2-编辑 ''-新增
  if(route.query?.isView == '1') {
    readOnly.value = true
  }

  if (route.query?.isView && route.query?.ywid) {
    // console.log('调用接口查看')
    const res = await getSurveyTbxx({
      id: route.query?.ywid
    }, route.query?.ywlx)
    try {
      formModel.value = JSON.parse(res.data.tb_json_str)
    } catch(e) {
      formModel.value = {}
    }
  }
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

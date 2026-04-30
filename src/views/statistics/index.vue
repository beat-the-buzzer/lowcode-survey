<template>
  <div>
    <div class="container" v-if="!loading">
      <Outline class="survey-outline fixed" :formData="surveyData"></Outline>
      <div class="w-260px mr-20px"></div>
      <div class="content">
        <div class="flex justify-end p-10px">
          <el-button @click="handleExportPDF">保存本报告</el-button>
          <el-button @click="handleExport">导出原始答卷</el-button>
        </div>
        <div id="exportPdf-content">
          <div class="exportPdf-item">
            <div v-html="surveyData.config.title"></div>
          </div>
          <Actual
            class="exportPdf-item py-20px"
            :data="statisData"
            :mode="mode"
          />
          <div
            v-for="(item, index) in questions"
            :key="item.id"
            :class="`exportPdf-item question-${item.id} px-20px`"
          >
            <div>
              <span>{{ `${index + 1}、` }}</span>
              <span class="q-type">{{ `[${typeEnum[item.type]}]` }}</span>
              <span>{{ rexFilter(item.title) }}</span>
            </div>
            <component
              :is="dom[item.type]"
              :question="item"
              :content="findContent(item.id)"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, shallowRef, onMounted, nextTick, computed } from "vue";
import Outline from "./components/Outline.vue";
import Actual from "./components/Actual.vue";
import { typeEnum } from "@/enums/questionEnum";
import * as Elements from "./components/export";
import { rexFilter } from "@/utils/transform";
import { getSurvey, getStatistics } from "@/api";
import { useRoute, useRouter } from "vue-router";
import { ElMessage, ElLoading } from "element-plus";
import { downloadXlsx } from "@/utils/download";
import { outputPDF } from "@/utils/htmlToPdf";

const route = useRoute();
const router = useRouter();

const loading = ref(true);

const dom = shallowRef<any>({
  ...Elements,
});

const surveyData = ref<any>({
  config: {},
});
const statisData = ref<any>({});
let surveyName = "";
const mode = ref("");

const questions = computed(() => {
  return surveyData.value?.list
    ? surveyData.value.list.filter(
        (item) => !["pagination", "paragraph"].includes(item.type)
      )
    : [];
});

const getSurveyData = async () => {
  if (route.query?.id) {
    const { data } = await getSurvey(route.query?.id);
    surveyName = data.wjmc;
    mode.value = data.dtr;
    try {
      if (data.wjnr) {
        surveyData.value = JSON.parse(data.wjnr);
      }
    } catch (error) {
      ElMessage.error("问卷格式异常，请联系管理员查看！");
      router.push({ name: "list" });
    }
  }
};

const getStatisData = async () => {
  if (route.query?.id) {
    const { data } = await getStatistics(route.query?.id);
    statisData.value = data;
  }
};

const findContent = (id: string) =>
  statisData.value.wtArr.find((item: any) => item.wtid === id);

const handleExport = async () => {
  await downloadXlsx(
    "wjxx",
    route.query?.id as string,
    `${surveyName}-答卷下载`
  );
};

const handleExportPDF = async () => {
  outputPDF(
    "exportPdf-content",
    "exportPdf-item",
    rexFilter(surveyData.value.config.title)
  );
};

onMounted(async () => {
  loading.value = true;
  const loadingInstance = ElLoading.service({
    lock: true,
    text: "数据加载中...",
    background: "rgba(0, 0, 0, 0.3)",
  });
  try {
    await getSurveyData();
    await getStatisData();
  } finally {
    loading.value = false;
    await nextTick(() => {
      loadingInstance.close();
    });
  }
});
</script>
<style lang="less" scoped>
.container {
  width: 1280px;
  margin: 0 auto;
  display: flex;
  padding: 20px 0;
}
.survey-outline {
  width: 260px;
  margin-right: 20px;
  height: calc(100vh - 110px);
  overflow-y: auto;
  box-shadow: rgba(0, 0, 0, 0.1) 0 0 5px;
}
.content {
  width: 1000px;
  // height: calc(100vh - 40px);
  // overflow-y: auto;
  box-shadow: rgba(0, 0, 0, 0.1) 0 0 5px;
}

.q-type {
  color: #999999;
  margin-right: 5px;
}
</style>

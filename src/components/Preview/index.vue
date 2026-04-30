<template>
  <div id="survey-preview">
    <div class="flex justify-center mb-20px">
      <el-radio-group v-model="mode">
        <el-radio-button label="1">
          <el-icon><Monitor /></el-icon>
        </el-radio-button>
        <el-radio-button label="2">
          <el-icon><Iphone /></el-icon>
        </el-radio-button>
      </el-radio-group>
    </div>
    <Parse
      :survey-data="surveyData"
      :form="formModel"
      v-if="mode === '1' && !loading"
      class="survey-pc-wrapper"
    />
    <MobileParse
      :survey-data="surveyData"
      v-if="mode === '2' && !loading"
      :form="formModel"
      class="survey-mobile"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, nextTick, computed } from "vue";
import Parse from "@/components/Parse/index.vue";
import MobileParse from "@/components/Parse/mobile.vue";
import { useRoute, useRouter } from "vue-router";
import { getSurvey } from "@/api";
import { ElMessage, ElLoading } from "element-plus";
import { Iphone, Monitor } from "@element-plus/icons-vue";

const route = useRoute();
const router = useRouter();

const props = defineProps({
  previewData: {
    type: Object,
    default: () => {},
  },
  formData: {
    type: Object,
    default: () => {},
  }
});

const mode = ref("1");
const surveyData = ref<any>({});
const loading = ref(true);

const formData = computed(() => {
  return props.formData;
})

const formModel = ref<any>({})


onMounted(async () => {
  const loadingInstance = ElLoading.service({
    target: document.getElementById("survey-preview") || document.body,
  });
  loading.value = true;
  if (route.name === "preview") {
    if (route.query?.id) {
      const { data } = await getSurvey(route.query.id);
      try {
        surveyData.value = JSON.parse(data.wjnr);
      } catch (error) {
        ElMessage.error("问卷内容格式错误请重新编辑！");
        router.push({ name: "list" });
      }
    }
  } else {
    surveyData.value = props.previewData;
    console.log(surveyData.value)
  }

  for (let i = 0; i < surveyData.value?.list.length; i++) {
    if (surveyData.value.list[i].type !== 'paragraph') {
      formModel.value[surveyData.value.list[i].id] = undefined
    }
  }
  loading.value = false;
  nextTick(() => {
    loadingInstance.close();
  });
});
</script>

<style lang="less" scoped>
.survey-pc-wrapper {
  // max-height: 1123px;
  margin: 0 auto;
  padding: 30px  0;
  box-shadow: rgba(0, 0, 0, 0.24) 0 3px 8px;
}

.survey-mobile {
  position: sticky;
  top: 36px;
  display: flex;
  flex-direction: column;
  width: 320px;
  min-width: 320px;
  height: 693.33333333px;
  margin: 0 auto;
  overflow-y: auto;
  overflow-x: hidden;
  border-radius: 32px;
  box-shadow: 0 0 0 14px #090a0d, 0 0 0 16px #9fa3a8,
    0 4px 20px 16px rgba(0, 0, 0, 0.10196078431372549);
  ::-webkit-scrollbar {
    display: none;
  }
}

:deep(.el-form-item.is-error) {
  border: 1px dashed #f55;
}
</style>

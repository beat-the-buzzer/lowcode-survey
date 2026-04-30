<template>
  <div
    :style="{
      background: `url(${surveyData?.config?.bgUrl})`,
      backgroundRepeat: 'no-repeat',
      backgroundSize: 'cover',
      backgroundAttachment: 'fixed',
    }"
  >
    <div
      class="survey-pc"
      :style="
        collect
          ? 'border:1px solid #ededef'
          : 'box-shadow: rgba(0, 0, 0, 0.24) 0 3px 8px'
      "
    >
      <img
        v-if="surveyData.config?.phUrl"
        class="page-header"
        :src="surveyData.config?.phUrl"
        alt=""
      />
      <div class="p-20px" v-if="false">
        <div class="my-20px">
          <div v-html="surveyData.config.title"></div>
          <!-- <h1 style="text-align: center;font-size: 30px; font-weight: bold;">评价</h1> -->
        </div>
        <!-- <div
          class="my-20px"
          v-if="currentPage == 1"
          v-html="surveyData.config?.desc"
        ></div> -->
      </div>
      <el-form
        ref="surveyRef"
        :model="formModel"
        label-position="top"
        class="px-40px py-20px"
        hide-required-asterisk
        scroll-to-error
      >
        <!-- 分页 -->
        <div v-for="item in skipPageList" :key="item.pageIndex">
          <div v-show="currentPage === item.pageIndex">
            <!-- 分页中的问题 -->
            <template v-for="question in item.questions" :key="question.id">
              <!-- <div
                v-if="question.type === 'paragraph'"
                v-html="question.title"
              ></div> -->
              <form-item
                v-if="showQuestion(question)"
                :question="question"
                :surveyConfig="surveyData.config"
                :formModel="formModel"
                :read-only="readOnly"
                @trigger-skip="triggerSkip"
                @answer-success="handleAnswerSuccess"
                @answer-error="handleAnswerError"
              ></form-item>
            </template>
          </div>
        </div>
        <!-- <div class="p-20px" v-if="currentPage === totalPage">
          <div class="m-20px" v-html="surveyData.config.suffix"></div>
        </div> -->
        <div
          v-if="!readOnly"
          class="flex items-center justify-center flex-col p-20px"
        >
          <div>
            <el-button v-if="currentPage > 1" type="primary" @click="prePage"
              >上一页</el-button
            >
            <el-button v-if="!isLastPage" type="primary" @click="nextPage"
              >下一页</el-button
            >
            <!-- <el-button v-if="isLastPage" @click="handleSave"
              >保存</el-button
            > -->
            <el-button type="primary" v-if="isLastPage && isView != '1'" @click="handleSubmit"
              >提交</el-button
            >
          </div>
        </div>
      </el-form>
      <div class="p-20px text-center" v-if="totalPage > 1">
        {{ `第${currentPage}页/共${totalPage}页` }}
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";
import FormItem from "./components/FormItem.vue";
import { useSurvey } from "@/hooks/useSurvey";
import { generateAnswer } from "@/components/Parse/utils/answer";

import { useRoute, useRouter } from "vue-router";

const route = useRoute();
const router = useRouter();

const isView = route.query.isView

const props = withDefaults(
  defineProps<{
    surveyData: any;
    form?: any;
    readOnly?: boolean;
    collect?: boolean;
  }>(),
  {
    surveyData: () => {},
    form: () => {},
    readOnly: false,
    collect: false,
  }
);

const emit = defineEmits([
  "answerSuccess",
  "answerError",
  "answerSubmit",
  "answerSave",
  "pageChange",
]);

const surveyRef = ref<any>();
// const formModel = ref<any>(props.form ?? {});

const formModel = computed(() => {
  return props.form;
})

// 设置关联题目是否展示
const showQuestion = (question) => {
  let gltj = question?.attribute?.gltj || {}
  let { gltm_id, gllx, glxx } = gltj

  if(gltm_id) {
    // 有关联题目的逻辑 先去查一下关联的选项
    let opt = formModel.value[gltm_id] || {} // 这个是关联题目现在的选项
    // 这里还要区分一下单选和多选的情况
    if(gllx == '1') {
      // glxx中只要有一个存在，那就是true
      return (glxx || []).some(v => opt[v])
    } else if(gllx == '2') {
      return (glxx || []).every(v => opt[v])
    } else {
      return true
    }
  } else {
    return true
  }
}

const {
  skipPageList,
  currentPage,
  totalPage,
  triggerSkip,
  prePage,
  nextPage,
  isLastPage,
} = useSurvey(props.surveyData, formModel, surveyRef, emit);

// console.log(2222222222222222)
// console.log(skipPageList)
// const skipPageListReal = ref<any[]>([])
// let skipPageListTmp = Object.assign([], skipPageList.value)
// for (let i = 0; i < skipPageListTmp.length; i++) {
//   let skipPageListItemQuestion:any[] = []
//   console.log(skipPageListTmp[i])
//   for (let j = 0; j < skipPageListTmp[i].question.length; j++) {
//     console.log(skipPageListTmp[i].question[j])
//     if (skipPageListTmp[i].question[j].type !== 'paragraph') {
//       skipPageListItemQuestion.push(skipPageListTmp[i].question[j])
//     }
//   }
//   console.log(skipPageListItemQuestion)
//   skipPageListTmp.question = Object.assign([], skipPageListItemQuestion)
// }
// skipPageListReal.value = Object.assign([],skipPageListTmp )
// console.log(skipPageListReal.value)


const handleSubmit = () => {
  console.log(formModel.value)
  console.log(surveyRef.value)
  surveyRef.value.validate((valid: any) => {
    if (valid) {
      const answers = generateAnswer(skipPageList.value, formModel.value);
      console.log("submit!", answers);
      emit("answerSubmit", answers);
    } else {
      console.log("valid", valid);
      console.log("error submit!", formModel.value);
      return false;
    }
  });
};

const handleSave = () => {
  surveyRef.value.validate((valid: any) => {
    if (valid) {
      const answers = generateAnswer(skipPageList.value, formModel.value);
      console.log("save!", answers);
      emit("answerSave", answers);
    } else {
      console.log("valid", valid);
      console.log("error submit!", formModel.value);
      return false;
    }
  });
}

const handleAnswerSuccess = (id: string) => {
  emit("answerSuccess", id, formModel.value[id]);
};

const handleAnswerError = (id: string) => {
  emit("answerError", id);
};
</script>

<style lang="less" scoped>
.survey-pc {
  width: 850px;
  // max-height: 1123px;
  margin: 0 auto;

  background-color: #ffffff;
}

.page-header {
  width: 100%;
  height: 200px;
  object-fit: fill;
}

:deep(.el-form-item.is-error) {
  border: 1px dashed #f55;
}
</style>

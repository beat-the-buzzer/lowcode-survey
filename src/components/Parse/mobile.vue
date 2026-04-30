<template>
  <div>
    <div>
      <div class="p-10px">
        <img
          v-if="surveyData.config.phUrl"
          class="page-header my-10px"
          :src="surveyData.config.phUrl"
          alt=""
        />
        <!-- <h1 style="text-align: center;font-size: 30px; font-weight: bold;">评价</h1> -->
        <div v-html="surveyData.config.title" v-if="false"></div>
        <!-- <div
          v-if="surveyData.config.desc"
          class="my-10px"
          v-html="surveyData.config.desc"
        ></div> -->
      </div>
      <el-form
        ref="surveyRef"
        :model="formModel"
        label-position="top"
        class="p-10px"
        hide-required-asterisk
        scroll-to-error
      >
        <!-- 分页 -->
        <div v-for="item in skipPageList" :key="item.pageIndex" class="aaa">
          <div v-show="currentPage === item.pageIndex">
            <!-- 分页中的问题 -->
            <template v-for="question in item.questions" :key="question.id">
              <div
                v-if="question.type === 'paragraph'"
                v-html="question.title"
                class="paragraph"
              ></div>
              
              <form-item
                v-else-if="showQuestion(question)"
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
        <!-- <div class="py-20px" v-if="currentPage === totalPage">
          <div v-html="surveyData.config.suffix"></div>
        </div> -->
        <div class="flex items-center justify-center flex-col p-20px">
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
      <div v-if="totalPage > 1" class="p-20px text-center">
        {{ `第${currentPage}页/共${totalPage}页` }}
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";
import FormItem from "./mobile/FormItem.vue";
import { useSurvey } from "@/hooks/useSurvey";
import { generateAnswer } from "@/components/Parse/utils/answer";
import { useRoute, useRouter } from "vue-router";

const route = useRoute();
const router = useRouter();

const isView = route.query.isView

const props = withDefaults(
  defineProps<{
    surveyData: any;
    readOnly?: boolean;
    form?: any;
  }>(),
  {
    surveyData: () => {},
    readOnly: false,
    form: () => {},
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

// 这里需要打印一下所有需要的数据
window.test = () => {
  console.log('答题的数据', formModel.value)
  console.log(props.surveyData)
}

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

const handleSubmit = () => {
  surveyRef.value.validate((valid: any) => {
    if (valid) {
      const answers = generateAnswer(skipPageList.value, formModel.value);
      console.log("submit!", answers);
      emit("answerSubmit", answers);
    } else {
      console.log("error submit!", formModel.value);
      return false;
    }
  });
};

const handleAnswerSuccess = (id: string) => {
  emit("answerSuccess", id, formModel.value[id]);
};

const handleAnswerError = (id: string) => {
  emit("answerError", id);
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

window.test = () => {
  console.log(skipPageList.value)
}

</script>

<style lang="less" scoped>
:deep(.el-form-item.is-error) {
  border: 1px dashed #f55;
}
.page-header {
  width: 100%;
  object-fit: fill;
}

.paragraph {
  margin: 18px 0;
}
</style>

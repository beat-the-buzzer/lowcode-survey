<template>
  <div class="mobile-survey-container">
    <div>
      <img
        v-if="surveyData.config.phUrl"
        class="page-header"
        :src="surveyData.config.phUrl"
        alt=""
      />
      <div class="p-10px" v-if="false">
        <div v-html="surveyData.config.title"></div>
        <div
          v-if="surveyData.config.desc && currentPage == 1"
          class="my-10px"
          v-html="surveyData.config.desc"
        ></div>
      </div>
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
      <div v-for="item in skipPageList" :key="item.pageIndex">
        <div v-show="currentPage === item.pageIndex">
          <!-- 分页中的问题 -->
          <template v-for="question in item.questions" :key="question.id">
            <div
              class="my-10px"
              v-if="question.type === 'paragraph'"
              v-html="question.title"
            ></div>
            <form-item
              v-else
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
    </el-form>
    <div class="mt-20px">
      <div v-if="totalPage > 1" class="text-center">
        {{ `第${currentPage}页/共${totalPage}页` }}
      </div>
    </div>
    <van-action-bar>
      <van-action-bar-button
        v-if="currentPage > 1"
        round
        type="warning "
        text="上一页"
        @click="prePage"
      />
      <van-action-bar-button
        v-if="!isLastPage"
        type="success"
        round
        text="下一页"
        @click="nextPage"
      />
      <van-action-bar-button
        v-if="isLastPage"
        type="primary"
        text="提交"
        @click="handleSubmit"
      />
    </van-action-bar>
  </div>
</template>

<script setup lang="ts">
import { ref, toRefs } from "vue";
import FormItem from "./components/FormItem.vue";
import { useSurvey } from "@/hooks/useSurvey";
import { useScroll } from "@vueuse/core";
import { generateAnswer } from "@/components/Parse/utils/answer";

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
  "pageChange",
]);

const surveyRef = ref<any>();
const formModel = ref<any>(props.form ?? {});

const {
  skipPageList,
  currentPage,
  totalPage,
  triggerSkip,
  prePage,
  nextPage,
  isLastPage,
} = useSurvey(props.surveyData, formModel, surveyRef, emit);

const { arrivedState } = useScroll(document, {
  behavior: "auto",
});
const { bottom } = toRefs(arrivedState);

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
</script>

<style lang="less" scoped>
.mobile-survey-container {
  min-height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

:deep(.el-form-item.is-error) {
  border: 1px dashed #f55;
}
.page-header {
  width: 100%;
  object-fit: fill;
}
</style>

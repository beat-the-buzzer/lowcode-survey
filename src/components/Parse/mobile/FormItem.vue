<template>
  <el-form-item :prop="question.id" class="p-5px" :rules="itemRules">
    <template #label v-if="question.type !== 'pagination'">
      <div class="flex items-start">
        <span v-if="question.attribute?.required" class="text-red-500 mr-5px"
          >*</span
        >
        <span class="mr-10px" v-if="surveyConfig.indexColumn">{{
          question.index
        }}</span>
        <div style="flex: 1" v-html="question.title"></div>
      </div>
      <div
        class="w-full py-10px h-200px"
        v-if="question.attribute?.addVideo && question.attribute?.videoId"
      >
        <VideoPlayer :video-id="question.attribute.videoId" />
      </div>
      <div
        v-if="question.attribute?.desc"
        v-html="question.descText"
        class="px-20px py-10px"
      ></div>
      <div class="flex justify-end text-sm text-gray-400">
        <span v-if="['sort', 'mult_choice'].includes(question.type)">
          {{
            question.attribute.atLeast
              ? question.attribute.atMost
                ? question.attribute.atMost === question.attribute.atLeast
                  ? `[选择${question.attribute.atLeast}项]`
                  : `[选择${question.attribute.atLeast}~${question.attribute.atMost}项]`
                : `[至少选${question.attribute.atLeast}项]`
              : ""
          }}
        </span>
      </div>
    </template>
    <component
      v-model:value="formModel[question.id]"
      :config="question"
      :read-only="readOnly"
      :is="dom[question.type]"
      @trigger-skip="handleTriggerSkip"
    ></component>
    <template #error="{ error }">
      <el-alert
        :title="error"
        type="error"
        show-icon
        :closable="false"
        class="mt-10px"
      />
    </template>
  </el-form-item>
</template>

<script setup lang="ts">
import * as Elements from "./export";
import { ref, toRefs, shallowRef, computed } from "vue";
import { useValidator } from "@/hooks/useFormValidator";
import VideoPlayer from "@/components/VideoPlayer/index";

const dom = shallowRef<any>({
  ...Elements,
});

const props = withDefaults(
  defineProps<{
    surveyConfig: any;
    question: any;
    formModel: any;
    readOnly?: boolean;
  }>(),
  {
    question: () => {},
    surveyConfig: () => {},
    formModel: () => {},
    readOnly: false,
  }
);

const emit = defineEmits(["triggerSkip", "answerSuccess", "answerError"]);

const { loadValidator } = useValidator(props.question, emit);

// const { formModel } = toRefs(props);
const itemRules = computed(() => loadValidator());

const formModel = computed(() => {
  // console.log(666666)
  // console.log(props.formModel)
  return props.formModel;
})
// console.log(6666666666666666)
// console.log(formModel)

// 处理跳题
const handleTriggerSkip = (isTrigger: boolean, val: any, config: any) => {
  emit("triggerSkip", isTrigger, val, config);
};
</script>

<style lang="less" scoped>
:deep(.el-alert) {
  padding: 0 16px;
  margin-top: 10px;
}

:deep(.el-form-item.is-error) {
  border: 1px dashed #f55;
}

:deep(.el-form-item__label) {
  padding: 0;
}
</style>

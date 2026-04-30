<template>
  <el-form-item :prop="question.id" class="p-10px" :rules="itemRules">
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
        class="py-10px px-20px h-450px"
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
        <span
          v-if="
            ['matrix_radio', 'matrix_check'].includes(question.type) &&
            question.attribute.vertical
          "
          >[竖向选择]
        </span>
      </div>
    </template>
    <!-- v-model:value="formModel[question.id]" -->
    <component
      v-model:value="formModel[question.id]"
      :config="question"
      :read-only="readOnly"
      :is="dom[question.type]"
      @trigger-skip="handleTriggerSkip"
    ></component>
    <!-- <SingleChoice 
      :config="question"
      :read-only="readOnly"
      @trigger-skip="handleTriggerSkip"
      v-if="question.type === 'single_choice'"
      />
    <MultChoice 
      :config="question"
      :read-only="readOnly"
      @trigger-skip="handleTriggerSkip"
      v-else-if="question.type === 'mult_choice'"
      />  
    <ScoreText 
      :config="question"
      :read-only="readOnly"
      @trigger-skip="handleTriggerSkip"
      v-else-if="question.type === 'score_text'"
      />  
    <MultText 
      :config="question"
      :read-only="readOnly"
      @trigger-skip="handleTriggerSkip"
      v-else-if="question.type === 'mult_text'"
      />     -->
    <template #error="{ error }">
      <el-alert :title="error" type="error" show-icon :closable="false" />
    </template>
  </el-form-item>
</template>

<script setup lang="ts">
import * as Elements from "./export";
import { computed, shallowRef, toRefs, ref } from "vue";
import { useValidator } from "@/hooks/useFormValidator";
import VideoPlayer from "@/components/VideoPlayer";
import SingleChoice from "./SingleChoice.vue";
import MultChoice from "./MultChoice.vue";
import ScoreText from "./ScoreText.vue";
import MultText from "./MultText.vue";

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


const emit = defineEmits([
  "answerSuccess",
  "answerError",
  "triggerSkip",
  "restoreSkip",
]);

const { loadValidator } = useValidator(props.question, emit);
// console.log(22222222222222)
// console.log(props.question)
// console.log(loadValidator)



const { formModel } = toRefs(props);

const itemRules = computed(() => loadValidator());

const question = computed(() => {
  return props.question;
});

const domConfig = computed(() => {
  return dom.value[question.value.type];
});

const showComponent = ref<Boolean>(false)

// formModel[question.id] = undefined
// showComponent.value = true

setTimeout(() => {
  showComponent.value = true
}, 500);

// console.log(7777777777777)
// console.log(formModel)
// console.log(question.value.type)
// console.log(dom.value)
// console.log(dom.value[question.value.type])

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
</style>

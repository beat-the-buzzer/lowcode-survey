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
        <div class="my-20px" v-html="surveyData.config?.title"></div>
        <!-- <div class="my-20px" v-html="surveyData.config?.desc"></div> -->
      </div>
      <el-form
        ref="surveyRef"
        :model="formModel"
        label-position="top"
        class="px-40px py-20px"
        hide-required-asterisk
      >
        <template v-for="question in questions" :key="question.id">
          <form-item
            :question="question"
            :surveyConfig="surveyData.config"
            :formModel="formModel"
            :read-only="readOnly"
          ></form-item>
        </template>
      </el-form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import FormItem from "@/components/Parse/components/FormItem.vue";
import { useReview } from "@/hooks/useReview";

const props = withDefaults(
  defineProps<{
    surveyData: any;
    answers: any;
    readOnly?: boolean;
    collect?: boolean;
  }>(),
  {
    surveyData: () => {},
    answers: () => {},
    readOnly: false,
    collect: false,
  }
);

const { questions, formModel } = useReview(props.surveyData, props.answers);

// const surveyData = computed(() => {
//   return props.surveyData;
// });

// console.log(22222222222)
console.log(questions)
console.log(formModel)

</script>

<style lang="less" scoped>
.survey-pc {
  width: 850px;
  margin: 0 auto;
  box-shadow: rgba(0, 0, 0, 0.24) 0 3px 8px;
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

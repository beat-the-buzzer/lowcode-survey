<template>
  <div>
    <div>
      <div class="p-10px">
        <img
          v-if="surveyData.config.phUrl"
          class="page-header"
          :src="surveyData.config.phUrl"
          alt=""
        />
        <div class="my-20px" v-html="surveyData.config.title" v-if="false"></div>
        <!-- <div class="my-20px" v-html="surveyData.config.desc"></div> -->
      </div>
      <el-form
        ref="surveyRef"
        :model="formModel"
        label-position="top"
        class="p-10px"
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
import { ref } from "vue";
import FormItem from "@/components/mobile/src/components/FormItem.vue";
import { useReview } from "@/hooks/useReview";

const props = withDefaults(
  defineProps<{
    surveyData: any;
    answers: any;
    readOnly?: boolean;
  }>(),
  {
    surveyData: () => {},
    answers: () => {},
    readOnly: false,
  }
);

const { questions, formModel } = useReview(props.surveyData, props.answers);
</script>

<style lang="less" scoped>
:deep(.el-form-item.is-error) {
  border: 1px dashed #f55;
}
.page-header {
  width: 100%;
  object-fit: fill;
}
</style>

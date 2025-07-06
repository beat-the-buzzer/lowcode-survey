<template>
  <div :class="`question-${index + 1}`">
    <div class="q-title flex items-start px-10px">
      <span
        v-if="data.attribute?.required"
        class="text-lg text-red-500 mt-10px"
      >
        *
      </span>
      <span v-if="config.indexColumn" class="text-base ml-5px mt-10px">{{
        index + 1
      }}</span>
      <span class="mt-12px text-gray-400">{{
        `【${typeEnum[data.type]}】`
      }}</span>
      <InlineEditor v-model:modelValue="data.title" class="inline-block" />
    </div>

    
    <div class="px-20px" v-if="data.attribute?.desc">
      <InlineEditor
        v-model:modelValue="data.descText"
        placeholder="请输入题干说明"
      />
    </div>
    <div class="flex justify-end text-sm text-gray-400 px-20px">
      <span v-if="['sort', 'mult_choice'].includes(data.type)">{{
        data.attribute.atLeast
          ? data.attribute.atMost
            ? data.attribute.atMost === data.attribute.atLeast
              ? `[选择${data.attribute.atLeast}项]`
              : `[选择${data.attribute.atLeast}~${data.attribute.atMost}项]`
            : `[至少选${data.attribute.atLeast}项]`
          : ""
      }}</span>
      <span
        v-if="
          ['matrix_radio', 'matrix_check'].includes(data.type) &&
          data.attribute.vertical
        "
        >[竖向选择]</span
      >
    </div>
    <div class="q-content px-20px py-10px">
      <component
        class="questionComp"
        :data="data"
        :questionList="questionList"
        :is="dom[data.type]"
        @option-set="handleOptionSetting"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { shallowRef, toRefs, computed } from "vue";
import * as Elements from "../questionComp/export";
import { typeEnum } from "@/enums/questionEnum";
import InlineEditor from "@/components/InlineEditor";


const dom = shallowRef<any>({
  ...Elements,
});

const props = defineProps({
  data: {
    type: Object,
    default: () => {},
  },
  index: {
    type: Number,
    default: 0,
  },
  active: {
    type: Boolean,
    default: false,
  },
  config: {
    type: Object,
    default: () => {},
  },
  questionList: {
    type: Array,
    default: () => [],
  },
});

const { data } = toRefs(props);

// console.log(22222222222)
// console.log(data.value)
// console.log(dom[data.value.type])

const emit = defineEmits<{
  (e: "set-option", item: any, info: any): void;
}>();

const handleOptionSetting = (item: any, index: number, type: string) => {
  emit("set-option", item, {
    quesIndex: props.index,
    optionIndex: index,
    type: type,
  });
};



</script>
<style scoped>
:deep(.option) {
  display: flex !important;
  align-items: center;
  padding: 5px;
  border: 1px dashed transparent;
}
:deep(.option.active) {
  border: 1px dashed #66b1ff;
}

.questionComp {
  cursor: pointer;
  /* background-color: #f5f5f5; */
}
</style>

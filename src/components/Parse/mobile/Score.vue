<template>
  <div>
    <el-rate
      v-model:model-value="score"
      :max="config.children[0].attribute.maxScore"
      clearable
      @change="handleChange"
    ></el-rate>
    <div
      class="flex justify-between text-gray-400"
      v-if="
        config.children[0].attribute?.startTip &&
        config.children[0].attribute?.endTip
      "
    >
      <span>{{ config.children[0].attribute?.startTip }}</span>
      <span>{{ config.children[0].attribute?.endTip }}</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref, watch } from "vue";
import { useFormItem } from "element-plus";
import { isUnDef } from "@/utils/is";

const { formItem } = useFormItem();
const props = withDefaults(
  defineProps<{
    config: any;
    value: number | string;
    readOnly?: boolean;
  }>(),
  {
    config: () => {},
    value: 0,
    readOnly: false,
  }
);

const emit = defineEmits(["update:value", "triggerSkip"]);
const score = ref(~~props.value);

watch(
  () => props.value,
  (value) => {
    if (isUnDef(value)) {
      score.value = 0;
    }
  }
);

const isEmpty = ref(true);
watch(
  () => isEmpty.value,
  () => {
    emit("triggerSkip", !isEmpty.value, score.value, props.config);
  }
);

const handleChange = (val: number) => {
  emit("update:value", val);
  // 触发el-form校验
  formItem?.validate("change");
  isEmpty.value = !val;
};

onMounted(() => {
  score.value = ~~props.value;
});
</script>

<style></style>

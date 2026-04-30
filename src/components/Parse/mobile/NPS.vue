<template>
  <div class="w-full px-20px">
    <div class="flex" @mouseleave="mouseoverIndex = 0">
      <div
        v-for="index in config.children[0].attribute.maxScore + 1"
        :key="index"
        class="nps-item"
        :style="loadStyle(index)"
        @mouseover="handleMouseOver(index)"
        @click="handleClick(index)"
      >
        {{ index - 1 }}
      </div>
    </div>
    <div class="flex justify-between text-gray-400">
      <span>{{ config.children[0].attribute.startTip }}</span>
      <span>{{ config.children[0].attribute.endTip }}</span>
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

const mouseoverIndex = ref(0);
const selected = ref(~~props.value);

watch(
  () => props.value,
  (value) => {
    if (isUnDef(value)) {
      selected.value = 0;
    }
  }
);
const handleMouseOver = (index: number) => {
  mouseoverIndex.value = index;
};

const isEmpty = ref(true);
watch(
  () => isEmpty.value,
  () => {
    emit("triggerSkip", !isEmpty.value, selected.value, props.config);
  }
);

const handleClick = (index: number) => {
  selected.value = index;
  emit("update:value", index - 1);
  // 触发el-form校验
  formItem?.validate("change");
  isEmpty.value = !selected.value;
};

const loadStyle = (index: number) => {
  if (mouseoverIndex.value > 0) {
    return mouseoverIndex.value >= index
      ? {
          backgroundColor: "rgb(38,114,255)",
          opacity: (0.8 / mouseoverIndex.value) * index + 0.2,
        }
      : "";
  } else {
    return selected.value >= index
      ? {
          backgroundColor: "rgb(38,114,255)",
          opacity: (0.8 / selected.value) * index + 0.2,
        }
      : "";
  }
};

onMounted(() => {
  selected.value = ~~props.value + 1;
});
</script>

<style lang="less" scoped>
.nps-item {
  display: flex;
  flex: 1 1;
  align-items: center;
  justify-content: center;
  height: 24px;
  margin: 0 1px;
  color: #fff;
  font-size: 14px;
  line-height: 0.29rem;
  text-align: center;
  background-color: #eaeaea;
  border-right: 0;
  border-radius: 2px;
}
.nps-tip {
  color: #eaeaea;
  margin-top: 3px;
}
</style>

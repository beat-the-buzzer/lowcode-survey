<template>
  <div class="w-full">
    <div v-for="r in config.row" :key="r.id">
      <div v-html="r.title"></div>
      <div v-for="c in config.children" :key="c.id">
        <div v-html="c.title" class="option-title"></div>
        <van-field
          v-model="inputMap[r.id][c.id]"
          class="border-b"
          :disabled="readOnly"
          type="textarea"
          rows="1"
          autosize
          @update:model-value="handleInput"
        ></van-field>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref, unref, watch } from "vue";
import { useFormItem } from "element-plus";
import { isObject, isUnDef } from "@/utils/is";

const { formItem } = useFormItem();

const props = withDefaults(
  defineProps<{
    config: any;
    value: any;
    readOnly?: boolean;
  }>(),
  {
    config: () => {},
    value: () => {},
    readOnly: false,
  }
);

const emit = defineEmits(["update:value", "triggerSkip"]);

const inputMap = ref<any>({});

// 初始化数据结构
const initInputMap = () => {
  props.config.row.map((item: any) => {
    props.config.children.map((c: any) => {
      inputMap.value[item.id] = { [c.id]: "" };
    });
  });
};

initInputMap();

watch(
  () => props.value,
  (value) => {
    isUnDef(value) && initInputMap();
  }
);

const isEmpty = ref(true);

watch(
  () => isEmpty.value,
  () => {
    emit("triggerSkip", !isEmpty.value, inputMap.value, props.config);
  }
);

const handleInput = async () => {
  emit("update:value", unref(inputMap.value));
  formItem?.validate("change");
  isEmpty.value = !Object.values(inputMap.value).some((child: any) =>
    Object.values(child).some((c) => !!c)
  );
};

const initVaule = () => {
  const { value: answer } = props;
  if (answer && isObject(answer)) {
    for (const key in answer) {
      const inputValue = answer[key];
      for (const inputValueKey in inputValue) {
        inputMap.value[key][inputValueKey] = inputValue[inputValueKey];
      }
    }
  }
};

onMounted(() => {
  initVaule();
});
</script>

<style lang="less" scoped>
.option-title {
  color: rgb(170, 170, 170);
  font-size: 14px;
  margin-top: 10px;
}
</style>

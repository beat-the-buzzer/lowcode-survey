<template>
  <el-cascader
    class="w-full"
    v-model:model-value="selected"
    :props="{
      multiple: config.attribute.multiple,
    }"
    :options="config.children"
    clearable
    :disabled="readOnly"
    @change="handleChange"
  />
</template>

<script setup lang="ts">
import { ref, watch, onMounted } from "vue";
import { useFormItem } from "element-plus";
import { isUnDef } from "@/utils/is";

const { formItem } = useFormItem();

const emit = defineEmits(["update:value", "triggerSkip"]);

const props = withDefaults(
  defineProps<{
    config: any;
    value: string[] | null;
    readOnly: boolean;
  }>(),
  {
    config: () => {},
    value: () => [],
    readOnly: false,
  }
);

watch(
  () => props.value,
  (value) => {
    isUnDef(value) && (selected.value = []);
  }
);

const selected = ref<any>([]);
const isEmpty = ref(true);

watch(
  () => isEmpty.value,
  () => {
    emit("triggerSkip", !isEmpty.value, selected.value, props.config);
  }
);

const handleChange = (val: any) => {
  emit("update:value", val);
  // 触发el-form校验
  formItem?.validate("change");
  isEmpty.value = !(
    selected.value &&
    Array.isArray(selected.value) &&
    selected.value.length > 0
  );
};

onMounted(() => {
  selected.value = props.value;
});
</script>

<style lang="less" scoped></style>

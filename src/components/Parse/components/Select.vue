<template>
  <el-select
    v-model="selected"
    :disabled="readOnly"
    @change="handleChange"
    clearable
    filterable
  >
    <el-option
      v-for="item in config.children"
      :key="item.id"
      :label="item.title"
      :value="item.id"
    ></el-option>
  </el-select>
</template>

<script setup lang="ts">
import { onMounted, ref, watch } from "vue";
import { useFormItem } from "element-plus";
import { isUnDef } from "@/utils/is";

const { formItem } = useFormItem();

const props = withDefaults(
  defineProps<{
    config: any;
    value: string | string[];
    readOnly?: boolean;
  }>(),
  {
    config: () => {},
    value: "",
    readOnly: false,
  }
);

const emit = defineEmits(["update:value", "triggerSkip"]);

const selected = ref(props.value);

watch(
  () => props.value,
  (value) => {
    if (isUnDef(value)) {
      selected.value = "";
    }
  }
);

const isEmpty = ref(true);
watch(
  () => isEmpty.value,
  () => {
    emit("triggerSkip", !isEmpty.value, selected.value, props.config);
  }
);
const handleChange = (val: string) => {
  emit("update:value", val);
  // 触发el-form校验
  formItem?.validate("change");
  isEmpty.value = !(val || (Array.isArray(val) && val.length > 0));
};

onMounted(() => {
  selected.value = props.value;
});
</script>

<style></style>

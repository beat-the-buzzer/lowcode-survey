<template>
  <el-input-number
    v-if="attribute.inputType === 'number'"
    v-model="input"
    :disabled="readOnly"
    :controls="false"
    @change="handleChange"
  />
  <!--  :min="attribute.minValue"
    :max="attribute.maxValue"
    :precision="attribute.precision ?? 0"-->
  <el-input
    v-else
    v-model="input"
    :disabled="readOnly"
    type="textarea"
    autosize
    placeholder="请输入回答"
    show-word-limit
    :maxlength="attribute.maxLength"
    @input="handleChange"
  ></el-input>
</template>

<script setup lang="ts">
import { ref, watch, onMounted } from "vue";
import { useFormItem } from "element-plus";
import { isUnDef } from "@/utils/is";

const { formItem } = useFormItem();

const props = withDefaults(
  defineProps<{
    config: any;
    value: any;
    readOnly: boolean;
  }>(),
  {
    config: () => {},
    value: undefined,
    readOnly: false,
  }
);

const attribute = ref(props.config.children[0].attribute);

const emit = defineEmits(["update:value", "triggerSkip"]);

const input = ref<any>(undefined);

watch(
  () => props.value,
  (value) => {
    input.value = value;
  }
);

const isEmpty = ref(true);
watch(
  () => isEmpty.value,
  () => {
    emit("triggerSkip", !isEmpty.value, input.value, props.config);
  }
);

const handleChange = (val: string) => {
  // if (attribute.value["inputType"] === "string") {
  //   input.value = val ? val.trim() : "";
  // }
  emit("update:value", input.value);
  formItem?.validate("change");
  isEmpty.value = !input.value;
};

onMounted(() => {
  input.value = props.value;
});
</script>

<style></style>

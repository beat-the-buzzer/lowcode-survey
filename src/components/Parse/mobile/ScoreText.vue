<template>
  <el-input-number
    v-if="attribute.inputType === 'number'"
    v-model="input"
    :disabled="readOnly"
    :controls="false"
    @change="handleChange"
    @input="handleInput"
    onkeypress="return(/[\d\.]/.test(String.fromCharCode(event.keyCode)))"
    style="width: 100%;"
  />
  <el-input
    v-else
    v-model="input"
    type="textarea"
    autosize
    :disabled="readOnly"
    placeholder="请输入回答"
    show-word-limit
    :maxlength="attribute.maxLength"
    :minlength="attribute.minLength"
    @input="handleChange"
  ></el-input>
</template>

<script setup lang="ts">
import { onMounted, ref, watch } from "vue";
import { useFormItem } from "element-plus";

const { formItem } = useFormItem();

const props = withDefaults(
  defineProps<{
    config: any;
    value: string;
    readOnly?: boolean;
  }>(),
  {
    config: () => {},
    value: "",
    readOnly: false,
  }
);

const attribute = ref(props.config.children[0].attribute);

const emit = defineEmits(["update:value", "triggerSkip"]);

const input = ref(props.value);

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

const handleInput = (val) => {
//   console.log(2222222222222)
//   console.log(input.value)
//   // if (val[val.length - 1] === 'e') {
//   //   input.value = 123;
//   //   return;
//   // }
}

const handleChange = (val: string) => {
  // input.value = val ? val.trim() : "";
  input.value = val
  emit("update:value", input.value);
  formItem?.validate("change");
  isEmpty.value = !input.value;
};

onMounted(() => {
  input.value = props.value;
});
</script>

<style scoped>
:deep(.el-input__inner) {
  text-align: left;
}
</style>

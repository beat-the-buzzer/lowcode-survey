<template>
  <van-field
    class="border-b"
    v-model="input"
    rows="1"
    autosize
    type="textarea"
    :maxlength="attribute.maxLength"
    placeholder="请输入回答"
    show-word-limit
    :readonly="readOnly"
    @update:model-value="handleChange"
  />
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

const handleChange = (val: string) => {
  // input.value = val ? val.trim() : "";
  emit("update:value", input.value);
  formItem?.validate("change");
  isEmpty.value = !input.value;
};

onMounted(() => {
  input.value = props.value;
});
</script>

<style></style>

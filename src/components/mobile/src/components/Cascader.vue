<template>
  <van-field
    v-model="fieldValue"
    class="border-b"
    :is-link="!readOnly"
    readonly
    placeholder="请选择"
    @click="!readOnly && (show = true)"
  />
  <van-popup v-model:show="show" round position="bottom">
    <van-cascader
      v-model="cascaderValue"
      title="请选择"
      :options="config.children"
      :field-names="{
        text: 'label',
      }"
      @close="show = false"
      @finish="onFinish"
    />
  </van-popup>
</template>

<script setup lang="ts">
import { onMounted, ref, watch, computed } from "vue";
import { useFormItem } from "element-plus";
import { isUnDef, isEmpty as _isEmpty } from "@/utils/is";
import { last } from "lodash-es";

const { formItem } = useFormItem();

const emit = defineEmits(["update:value", "triggerSkip"]);

const props = withDefaults(
  defineProps<{
    config: any;
    value: string[] | undefined;
    readOnly?: boolean;
  }>(),
  {
    config: () => {},
    value: () => [],
    readOnly: false,
  }
);

const selected = ref<any>([]);
const isEmpty = ref(true);
const fieldValue = ref("");
const show = ref(false);
const cascaderValue = ref("");

watch(
  () => props.value,
  (value) => {
    isUnDef(value) && init();
  }
);

watch(
  () => isEmpty.value,
  () => {
    emit("triggerSkip", !isEmpty.value, selected.value, props.config);
  }
);

const init = () => {
  if (_isEmpty(props.value)) {
    selected.value = [];
    fieldValue.value = "";
    cascaderValue.value = "";
  } else {
    selected.value = props.value;
    fieldValue.value = props.value?.join("/");
    cascaderValue.value = last(props.value) as string;
  }
};

const onFinish = ({ selectedOptions }) => {
  fieldValue.value = selectedOptions
    .map((option: any) => option.label)
    .join("/");
  selected.value = selectedOptions.map((option: any) => option.value);
  emit("update:value", selected.value);
  formItem?.validate("change");
  isEmpty.value = false;
  show.value = false;
};

onMounted(() => {
  init();
});
</script>

<style lang="less"></style>

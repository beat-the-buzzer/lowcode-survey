<template>
  <div>
    <van-field
      v-model="selectedLabel"
      class="border-b"
      :is-link="!disabled"
      readonly
      placeholder="请选择"
      @click="!disabled && (showPicker = true)"
    />
    <van-popup v-model:show="showPicker" round position="bottom">
      <van-picker
        :columns="options"
        :columns-field-names="{ text: labelField, value: valueField }"
        @cancel="showPicker = false"
        @confirm="onConfirm"
      />
    </van-popup>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";

const props = withDefaults(
  defineProps<{
    value: any;
    options: any[];
    labelField?: string;
    valueField?: string;
    disabled?: boolean;
  }>(),
  {
    value: "",
    options: () => [],
    labelField: "title",
    valueField: "id",
    disabled: false,
  }
);

const emit = defineEmits(["update:value", "change"]);

const showPicker = ref(false);

const selectedLabel = computed(() => {
  const target = props.options.find(
    (item) => item[props.valueField] === props.value
  );

  return target?.[props.labelField] ?? "";
});

const onConfirm = ({ selectedOptions }) => {
  const selected = selectedOptions[0];
  emit("update:value", selected[props.valueField]);
  showPicker.value = false;
};
</script>

<style lang="less" scoped></style>

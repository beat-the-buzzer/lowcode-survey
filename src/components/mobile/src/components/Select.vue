<template>
  <div class="w-full">
    <van-field
      v-model="selected"
      class="border-b"
      :is-link="!readOnly"
      readonly
      placeholder="请选择"
      @click="!readOnly && (showPicker = true)"
    />
    <van-popup v-model:show="showPicker" round position="bottom">
      <van-picker
        v-model="selectedValues"
        :columns="config.children"
        :columns-field-names="{ text: 'title', value: 'id' }"
        @cancel="showPicker = false"
        @confirm="handleChange"
      />
    </van-popup>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref, watch } from "vue";
import { useFormItem } from "element-plus";
import { isUnDef, isString } from "@/utils/is";

const { formItem } = useFormItem();

const props = withDefaults(
  defineProps<{
    config: any;
    value: any;
    readOnly?: boolean;
  }>(),
  {
    config: () => {},
    value: "",
    readOnly: false,
  }
);

const emit = defineEmits(["update:value", "triggerSkip"]);

const selected = ref("");
const selectedValues = ref<any[]>([]);
const showPicker = ref(false);

watch(
  () => props.value,
  (value) => {
    if (isUnDef(value)) {
      selectedValues.value = [];
      selected.value = "";
    } else {
      selectedValues.value = [value];
      selected.value = getLabel(value);
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
const handleChange = ({ selectedOptions }) => {
  const val = selectedOptions[0].id;
  // selected.value = selectedOptions[0].title;
  emit("update:value", val);
  formItem?.validate("change");
  isEmpty.value = !(val || (Array.isArray(val) && val.length > 0));
  showPicker.value = false;
};

const getLabel = (value: string) => {
  const target = props.config.children?.find(
    (item: any) => item["id"] === value
  );

  return target?.title ?? "";
};

onMounted(() => {
  if (isString(props.value)) {
    selected.value = getLabel(props.value);
    selectedValues.value = [props.value];
  }
});
</script>

<style></style>

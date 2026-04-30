<template>
  <el-date-picker
    v-if="attribute.type === 'date'"
    v-model="pick"
    type="date"
    placeholder="请选择日期"
    :format="attribute.format"
    :value-format="attribute.format"
    @change="handleChange"
  />
  <el-date-picker
    v-else-if="attribute.type === 'datetime'"
    v-model="pick"
    type="datetime"
    placeholder="请选择日期时间"
    :format="attribute.format"
    :value-format="attribute.format"
    @change="handleChange"
  />
  <el-time-picker
    v-else-if="attribute.type === 'time'"
    v-model="pick"
    placeholder="请选择时间"
    :format="attribute.format"
    :value-format="attribute.format"
    @change="handleChange"
  />
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

const pick = ref<any>(undefined);

watch(
  () => props.value,
  (value) => {
    pick.value = value;
  }
);

const isEmpty = ref(true);
watch(
  () => isEmpty.value,
  () => {
    emit("triggerSkip", !isEmpty.value, pick.value, props.config);
  }
);

const handleChange = (val: string) => {
  emit("update:value", val);
  formItem?.validate("change");
  isEmpty.value = !val;
};

onMounted(() => {
  pick.value = props.value;
});
</script>

<style></style>

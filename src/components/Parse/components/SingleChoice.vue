<template>
  <div v-if="showComponent">
    <el-radio-group v-model="selected" :disabled="readOnly">
      <el-row :gutter="16">
        <el-col
          v-for="item in config.children"
          :key="item.id"
          :span="24 / config.attribute?.optionSpan || null"
        >
          <el-radio :label="item.id" @change="handleChange" class="w-full">
            <div class="flex items-center w-full">
              <div
                class="whitespace-nowrap"
                v-html="item.title"
              ></div>
              <el-input
                v-model="input"
                v-if="item.attribute?.addInput && selected === item.id"
                :disabled="readOnly"
                class="ml-20px"
                size="small"
                @input="handleInput"
              >
                <template #prefix v-if="item.attribute?.inputRequired">
                  <span class="text-red-500 text-lg">*</span>
                </template>
              </el-input>
            </div>
          </el-radio>
        </el-col>
      </el-row>
    </el-radio-group>
  </div>
</template>

<script setup lang="ts">
import { ref, unref, watch, onMounted } from "vue";
import { useFormItem } from "element-plus";
import { isBoolean } from "lodash-es";
import { isObject, isString, isUnDef } from "@/utils/is";

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

const selected = ref("");
const input = ref("");

watch(
  () => props.value,
  (value) => {
    if (isUnDef(value)) {
      selected.value = "";
      input.value = "";
    } else {
      initValue()
    }
  }
);

const handleChange = () => {
  const key = unref(selected);
  emit("update:value", { [key]: true });
  // 触发el-form校验
  formItem?.validate("change");
  emit("triggerSkip", true, { [key]: true }, props.config);
};

const handleInput = (val: any) => {
  emit("update:value", { [selected.value]: val });
};

const initValue = () => {
  const { value } = props;
  if (value && isObject(value)) {
    for (const key in value) {
      selected.value = key;
      if (isString(value[key])) {
        input.value = value[key];
      }
    }
  }
};

onMounted(() => {
  initValue();
});

const showComponent = ref<Boolean>(false)

setTimeout(() => {
  showComponent.value = true
}, 500);
</script>

<style lang="less" scoped>
:deep(.el-radio) {
  height: 100%;
  padding: 5px;
}
</style>

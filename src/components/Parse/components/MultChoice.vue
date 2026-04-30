<template>
  <el-checkbox-group v-model="checked" :disabled="readOnly">
    <el-row :gutter="16">
      <el-col
        v-for="item in config.children"
        :key="item.id"
        :span="24 / config.attribute?.optionSpan"
      >
        <el-checkbox
          :label="item.id"
          @change="handleChange(item.attribute.exclusion, item.id)"
        >
          <div class="flex items-center">
            <div class="whitespace-pre-wrap" v-html="item.title"></div>
            <el-input
              v-model="inputMap[item.id]"
              :disabled="readOnly"
              v-if="item.attribute.addInput && checked.includes(item.id)"
              class="ml-20px"
              size="small"
              @input="handleInput"
            >
              <template #prefix v-if="item.attribute.inputRequired">
                <span class="text-red-500 text-lg">*</span>
              </template>
            </el-input>
          </div>
        </el-checkbox>
      </el-col>
    </el-row>
  </el-checkbox-group>
</template>

<script setup lang="ts">
import { ref, unref, watch, onMounted } from "vue";
import { useFormItem } from "element-plus";
import { intersection } from "lodash-es";
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

const inputMap = ref({});
const checked = ref<string[]>([]);

watch(
  () => props.value,
  (value) => {
    if (isUnDef(value)) {
      checked.value = [];
      inputMap.value = [];
    } else {
      initValue();
    }
  }
);

const exclusionList = props.config.children
  .filter((item: any) => item.attribute.exclusion)
  .map((item: any) => item.id);

const emit = defineEmits(["update:value", "triggerSkip"]);

const handleChange = (exclusion: boolean | undefined, id: string) => {
  const current = unref(checked.value);
  // 互斥判断
  const arr = intersection(current, exclusionList);
  if (arr.length > 0) {
    checked.value = [id];
  } else {
    exclusion && (checked.value = [id]);
  }
  let _value = {};
  checked.value.map((item: string) => {
    if (inputMap.value[item]) {
      _value[item] = inputMap.value[item];
    } else {
      _value[item] = true;
    }
  });
  emit("update:value", _value);
  formItem?.validate("change");
  isEmpty.value = checked.value.length === 0;
};

const isEmpty = ref(true);

watch(
  () => isEmpty.value,
  () => {
    emit("triggerSkip", !isEmpty.value, inputMap.value, props.config);
  }
);

const handleInput = () => {
  const _value = Object.assign({}, inputMap.value);
  checked.value.map((item: string) => {
    if (!_value[item]) {
      _value[item] = true;
    }
  });
  emit("update:value", _value);
  formItem?.validate("change");
};

const initValue = () => {
  const { value } = props;
  if (value && isObject(value)) {
    checked.value = Object.keys(value);
    for (const key in value) {
      if (isString(value[key])) {
        inputMap.value[key] = value[key];
      }
    }
  }
};

onMounted(() => {
  initValue();
});
</script>

<style lang="less" scoped>
:deep(.el-checkbox) {
  min-height: 32px;
  height: 100%;
  padding: 5px;
}
</style>

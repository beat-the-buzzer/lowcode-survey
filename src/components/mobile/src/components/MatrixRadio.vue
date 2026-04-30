<template>
  <div class="w-full">
    <div v-for="r in config.row" :key="r.id">
      <div v-html="r.title"></div>
      <van-radio-group
        v-model="checkedMap[r.id].checked"
        @change="handleRadioChange"
      >
        <div class="flex flex-wrap gap-15px my-10px">
          <div
            v-for="c in config.children"
            :key="c.id"
            :class="[
              checkedMap[r.id].checked === c.id && c.attribute.addInput
                ? 'w-full'
                : '',
            ]"
          >
            <van-radio :name="c.id" label-position="left">
              <div v-html="c.title"></div>
            </van-radio>
            <van-field
              v-if="checkedMap[r.id].checked === c.id && c.attribute.addInput"
              v-model="checkedMap[r.id].input"
              class="border-b mt-5px"
              size="small"
              :disabled="readOnly"
              label=" "
              label-width="0px"
              :required="c.attribute.inputRequired"
              @update:model-value="handleInput"
            ></van-field>
          </div>
        </div>
      </van-radio-group>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref, unref, watch } from "vue";
import { useFormItem } from "element-plus";
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

watch(
  () => props.value,
  (value) => {
    isUnDef(value) && initChekcedMap();
  }
);

const emit = defineEmits(["update:value", "triggerSkip"]);

const checkedMap = ref<any>({});

// 初始化数据结构
const initChekcedMap = () => {
  props.config.row.map((item: any) => {
    checkedMap.value[item.id] = { checked: undefined, input: undefined };
  });
};

initChekcedMap();

// 提交数据结构处理
const transformCheckedMap = () => {
  let result = {};
  const current = unref(checkedMap.value);
  for (const key in current) {
    const content = current[key];
    const { checked, input } = content;
    if (checked) {
      result[key] = { [checked]: input || true };
    }
  }
  return result;
};

const isEmpty = ref(true);

watch(
  () => isEmpty.value,
  () => {
    emit("triggerSkip", !isEmpty.value, checkedMap.value, props.config);
  }
);

const handleRadioChange = () => {
  const _value = transformCheckedMap();
  emit("update:value", _value);
  formItem?.validate("change");
  isEmpty.value = Object.values(_value).length === 0;
};

const handleInput = () => {
  const _value = transformCheckedMap();
  emit("update:value", _value);
  formItem?.validate("change");
};

const initValue = () => {
  const { value: answer } = props;
  if (answer && isObject(answer)) {
    for (const key in answer) {
      const radioValue = answer[key];
      if (radioValue && isObject(radioValue)) {
        for (const radioValueKey in radioValue) {
          const input = radioValue[radioValueKey];
          checkedMap.value[key] = {
            checked: radioValueKey,
            input: isString(input) ? input : undefined,
          };
        }
      }
    }
  }
};

onMounted(() => {
  initValue();
});
</script>

<style lang="less" scoped>
:deep(.el-radio__input) {
  display: none;
}

:deep(.el-radio__label) {
  padding-left: 8px;
  padding-right: 8px;
  border: var(--el-border);
  margin: 2px;
}

:deep(.el-radio__input.is-checked + .el-radio__label) {
  background-color: var(--el-color-primary);
  color: #fff;
}
</style>

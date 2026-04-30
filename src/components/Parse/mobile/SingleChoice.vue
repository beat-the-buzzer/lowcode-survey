<template>
  <div :class="optionShowType">
    <el-radio-group v-model="selected" :disabled="readOnly">
      <div v-for="item in config.children" :key="item.id">
        <el-radio :label="item.id" @change="handleChange">
          <div
            class="whitespace-nowrap font-normal"
            v-html="item.title"
          ></div>
        </el-radio>
        <el-input
          v-model="input"
          v-if="item.attribute?.addInput && selected === item.id"
          size="small"
          @input="handleInput"
        >
          <template #prefix v-if="item.attribute?.inputRequired">
            <span class="text-red-500 text-lg">*</span>
          </template>
        </el-input>
      </div>
    </el-radio-group>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref, unref, watch, computed } from "vue";
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

watch(
  () => props.value,
  (value) => {
    if (isUnDef(value)) {
      selected.value = "";
      input.value = "";
    } else {
      initValue();
    }
  }
);

const emit = defineEmits(["update:value", "triggerSkip"]);

const selected = ref("");
const input = ref("");

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




const optionShowType = computed(() => {
  let config = props.config
  if(config?.attribute?.optionSpanMobile == 'inline-flex') {
    return 'inlineFlex'
  } else {
    return 'block'
  }
})

onMounted(() => {
  initValue();
});
</script>

<style lang="less" scoped>

:deep(.el-radio) {
  height: 100%;
  padding: 5px;
}
</style>

<style lang="less">
.block .el-radio-group {
  display: block !important;
}
.inlineFlex .el-radio-group {
  display: inline-flex !important;
}
</style>





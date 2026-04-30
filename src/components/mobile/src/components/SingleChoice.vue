<template>
  <van-radio-group
    v-model="selected"
    class="w-full"
    :class="optionShowType"
    :disabled="readOnly"
    @change="handleChange"
  >
    <div class="grid grid-cols-1 gap-10px">
      <div v-for="item in config.children" :key="item.id">
        <van-radio :name="item.id">
          <div
            class="whitespace-nowrap font-normal"
            v-html="item.title"
          ></div>
        </van-radio>
        <van-field
          class="border-b mt-10px"
          v-if="item.attribute?.addInput && selected === item.id"
          v-model="input"
          rows="1"
          autosize
          type="textarea"
          placeholder="请输入"
          :disabled="readOnly"
          label=" "
          label-width="0px"
          :required="item.attribute?.inputRequired"
          @update:model-value="handleInput"
        />
      </div>
    </div>
  </van-radio-group>
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
  formItem?.validate("change");
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

<template>
  <div class="w-full">
    <div v-for="r in config.row" :key="r.id">
      <div v-html="r.title"></div>
      <div class="flex flex-wrap gap-15px my-10px">
        <div
          v-for="c in config.children"
          :key="c.id"
          :class="[
            c.attribute.addInput && checkedMap[r.id][c.id].checked
              ? 'w-full'
              : '',
          ]"
        >
          <van-checkbox
            v-model="checkedMap[r.id][c.id].checked"
            label-position="left"
            shape="square"
            @change="handleRadioChange"
          >
            <div v-html="c.title"></div>
          </van-checkbox>
          <van-field
            v-if="c.attribute.addInput && checkedMap[r.id][c.id].checked"
            v-model="checkedMap[r.id][c.id].input"
            class="border-b"
            size="small"
            :disabled="readOnly"
            label=" "
            label-width="0px"
            :required="c.attribute.inputRequired"
            @update:model-value="handleInput"
          ></van-field>
        </div>
      </div>
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

const emit = defineEmits(["update:value", "triggerSkip"]);

const checkedMap = ref<any>({});

// 初始化数据结构
const initCheckedMap = () => {
  props.config.row.map((item: any) => {
    checkedMap.value[item.id] = {};
    props.config.children.map((c: any) => {
      checkedMap.value[item.id][c.id] = { checked: false, input: "" };
    });
  });
};

initCheckedMap();

watch(
  () => props.value,
  (value) => {
    isUnDef(value) && initCheckedMap();
  }
);

// 提交数据结构处理
const transformCheckedMap = () => {
  let result = {};
  const current = unref(checkedMap.value);

  props.config.row.map((item: any) => {
    result[item.id] = {};
    props.config.children.map((c: any) => {
      if (current[item.id][c.id].checked)
        result[item.id][c.id] = current[item.id][c.id].input || true;
    });
  });

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
  isEmpty.value = !Object.values(checkedMap.value).some((child: any) =>
    Object.values(child).some((c: any) => c.checked)
  );
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
          checkedMap.value[key][radioValueKey] = {
            checked: true,
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

<style lang="less" scoped></style>

<template>
  <div class="w-full grid grid-cols-1 gap-10px">
    <div v-for="i in level" :key="i">
      <el-select
        v-if="options[`level${i}`]?.length"
        style="width: 100%"
        v-model="selected[`level${i}`]"
        @change="(val) => handleSelectChange(val, i)"
        clearable
        filterable
      >
        <el-option
          v-for="item in options[`level${i}`]"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        />
      </el-select>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref, watch, computed } from "vue";
import { useFormItem } from "element-plus";
import { isUnDef, isEmpty as _isEmpty } from "@/utils/is";
import { findNode, getLevel } from "@/utils/tree";

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

const selected = ref<any>({});
const options = ref<any>({});
const isEmpty = ref(true);

const level = computed(() => getLevel(props.config.children, "children"));

const leafLevel = ref(3);

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

const handleSelectChange = (value: string, _level: number) => {
  const { children } = props.config;
  options.value[`level${_level + 1}`] = findNode(children, value, "label");
  if (options.value[`level${_level + 1}`].length === 0) {
    leafLevel.value = _level;
  } else {
    leafLevel.value = 3;
  }
  clear(_level);
  emitChange();
};

const clear = (current_level: number) => {
  for (let i = current_level; i < level.value; i++) {
    selected.value[`level${i + 1}`] = "";
    if (options.value[`level${i + 2}`]?.length) {
      options.value[`level${i + 2}`] = [];
    }
  }
};

const emitChange = () => {
  let result: string[] = [];
  for (let i = 0; i < level.value; i++) {
    if (selected.value[`level${i + 1}`]) {
      result.push(selected.value[`level${i + 1}`]);
    }
  }
  if (result.length === leafLevel.value) {
    emit("update:value", result);
    // 触发el-form校验
    formItem?.validate("change");
    isEmpty.value = false;
  } else {
    emit("update:value", []);
    // 触发el-form校验
    formItem?.validate("change");
    isEmpty.value = true;
  }
};

const init = () => {
  options.value["level1"] = props.config.children;
  if (_isEmpty(props.value)) {
    selected.value = {};
  } else {
    props.value.map((item: string, i: number) => {
      selected.value[`level${i + 1}`] = item;
      if (i + 2 <= level.value) {
        options.value[`level${i + 2}`] = findNode(
          props.config.children,
          item,
          "label"
        );
      }
    });
  }
};

onMounted(() => {
  init();
});
</script>

<style lang="less">
.cascader-h5 {
  .el-cascader-panel {
    max-width: 95vw;
    overflow-y: auto;
  }
  .el-cascader-menu {
    min-width: 100px;
  }
  .el-cascader-node {
    padding: 0;
  }
}
</style>

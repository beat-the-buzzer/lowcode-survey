<template>
  <div class="w-full">
    <div v-for="(item, index) in tableValue" :key="item" class="p-10px">
      <div class="flex items-center justify-between">
        <span>{{ index + 1 }}</span>
        <el-icon
          v-if="!readOnly"
          color="#f55"
          @click="handleDeleteRow(index)"
          class="cursor-pointer"
          ><Delete
        /></el-icon>
      </div>
      <div v-for="c in config.children" :key="c.id">
        <div v-html="c.title" class="option-title"></div>
        <el-select
          class="w-full"
          v-model="item[c.id]"
          :disabled="readOnly"
          v-if="c.attribute.dataType === 'select'"
          @change="handleSelectChange"
        >
          <el-option
            v-for="item in c.attribute.options"
            :key="item.id"
            :label="item.title"
            :value="item.id"
          />
        </el-select>
        <el-input
          v-else
          v-model="item[c.id]"
          :disabled="readOnly"
          v-debounceInput="handleInput"
        ></el-input>
      </div>
    </div>

    <el-button v-if="!readOnly" class="w-full mt-10px" @click="handleAddRow">
      <el-icon size="18" class="mr-10px"><CirclePlus /></el-icon>
      继续填写
    </el-button>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref, unref, watch, nextTick } from "vue";
import { useFormItem, ElMessage } from "element-plus";
import { CirclePlus, Delete } from "@element-plus/icons-vue";
import { isArray, isUnDef } from "@/utils/is";

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
const tableValue = ref<any[]>([]);
const columsOption = {};

// 表格数据初始化
const initTableValue = () => {
  props.config.children.map((item: any) => {
    columsOption[item.id] = "";
  });
  const defaultRows = props.config.attribute.defaultRows;
  for (let index = 0; index < defaultRows; index++) {
    tableValue.value.push({ ...columsOption });
  }
};

initTableValue();

watch(
  () => props.value,
  (value) => {
    if (value && isArray(value)) {
      tableValue.value = value;
    }
    isUnDef(value) && initTableValue();
  }
);

const handleAddRow = () => {
  const maxRows = props.config.attribute.maxRows;

  if ((maxRows && tableValue.value.length < maxRows) || !maxRows) {
    tableValue.value.push({ ...columsOption, add: true });
    emit("update:value", unref(tableValue.value));
    formItem?.validate("change");
  } else if (maxRows) {
    ElMessage.error(`最多允许填写${maxRows}行`);
  }
};

const handleDeleteRow = (index: number) => {
  const { minRows } = props.config.attribute;
  if (tableValue.value.length <= minRows) {
    ElMessage.error(`最少填写${minRows}行`);
    return;
  }
  tableValue.value.splice(index, 1);
  emit("update:value", unref(tableValue.value));
  formItem?.validate("change");
};

const isEmpty = ref(true);

watch(
  () => isEmpty.value,
  () => {
    emit("triggerSkip", !isEmpty.value, tableValue.value, props.config);
  }
);

const handleInput = () => {
  emit("update:value", unref(tableValue.value));
  formItem?.validate("change");
  isEmpty.value = !(
    tableValue.value.length > 0 &&
    tableValue.value.some((record) =>
      Object.values(record).some((item) => !!item)
    )
  );
};
const handleSelectChange = () => {
  emit("update:value", unref(tableValue.value));
  formItem?.validate("change");
  isEmpty.value = !(
    tableValue.value.length > 0 &&
    tableValue.value.some((record) =>
      Object.values(record).some((item) => !!item)
    )
  );
};

onMounted(() => {
  const { value } = props;
  if (value && isArray(value)) {
    tableValue.value = value;
  }
});
</script>
<style lang="less" scoped>
.option-title {
  color: rgb(170, 170, 170);
  font-size: 12px;
  margin-bottom: 5px;
}

:deep(.el-button) {
  border: 1px dashed #d3d3d3;
}
</style>

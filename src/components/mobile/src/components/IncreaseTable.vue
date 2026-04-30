<template>
  <div class="w-full">
    <div class="grid grid-cols-1 gap-15px">
      <div v-for="(item, index) in tableValue" :key="item" class="row-card">
        <div class="flex items-center justify-between">
          <span class="text-14px font-bold">{{ index + 1 }}</span>
          <van-icon
            v-if="!readOnly"
            name="delete-o"
            color="#f55"
            size="20"
            @click="handleDeleteRow(index)"
          />
        </div>
        <div v-for="c in config.children" :key="c.id">
          <div v-html="c.title" class="option-title"></div>
          <VantPicker
            v-if="c.attribute.dataType === 'select'"
            v-model:value="item[c.id]"
            :options="c.attribute.options"
            :disabled="readOnly"
            @change="handleSelectChange"
          />
          <van-field
            v-else
            v-model="item[c.id]"
            class="border-b"
            :disabled="readOnly"
            type="textarea"
            rows="1"
            autosize
            @update:model-value="handleInput"
          ></van-field>
        </div>
      </div>
    </div>
    <van-button
      v-if="!readOnly"
      class="!mt-15px"
      size="small"
      block
      icon="add-o"
      @click="handleAddRow"
      >继续填写
    </van-button>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref, unref, watch, nextTick } from "vue";
import { ElMessage, useFormItem } from "element-plus";
import { isArray, isUnDef } from "@/utils/is";
import VantPicker from "@/components/VantPicker";

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
  tableValue.value = []
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

onMounted(async () => {
  console.log('执行了')
  await nextTick()
  const { value } = props;
  if (value && isArray(value)) {
    tableValue.value = value;
  }
});
</script>
<style lang="less" scoped>
.option-title {
  color: rgb(170, 170, 170);
  font-size: 14px;
  margin-top: 10px;
}

:deep(.van-button--default) {
  border: 1px dashed #d3d3d3;
}

.row-card {
  padding: 10px;
  border: 1px dashed #ededef;
}
</style>

<template>
  <div class="w-full">
    <div class="table-box">
      <div class="table">
        <div class="table-th">
          <div class="table-td" style="width: 40px"></div>
          <div
            v-for="item in config.children"
            :key="item.id"
            class="table-td"
            v-html="item.title"
          ></div>
        </div>
        <div
          class="table-tr relative"
          v-for="(item, index) in tableValue"
          :key="item"
          @mouseover="!readOnly && handleMouseOver(index)"
          @mouseleave="mouseoverIndex = -1"
        >
          <div class="table-td" style="width: 40px; padding: 5px 0">
            <el-icon
              v-if="index === mouseoverIndex"
              color="#f55"
              class="cursor-pointer"
              @click="handleDeleteRow(index)"
            >
              <Delete />
            </el-icon>
            <span v-else>{{ index + 1 }}</span>
          </div>
          <div class="table-td" v-for="c in config.children" :key="c.id">
            <el-select
              v-model="item[c.id]"
              :disabled="readOnly"
              v-if="c.attribute.dataType === 'select'"
              @change="handleSelectChange"
            >
              <el-option
                v-for="o in c.attribute.options"
                :key="o.id"
                :label="o.title"
                :value="o.title"
              />
            </el-select>
            <el-input-number
              v-else-if="c.attribute.inputType === 'number'"
              v-model="item[c.id]"
              :disabled="readOnly"
              :min="c.attribute.minValue"
              :max="c.attribute.maxValue"
              :precision="c.attribute.precision ?? 0"
              @change="handleInput"
            />
            <el-input
              v-else
              v-model="item[c.id]"
              :disabled="readOnly"
              v-debounceInput="handleInput"
            ></el-input>
          </div>
        </div>
      </div>
    </div>
    <el-button
      v-if="!readOnly"
      class="w-full"
      type="info"
      @click="handleAddRow"
    >
      <el-icon size="18" class="mr-10px"><CirclePlus /></el-icon>
      继续填写
    </el-button>
  </div>
</template>

<script setup lang="ts">
import { ref, unref, watch, onMounted, watchEffect, nextTick } from "vue";
import { useFormItem, ElMessage } from "element-plus";
import { CirclePlus, Delete } from "@element-plus/icons-vue";
import { isArray, isUnDef } from "@/utils/is";

const { formItem } = useFormItem();

const props = withDefaults(
  defineProps<{
    config: any;
    value: any;
    readOnly: boolean;
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
    if (value && isArray(value)) {
      tableValue.value = value;
    }
    isUnDef(value) && initTableValue();
  }
);

const emit = defineEmits(["update:value", "triggerSkip"]);
const tableValue = ref<any[]>([]);
const columsOption = {};
const mouseoverIndex = ref(-1);

// 表格数据初始化
const initTableValue = () => {
  tableValue.value = []
  props.config.children.map((item: any) => {
    columsOption[item.id] = undefined;
  });
  const defaultRows = props.config.attribute.defaultRows;
  for (let index = 0; index < defaultRows; index++) {
    tableValue.value.push({ ...columsOption });
  }
};

initTableValue();

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

const handleMouseOver = (index: number) => {
  mouseoverIndex.value = index;
};

onMounted(async () => {
  await nextTick()
  const { value } = props;
  if (value && isArray(value)) {
    tableValue.value = value;
  }
});
</script>
<style lang="less" scoped>
.table {
  width: 100%;
  display: table;
  border-collapse: collapse;
}

.table-th {
  display: table-header-group;
  border: 1px solid #ccc;
}

.table-tr {
  display: table-row;
}

.table-td {
  width: 150px;
  display: table-cell;
  text-align: center;
  border: 1px solid #ccc;
  padding: 5px 10px;
  vertical-align: middle;
  position: relative;
}

.table-box {
  width: 100%;
  overflow-x: auto;
}
</style>

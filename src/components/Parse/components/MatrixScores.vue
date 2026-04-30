<template>
  <div class="w-full">
    <div class="table">
      <div class="table-th">
        <div class="table-td"></div>
        <div
          v-for="item in config.children"
          :key="item.id"
          class="table-td"
          v-html="item.title"
        ></div>
      </div>
      <div class="table-tr" v-for="item in config.row" :key="item.id">
        <div class="table-td" v-html="item.title"></div>
        <div class="table-td" v-for="c in config.children" :key="c.id">
          <el-input-number
            v-model="scoreMap[item.id][c.id]"
            :min="1"
            :max="config.attribute.maxScore"
            :disabled="readOnly"
            :precision="0"
            controls-position="right"
            @change="handleNumberChange"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref, unref, watch } from "vue";
import { useFormItem } from "element-plus";
import { isUnDef } from "@/utils/is";

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

const scoreMap = ref<any>({});

watch(
  () => props.value,
  (value) => {
    isUnDef(value) && initScoreMap();
  }
);

// 初始化数据结构
const initScoreMap = () => {
  props.config.row.map((item: any) => {
    scoreMap.value[item.id] = {};
    props.config.children.map((c: any) => {
      scoreMap.value[item.id][c.id] = undefined;
    });
  });
};

initScoreMap();

const isEmpty = ref(true);

watch(
  () => isEmpty.value,
  () => {
    emit("triggerSkip", !isEmpty.value, scoreMap.value, props.config);
  }
);

const handleNumberChange = () => {
  const _value = unref(scoreMap.value);
  emit("update:value", _value);
  formItem?.validate("change");
  isEmpty.value = Object.values(_value).length === 0;
};

onMounted(() => {
  const { value } = props;
  if (value) {
    scoreMap.value = value;
  }
});
</script>

<style lang="less" scoped>
.table {
  width: 100%;
  margin: 0 auto;
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
  width: 100px;
  display: table-cell;
  text-align: center;
  border: 1px solid #ccc;
  padding: 2px;
  vertical-align: middle;
  position: relative;
}

:deep(.el-input-number) {
  width: 80px;
}
</style>

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
            v-if="c.attribute.inputType === 'number'"
            v-model="inputMap[item.id][c.id]"
            :disabled="readOnly"
            :min="c.attribute.minValue"
            :max="c.attribute.maxValue"
            :precision="c.attribute.precision ?? 0"
            @change="handleInput"
          />
          <el-input
            v-else
            :disabled="readOnly"
            v-model="inputMap[item.id][c.id]"
            @input="handleInput"
          ></el-input>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, unref, watch, onMounted } from "vue";
import { useFormItem } from "element-plus";
import { isObject, isUnDef } from "@/utils/is";

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

const inputMap = ref<any>({});

watch(
  () => props.value,
  (value) => {
    isUnDef(value) && initInputMap();
  }
);

// 初始化数据结构
const initInputMap = () => {
  props.config.row.map((item: any) => {
    props.config.children.map((c: any) => {
      inputMap.value[item.id] = { [c.id]: undefined };
    });
  });
};

initInputMap();

const isEmpty = ref(true);

watch(
  () => isEmpty.value,
  () => {
    emit("triggerSkip", !isEmpty.value, inputMap.value, props.config);
  }
);

const handleInput = async () => {
  emit("update:value", unref(inputMap.value));
  formItem?.validate("change");
  isEmpty.value = !Object.values(inputMap.value).some((child: any) =>
    Object.values(child).some((c) => !!c)
  );
};

const initVaule = () => {
  const { value: answer } = props;
  if (answer && isObject(answer)) {
    for (const key in answer) {
      const inputValue = answer[key];
      for (const inputValueKey in inputValue) {
        inputMap.value[key][inputValueKey] = inputValue[inputValueKey];
      }
    }
  }
};

onMounted(() => {
  initVaule();
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
  padding: 5px;
  vertical-align: middle;
  position: relative;
}

// :deep(.el-radio__label) {
//   display: none;
// }
</style>

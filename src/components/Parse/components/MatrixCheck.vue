<template>
  <div class="w-full">
    <div class="table" v-if="!config.attribute.vertical">
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
          <el-checkbox
            :disabled="readOnly"
            size="large"
            v-model="checkedMap[item.id][c.id].checked"
            :label="c.id"
            @change="handleRadioChange"
          >
            <span></span>
            <el-input
              :disabled="readOnly"
              size="small"
              v-if="c.attribute.addInput && checkedMap[item.id][c.id].checked"
              v-model="checkedMap[item.id][c.id].input"
              @input="handleInput"
            ></el-input>
          </el-checkbox>
        </div>
      </div>
    </div>
    <div class="table" v-else>
      <div class="table-th">
        <div class="table-td"></div>
        <div
          v-for="item in config.row"
          :key="item.id"
          class="table-td"
          v-html="item.title"
        ></div>
      </div>
      <div class="table-tr" v-for="item in config.children" :key="item.id">
        <div class="table-td" v-html="item.title"></div>
        <div class="table-td" v-for="c in config.row" :key="c.id">
          <el-checkbox
            :disabled="readOnly"
            size="large"
            v-model="checkedMap[c.id][item.id].checked"
            :label="item.id"
            @change="handleRadioChange"
          >
            <span></span>
            <el-input
              :disabled="readOnly"
              size="small"
              v-if="
                item.attribute.addInput && checkedMap[c.id][item.id].checked
              "
              v-model="checkedMap[c.id][item.id].input"
              @input="handleInput"
            ></el-input>
          </el-checkbox>
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

watch(
  () => props.value,
  (value) => {
    isUnDef(value) && initCheckedMap();
  }
);

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

// :deep(.el-radio__label) {
//   display: none;
// }
</style>

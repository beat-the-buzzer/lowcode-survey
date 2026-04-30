<template>
  <div class="p-20px">
    <el-space :size="20" class="mb-10px">
      <div v-for="l in level - 1" :key="l">
        <span class="mr-10px">{{ `层级${l}:` }}</span>
        <el-select
          v-model="selected[`level${l}`]"
          @change="(val) => handleSelectChange(val, l)"
          clearable
        >
          <el-option
            v-for="item in options[`level${l}`]"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </div>
    </el-space>
    <div class="flex justify-end mb-10px">
      <el-radio-group v-model="chartType">
        <el-radio-button label="table">表格</el-radio-button>
        <el-radio-button label="bar">柱状图</el-radio-button>
        <el-radio-button label="line">折线图</el-radio-button>
        <el-radio-button label="pie">饼图</el-radio-button>
      </el-radio-group>
    </div>
    <Table
      v-if="chartType === 'table'"
      :table-data="tableData"
      :total="total"
    />
    <Chart :chart-type="chartType" :data-source="tableData" v-else></Chart>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import Chart from "./Chart.vue";
import Table from "./Table.vue";
import { findNode, getLevel } from "@/utils/tree";
import { getCascaderStatistics } from "@/api";
import { multText2Tree } from "@/utils/text2Tree";

const props = defineProps({
  question: {
    type: Object,
    default: () => {},
  },
  content: {
    type: Object,
    default: () => {},
  },
});

const tableData = ref([]);
const level = ref(0);
const total = ref(0);
const chartType = ref("table");
const options = ref<any>({});
const selected = ref<any>({});

const init = () => {
  const { totalDjCount } = props.content;
  total.value = totalDjCount;
  const { children } = props.question;
  // const arr = multText2Tree(children, "/");
  level.value = getLevel(children, "children");
  if (level.value > 0) {
    options.value["level1"] = children;
  }
  getData();
};

const getData = async () => {
  const values = Object.values(selected.value).filter((item) => item);
  const label = values.length > 0 ? JSON.stringify(values) : null;
  const { data } = await getCascaderStatistics({
    wtid: props.question.id,
    label: label,
  });
  tableData.value = data.map((item: any) => {
    return {
      name: item.label,
      value: item.count,
      percentage: item.rate,
    };
  });
};

const handleSelectChange = (value: string, _level: number) => {
  const { children } = props.question;
  options.value[`level${_level + 1}`] = findNode(children, value, "label");
  for (let i = _level + 1; i <= level.value; i++) {
    selected.value[`level${i}`] = "";
  }
  getData();
};

init();
</script>

<template>
  <div class="p-20px">
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
import { rexFilter } from "@/utils/transform";

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

const total = ref(0);
const chartType = ref("table");

const init = () => {
  const { totalDjCount, xmArr } = props.content;
  total.value = totalDjCount;
  tableData.value = xmArr.map((item: any) => {
    return {
      name: rexFilter(item.xmmc),
      value: item.count,
      percentage: item.rate,
    };
  });
};

init();
</script>

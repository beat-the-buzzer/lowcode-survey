<template>
  <div class="p-20px">
    <div class="flex justify-end mb-10px">
      <el-radio-group v-model="chartType">
        <el-radio-button label="table">得分详情</el-radio-button>
        <el-radio-button label="average">平均分</el-radio-button>
        <el-radio-button label="bar">柱状图</el-radio-button>
        <el-radio-button label="line">折线图</el-radio-button>
        <el-radio-button label="pie">饼图</el-radio-button>
      </el-radio-group>
    </div>
    <Table
      v-if="chartType === 'table'"
      :table-data="content.xmArr"
      :total="total"
    />
    <AverageTable
      v-else-if="chartType === 'average'"
      :question="question"
      :averageMap="content.matrixXmArr"
    />
    <Chart
      :chart-type="chartType"
      :data-source="tableData"
      :xLabels="xLabels"
      v-else
    ></Chart>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import Chart from "./MultChart.vue";
import Table from "./ScoresTable.vue";
import AverageTable from "./AverageTable.vue";
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
const chartType = ref("average");
const xLabels = ref<string[]>([]);

const initData = () => {
  let _data: any = [];
  const { question, content } = props;
  const { row, children } = question;
  const { matrixXmArr, totalDjCount } = content;
  row.map((r: any) => {
    let arr: any = [];
    const children = matrixXmArr[r.id];
    children.map((c: any) => {
      if (c.xmid != "total") {
        arr.push({
          name: rexFilter(c.ymc),
          value: c.avgScore,
        });
      }
    });
    _data.push({
      title: rexFilter(r.title),
      list: arr,
    });
  });
  tableData.value = _data;
  total.value = totalDjCount;
  xLabels.value = children.map((item) => rexFilter(item.title));
};

initData();
</script>

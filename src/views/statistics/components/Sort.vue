<template>
  <div class="p-20px">
    <div class="flex justify-end mb-10px">
      <el-radio-group v-model="chartType">
        <el-radio-button label="table">表格</el-radio-button>
        <el-radio-button label="bar">柱状图</el-radio-button>
        <el-radio-button label="line">折线图</el-radio-button>
        <el-radio-button label="radar">雷达图</el-radio-button>
      </el-radio-group>
    </div>
    <el-table :data="tableData" border v-if="chartType === 'table'">
      <el-table-column prop="name" label="选项" sortable />
      <el-table-column prop="value" label="综合得分" sortable />
      <el-table-column
        :prop="`sort${item}`"
        :label="`排序${item}`"
        sortable
        v-for="item in atMost"
        :key="item"
      />
      <el-table-column prop="summation" label="小计" />
    </el-table>

    <Chart
      :chart-type="chartType"
      :data-source="tableData"
      :at-most="atMost"
      v-else
    ></Chart>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";
import Chart from "./SortChart.vue";
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

const atMost = computed(() => {
  return props.question.attribute.atMost || props.question.children.length;
});

const tableData = ref([]);

const chartType = ref("table");

const init = () => {
  const { totalDjCount, xmArr } = props.content;
  tableData.value = xmArr.map((item: any) => {
    const map: any = {};
    item.sortCount.map((s: number, index: number) => {
      map[`sort${index + 1}`] = s;
    });
    return {
      name: rexFilter(item.xmmc),
      summation: totalDjCount,
      ...map,
      value: item.score,
    };
  });
};

init();
</script>

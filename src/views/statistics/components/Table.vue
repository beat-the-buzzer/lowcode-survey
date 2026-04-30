<template>
  <el-table
    :data="tableData"
    border
    :summary-method="getSummaries"
    show-summary
  >
    <el-table-column prop="name" label="选项" sortable />
    <el-table-column prop="value" label="小计" sortable />
    <el-table-column label="比例">
      <template #default="scope">
        <el-progress :percentage="formatPercentage(~~scope.row.value)">
          <template #default="{ percentage }">
            <span class="text-xs text-slate-400 mr-10px"
              >{{ percentage }}%</span
            >
            <span class="text-xs text-slate-400">{{
              `${scope.row.value}/${total}`
            }}</span>
          </template>
        </el-progress>
      </template>
    </el-table-column>
  </el-table>
</template>

<script setup lang="ts">
import { ref } from "vue";

const props = defineProps({
  tableData: {
    type: Array,
    default: () => [],
  },
  total: {
    type: Number,
    default: 0,
  },
});

const getSummaries = () => {
  const sums: string[] = ["本题有效填写人次", props.total.toString(), ""];
  return sums;
};

const formatPercentage = (val: number) => {
  const num = (val / props.total) * 100;
  return Number(num.toString().match(/^\d+(?:\.\d{0,2})?/));
};
</script>

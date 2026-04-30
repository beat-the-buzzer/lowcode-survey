<template>
  <div>
    <div v-for="item in tableData" :key="item.id">
      <div class="column-title">{{ item.title }}</div>
      <el-table
        :data="item.list"
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
    </div>
  </div>
</template>

<script setup lang="ts">
const props = withDefaults(
  defineProps<{
    tableData: any;
    total: number;
  }>(),
  {
    formData: () => {},
    total: 0,
  }
);

const getSummaries = () => {
  return ["本题有效填写人次", props.total.toString(), ""];
};

const formatPercentage = (val: number) => {
  const num = (val / props.total) * 100;
  return Number(num.toString().match(/^\d+(?:\.\d{0,2})?/));
};
</script>
<style lang="less" scoped>
.column-title {
  font-size: 14px;
  font-weight: bold;
  margin: 10px 0;
}
</style>

<template>
  <div>
    <div v-for="item in tableData" :key="item.id">
      <div class="column-title">
        {{ `${item["xmc"]}-${item["ymc"]}   （平均分${item["avgScore"]}）` }}
      </div>
      <el-table
        :data="item.scoreList"
        border
        :summary-method="getSummaries"
        show-summary
      >
        <el-table-column prop="xmmc" label="分值" sortable />
        <el-table-column prop="count" label="小计" sortable />
        <el-table-column label="比例">
          <template #default="scope">
            <el-progress :percentage="formatPercentage(~~scope.row.count)">
              <template #default="{ percentage }">
                <span class="text-xs text-slate-400 mr-10px"
                  >{{ percentage }}%</span
                >
                <span class="text-xs text-slate-400">{{
                  `${scope.row.count}/${total}`
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

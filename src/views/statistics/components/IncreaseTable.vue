<template>
  <div class="p-20px">
    <el-button type="primary" @click="handleClick">查看问卷答案</el-button>
    <el-dialog
      v-model="visible"
      title="查看问卷答案"
      width="1280px"
      destroy-on-close
    >
      <div class="flex justify-between mb-10px">
        <el-input style="width: 300px">
          <template #append>
            <el-button :icon="Search" type="primary" />
          </template>
        </el-input>
        <el-button type="primary" @click="handleExport">导出本题答案</el-button>
      </div>
      <el-table :data="tableData" stripe style="width: 100%" max-height="500">
        <el-table-column type="index" label="序号" width="80" />
        <el-table-column prop="tjsj" label="提交答卷时间" width="200" />
        <el-table-column prop="djr" label="答卷人" width="150" />
        <el-table-column
          v-for="item in question?.['children'] || []"
          :key="item.id"
          :prop="item.id"
          :label="rexFilter(item.title)"
          width="200"
        />
        <el-table-column prop="action" label="操作" width="100">
          <template #default="{ row }">
            <el-button link type="primary" @click="handleDownload(row)"
              >查看答卷</el-button
            >
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        small
        class="mt-20px"
        style="justify-content: end"
        v-model:current-page="pagination.current"
        v-model:page-size="pagination.size"
        :page-sizes="[10, 20, 30, 50]"
        :layout="'total, sizes, prev, pager, next, jumper'"
        :total="pagination.total"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      />
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref } from "vue";
import { getAnswers } from "@/api";
import { downloadXlsx } from "@/utils/download";
import { rexFilter } from "@/utils/transform";
import { Search } from "@element-plus/icons-vue";
import { useRoute } from "vue-router";

const route = useRoute();

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

const visible = ref(false);
const pagination = reactive({
  current: 1,
  total: 0,
  size: 10,
});
const tableData = ref<any>([]);

const handleClick = () => {
  visible.value = true;
  getData();
};

const getData = async () => {
  const { data } = await getAnswers({
    wjid: route.query?.id,
    wtid: props.question.id,
    wtlx: "increase_table",
    size: pagination.size,
    current: pagination.current,
  });
  tableData.value = data.records;
  pagination.total = data.total;
};

const handleSizeChange = async (val: number) => {
  pagination.size = val;
  pagination.current = 1;
  await getData();
};

const handleCurrentChange = async (val: number) => {
  pagination.current = val;
  await getData();
};

const handleExport = () => {
  downloadXlsx("wtxx", props.question.id, "回答统计");
};

const handleDownload = (row: any) => {
  downloadXlsx("wjxx", route.query?.id as string, "答卷");
};
</script>

<style></style>

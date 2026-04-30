<template>
  <div>
    <div v-html="config.attribute.content" class="mb-10px"></div>
    <div class="flex justify-between mb-10px">
      <!--      <el-input style="width: 300px">-->
      <!--        <template #append>-->
      <!--          <el-button :icon="Search" type="primary" />-->
      <!--        </template>-->
      <!--      </el-input>-->
      <div></div>
      <el-button type="primary" @click="handleExport">导出本题答案</el-button>
    </div>
    <el-table :data="tableData" stripe style="width: 100%" max-height="500">
      <el-table-column type="index" label="序号" width="80" />
      <el-table-column prop="tjsj" label="提交答卷时间" width="200" />
      <el-table-column prop="djr" label="答卷人" width="150" />
      <el-table-column prop="tknr" label="答案" />
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
  </div>
</template>

<script lang="ts" setup>
import { ref, reactive, onMounted } from "vue";
import { getAnswers } from "@/api";
import { downloadXlsx } from "@/utils/download";
import { Search } from "@element-plus/icons-vue";

const props = defineProps({
  question: {
    type: Object,
    default: () => {},
  },
  params: {
    type: Object,
    default: () => {},
  },
});

const config = ref(props.question.children[0]);

const pagination = reactive({
  current: 1,
  total: 0,
  size: 10,
});
const tableData = ref<any>([]);

const getData = async () => {
  const { data } = await getAnswers({
    ...props.params,
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
  downloadXlsx("wjxx", row.wjid, "答卷");
};

onMounted(async () => {
  await getData();
});
</script>

<style></style>

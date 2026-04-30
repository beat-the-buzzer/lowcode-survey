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
        <el-input style="width: 300px" placeholder="请输入文件名">
          <template #append>
            <el-button :icon="Search" type="primary" />
          </template>
        </el-input>
        <el-button type="primary" @click="handleExport">下载附件</el-button>
      </div>
      <el-table :data="tableData" stripe style="width: 100%" max-height="500">
        <el-table-column type="index" label="序号" width="80" />
        <el-table-column prop="tjsj" label="提交答卷时间" width="200" />
        <el-table-column prop="djr" label="答卷人" width="150" />
        <el-table-column prop="name" label="文件名" />
        <el-table-column prop="action" label="操作" width="100">
          <template #default="{ row }">
            <el-button link type="primary" @click="handleDownload(row)"
              >下载文件</el-button
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
import { downloadXlsx, downloadZip } from "@/utils/download";
import { Search } from "@element-plus/icons-vue";
import { useRoute } from "vue-router";
import { downloadFile } from "@/api/file";

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
    xmid: props.question.children[0].id,
    wtlx: "upload",
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
  downloadXlsx("wtxx_file", props.question.id, "问题附件");
};

const handleDownload = (row: any) => {
  downloadZip(row.alias, row.url);
};
</script>

<style></style>

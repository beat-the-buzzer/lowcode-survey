<template>
  <div>
    <el-page-header @back="goBack">
      <template #content>
        <span class="text-large font-600 mr-3"> 下载管理 </span>
      </template>
    </el-page-header>
    <el-table class="mt-20px" :data="tableData" border table-layout="auto">
      <el-table-column prop="filename" label="文件名称" />
      <el-table-column prop="suffix" label="文件类型" />
      <el-table-column prop="size" label="文件大小" />
      <el-table-column prop="status" label="生成状态">
        <template #default="{ row }">
          <el-tag
            :type="row['status'] != '1' ? '' : 'success'"
            disable-transitions
            >{{ row["status"] == "1" ? "已完成" : "进行中" }}</el-tag
          >
        </template>
      </el-table-column>
      <el-table-column label="操作">
        <template #default="{ row }">
          <el-button
            size="small"
            v-if="row['status'] == '1'"
            @click="onDownload(row)"
            >下载</el-button
          >
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import { getDownloadList } from "@/api";
import { downloadByTask } from "@/utils/download";

const router = useRouter();

const tableData = ref<any[]>([]);

const load = async () => {
  const { data } = await getDownloadList();
  tableData.value = data;
};

const onDownload = (record: any) => {
  downloadByTask(record["filename"], record["suffix"]);
};

const goBack = () => {
  router.push({ name: "list" });
};

onMounted(() => {
  load();
});
</script>

<style lang="less" scoped></style>

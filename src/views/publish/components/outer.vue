<template>
  <el-card shadow="never" id="outer-distribute">
    <div class="flex items-center justify-between w-full">
      <div class="text-16px w-300px">
        <span> 其他</span>
        （共
        <span style="color: #e60039">{{ total }}</span>
        位）
      </div>
      <div class="flex gap-10px">
        <el-upload
          ref="uploader"
          accept=".xls,.xlsx"
          :http-request="handleUpload"
          :show-file-list="false"
        >
          <el-button type="primary"> 导入 </el-button>
        </el-upload>
        <el-popconfirm title="是否确认清空导入数据?" @confirm="onClear">
          <template #reference>
            <el-button type="danger" plain>清空</el-button>
          </template>
        </el-popconfirm>
      </div>
    </div>
    <div class="flex items-center my-15px gap-10px">
      <div class="flex items-center">
        答题人身份核验字段：
        <el-tooltip
          content="其他导入人员答题时进行身份核验的字段，核验通过才能开始答卷。"
          placement="top"
        >
          <el-icon class="ml-5px"><InfoFilled /></el-icon>
        </el-tooltip>
      </div>
      <el-select
        v-model="userCheckFields"
        multiple
        filterable
        placeholder="请选择"
        class="!w-500px"
      >
        <el-option
          v-for="item in allFields"
          :key="item.value"
          :label="item.label"
          :value="item.label"
        />
      </el-select>
    </div>
    <div class="mt-10px" v-if="allFields.length">
      <el-table :data="tableData" border stripe size="small">
        <el-table-column
          v-for="item in allFields"
          :key="item.value"
          :prop="item.value"
          :label="item.label"
        />
      </el-table>
      <div class="flex justify-end mt-10px">
        <el-pagination
          v-model:current-page="pagination.current"
          v-model:page-size="pagination.size"
          :page-sizes="[15, 30, 50, 100]"
          :layout="'total, sizes, prev, pager, next, jumper'"
          :total="total"
          small
          @size-change="onPageSizeChange"
          @current-change="onPageSizeChange"
        />
      </div>
    </div>
  </el-card>
</template>

<script setup lang="ts">
import { nextTick, reactive, ref, onMounted } from "vue";
import { InfoFilled } from "@element-plus/icons-vue";
import { ElMessage, ElLoading } from "element-plus";
import { uploadExportFile } from "@/api/file";
import {
  getOuterCheckFields,
  getOuterUsers,
  getOuterFields,
  outerUserDistribute,
} from "@/api/distribute";
import { useRoute } from "vue-router";

const route = useRoute();

const showTable = ref(false);
const tableData = ref<any[]>([]);
const userCheckFields = ref<string[]>([]);
const allFields = ref<any[]>([]);
const pagination = reactive({
  current: 1,
  size: 15,
});
const total = ref(0);

const beforeUpload = (rawFile: any) => {
  const type = rawFile.name.substring(rawFile.name.lastIndexOf(".") + 1);
  if (!["xls", "xlsx"].includes(type)) {
    ElMessage.error(`请上传.xls或者.xlsx格式文件!`);
    return false;
  }
  return true;
};
const handleUpload = async ({ file }) => {
  const check = beforeUpload(file);
  if (!check) return;
  const loadingInstance = ElLoading.service({
    target: "#outer-distribute",
    text: "上传中，请稍后...",
    background: "rgba(122, 122, 122, 0.8)",
  });
  try {
    await uploadExportFile(route.query.id, {
      file,
    });
    reset();
  } finally {
    await nextTick(() => {
      loadingInstance.close();
    });
  }
};

const getTableData = async () => {
  const { data } = await getOuterUsers({
    ...pagination,
    wjid: route.query?.id,
  });

  const arr = data.records ?? [];
  tableData.value = arr.map((item) => {
    const stringArr = item["userdata"].split(",") ?? [];
    let result: any = {};
    stringArr.map((s, index) => {
      result[`c${index}`] = s == "null" ? "" : s;
    });
    return result;
  });

  total.value = data.total;
};

const getColumns = async () => {
  const { data } = await getOuterFields({ wjid: route.query?.id });
  const allArr = data.metatitle?.split(",") ?? [];
  allFields.value = allArr.map((s: string, index: number) => {
    return {
      label: s,
      value: `c${index}`,
    };
  });
  userCheckFields.value = data.metakey?.split(",") ?? [];
};

const onPageSizeChange = () => {
  getTableData();
};

const reset = async () => {
  pagination.current = 1;
  await getColumns();
  await getTableData();
};

const onClear = () => {};

const onSubmit = async () => {
  if (userCheckFields.value.length === 0) {
    ElMessage.error("请选择答题人身份核验字段！");
    return;
  }
  const { message } = await outerUserDistribute({
    wjid: route.query?.id,
    metakeyArr: userCheckFields.value,
    fftjArr: JSON.stringify([{ title: "其他", identity: "other" }]),
  });

  ElMessage.success(message);
};

onMounted(() => {
  getColumns();
  getTableData();
});

defineExpose({
  onSubmit,
});
</script>

<style lang="less" scoped>
:deep(.el-table th.el-table__cell) {
  font-size: 15px;
  background: var(--el-color-primary-light-3);
  color: #fff;
  .cell {
    line-height: 40px;
  }
}
</style>

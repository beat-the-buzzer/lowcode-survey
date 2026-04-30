<template>
  <div class="flex justify-center" id="survey-list">
    <div class="w-full">
      <div class="flex justify-between items-center">
        <el-button
          v-permission="'edit'"
          type="primary"
          size="large"
          @click="handleAddSurvey"
        >
          <el-icon size="20"><Plus /></el-icon>
          <span class="text-xl">创建问卷</span>
        </el-button>
        <div class="flex items-center">
          <el-date-picker
            v-model="search.time"
            style="width: 300px"
            type="daterange"
            range-separator="~"
            value-format="YYYY-MM-DD"
            clearable
            start-placeholder="更新时间-开始"
            end-placeholder="更新时间-结束"
          />
          <el-input
            style="width: 200px"
            placeholder="问卷名称"
            v-model="search.name"
            clearable
            @keydown="handleKeyDown"
          >
          </el-input>
          <el-button type="primary" @click="getList">
            <el-icon><Search /></el-icon>
          </el-button>
        </div>
        <div>
          <el-radio-group v-model="search.state" @change="handleStateQuery">
            <el-radio-button label=""> 全部 </el-radio-button>
            <el-radio-button label="1"> 运行 </el-radio-button>
            <el-radio-button label="2"> 停止 </el-radio-button>
            <el-radio-button label="0"> 草稿 </el-radio-button>
          </el-radio-group>
          <el-radio-group class="ml-20px" v-model="showMode">
            <el-radio-button label="card">
              <el-icon><Grid /></el-icon>
            </el-radio-button>
            <el-radio-button label="list">
              <el-icon><List /></el-icon>
            </el-radio-button>
          </el-radio-group>
        </div>
      </div>
      <ListMode
        :data-source="list"
        v-if="list.length > 0 && showMode === 'list'"
        @copy="handleCopy"
        @delete="handleDelete"
        @design="handleDesign"
        @preview="handlePreview"
        @publish="handlePublish"
        @run="handleRun"
        @poster="handlePoster"
        @setting="handleSetting"
        @statistics="handleStatistic"
        @download="handleDownload"
        @monitor="handleMonitor"
      />
      <CardMode
        :data-source="list"
        v-if="list.length > 0 && showMode === 'card'"
        @copy="handleCopy"
        @delete="handleDelete"
        @design="handleDesign"
        @poster="handlePoster"
        @preview="handlePreview"
        @publish="handlePublish"
        @run="handleRun"
        @setting="handleSetting"
        @statistics="handleStatistic"
        @download="handleDownload"
        @monitor="handleMonitor"
      />
      <div v-if="list.length === 0">
        <el-empty description="暂无数据" />
      </div>
      <div class="mt-20px" v-if="list.length > 0">
        <el-pagination
          style="justify-content: end"
          v-model:current-page="pagination.current"
          v-model:page-size="pagination.size"
          :page-sizes="[12, 24, 48]"
          :layout="'total, sizes, prev, pager, next, jumper'"
          :total="pagination.total"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        />
      </div>
    </div>
    <el-dialog
      v-model="confirmVisible"
      title="问卷修改确认"
      width="600px"
      destroy-on-close
    >
      <EditConfirmModal v-if="confirmVisible" :wjid="updateId" />
    </el-dialog>
    <el-dialog v-model="copyVisible" title="复制模板" width="600">
      <el-form :model="copyForm" ref="copyFormRef">
        <el-form-item label="问卷名称" :label-width="100" prop="name" required>
          <el-input v-model="copyForm.name" autocomplete="off" />
        </el-form-item>
        <el-form-item prop="autosubmit" style="display: none">
          <el-input />
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="copyVisible = false">取消</el-button>
          <el-button
            type="primary"
            :loading="copyForm.loading"
            @click="CopyCreate"
          >
            创建
          </el-button>
        </span>
      </template>
    </el-dialog>
    <el-dialog
      v-model="runVisible"
      title="启用确认"
      width="600px"
      destroy-on-close
    >
      <RunConfirm :wjid="updateId" @success="onSuccess" />
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, nextTick } from "vue";
import {
  getSurveyList,
  deleteSurvey,
  updateSurveyState,
  getSurvey,
  addSurvey,
} from "@/api";
import { useRouter } from "vue-router";
import { ElMessage, ElMessageBox, ElLoading } from "element-plus";
import EditConfirmModal from "./componets/EditConfirm.vue";
import ListMode from "./componets/list.vue";
import CardMode from "./componets/cards.vue";
import { rexFilter } from "@/utils/transform";
import { downloadXlsx } from "@/utils/download";
import { Grid, List, Plus, Search } from "@element-plus/icons-vue";
import RunConfirm from "./componets/runConfirm.vue";

const router = useRouter();

const copyFormRef = ref<any>();

const search = reactive({
  keyword: "",
  state: undefined,
  time: [] as any,
  name: undefined,
});

const list = ref<any[]>([]);

const confirmVisible = ref(false);
const copyVisible = ref(false);
const runVisible = ref(false);

const updateId = ref("");
const origin = ref<any>({});

const pagination = reactive({
  current: 1,
  total: 0,
  size: 12,
});

const copyForm = reactive({
  name: "",
  loading: false,
});

const showMode = ref("card");

const getList = async () => {
  const loadingInstance = ElLoading.service({
    target: document.getElementById("survey-list") || document.body,
    text: "数据加载中...",
  });
  try {
    const { currentRoute } = router;
    const { data } = await getSurveyList({
      size: pagination.size,
      current: pagination.current,
      wjmc: search.name,
      wjzt: search.state,
      kssj: search.time?.[0],
      jssj: search.time?.[1],
      wjlx: "wj",
      ...currentRoute.value.params,
    });
    list.value = data?.records || [];
    pagination.total = data.total;
  } finally {
    await nextTick(() => {
      loadingInstance.close();
    });
  }
};

const handleSizeChange = async (val: number) => {
  pagination.size = val;
  pagination.current = 1;
  await getList();
};
const handleCurrentChange = async (val: number) => {
  pagination.current = val;
  await getList();
};

const handleStateQuery = async () => {
  pagination.current = 1;
  await getList();
};

const handleAddSurvey = () => {
  router.push({ name: "add" });
};

const handleCopy = (item: any) => {
  copyForm.name = `${item["wjmc"]}-副本`;
  origin.value = item;
  copyVisible.value = true;
};

const handleKeyDown = ({ key, keyCode, code }) => {
  if (key === "Enter" || keyCode === 13 || code === "Enter") {
    getList();
  }
};

const CopyCreate = async () => {
  await copyFormRef.value.validate(async (valid: any, fields: any) => {
    if (valid) {
      copyForm.loading = true;
      const { data: result } = await getSurvey(origin.value.wjid);
      try {
        if (result.wjnr) {
          const survey = JSON.parse(result.wjnr);
          const oldTitle = rexFilter(survey.config.title);
          const arr = survey.config.title.split(oldTitle);
          survey.config.title = arr.join(copyForm.name);
          const { data } = await addSurvey({
            wjmc: copyForm.name,
            wjly: origin.value.wjid,
            wjnr: JSON.stringify(survey),
          });
          let routerData = router.resolve({
            name: "design",
            query: { id: data },
          });
          window.location.assign(routerData.href);
        }
      } catch (error) {
        ElMessage.error("问卷模板数据格式异常，复制失败！");
      } finally {
        copyForm.loading = false;
      }
    } else {
      console.log("error submit!", fields);
    }
  });
};

const handleDelete = async (item: any) => {
  const { data: result } = await getSurvey(item.wjid);
  let confirmMessage = "";
  if (result.djsl && result.djsl > 0) {
    confirmMessage = `当前问卷已有${result.djsl}份答卷，是否确定删除？`;
  } else {
    confirmMessage = "是否确认删除问卷";
  }
  ElMessageBox.confirm(confirmMessage, "警告", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    type: "warning",
  }).then(async () => {
    await deleteSurvey(item.wjid);
    ElMessage.success("问卷删除成功！");
    await getList();
  });
};

const handleDesign = async (item: any) => {
  updateId.value = item.wjid;
  if (item.wjzt === "0") {
    let routerData = router.resolve({
      name: "design",
      query: { id: item.wjid },
    });
    window.location.assign(routerData.href);
  } else if (item.wjzt === "2") {
    const { data } = await getSurvey(item.wjid);
    if (data.djsl > 0) {
      confirmVisible.value = true;
    } else {
      let routerData = router.resolve({
        name: "design",
        query: { id: item.wjid },
      });
      window.location.assign(routerData.href);
    }
  } else if (item.wjzt === "1") {
    ElMessageBox.confirm(
      "此问卷处于运行状态，编辑问卷将可能影响正在填写此问卷的用户",
      // "此问卷处于运行状态，编辑问卷将导致正在填写此问卷的用户无法提交，是否继续？",
      "警告",
      {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      }
    ).then(async () => {
      const { data } = await getSurvey(item.wjid);
      if (data.djsl > 0) {
        confirmVisible.value = true;
      } else {
        let routerData = router.resolve({
          name: "design",
          query: { id: item.wjid },
        });
        window.location.assign(routerData.href);
      }
    });
  }
};

const handleRun = async (item: any) => {
  if (item.wjzt === "1") {
    ElMessageBox.confirm("是否确认停止问卷?", "警告", {
      confirmButtonText: "确定",
      cancelButtonText: "取消",
      type: "warning",
    }).then(async () => {
      await updateSurveyState({ wjid: item.wjid, wjzt: "2" });
      ElMessage.success("问卷已停止运行！");
      await getList();
    });
  } else {
    updateId.value = item.wjid;
    runVisible.value = true;
    // ElMessageBox.confirm("是否确认运行问卷?", "警告", {
    //   confirmButtonText: "确定",
    //   cancelButtonText: "取消",
    //   type: "warning",
    // }).then(async () => {
    //   await updateSurveyState({ wjid: item.wjid, wjzt: "1" });
    //   ElMessage.success("问卷运行成功！");
    //   await getList();
    // });
  }
};

const handlePreview = (item: any) => {
  router.push({ name: "preview", query: { id: item.wjid } });
};

const handlePublish = (item: any) => {
  if (item.wtsl > 0) {
    router.push({ name: "publish", query: { id: item.wjid } });
  } else {
    ElMessage.error("空白问卷不能分发");
  }
};

const handleStatistic = (item: any) => {
  router.push({ name: "statistics", query: { id: item.wjid } });
};

const handleSetting = (item: any) => {
  router.push({ name: "setting", query: { id: item.wjid } });
};

const handleDownload = async (item: any, type: string) => {
  if (type === "1") {
    await downloadXlsx("wjxx", item.wjid, `${item.wjmc}-答卷下载`);
  }
  if (type === "2") {
    await downloadXlsx("wjxx_file", item.wjid, `${item.wjmc}-答卷下载`);
  }
};

const handlePoster = (item: any) => {
  router.push({ name: "poster", query: { id: item.wjid } });
};

const handleMonitor = (item: any) => {
  router.push({ name: "monitor", query: { id: item.wjid } });
};

const onSuccess = () => {
  getList();
  runVisible.value = false;
};

onMounted(async () => {
  await getList();
});
</script>
<style lang="less" scoped>
.title {
  line-height: 36px;
  color: #000;
  font-size: 18px;
  font-weight: 500;
  cursor: pointer;
}
.survey-item {
  background: #fff;
  border-radius: 2px;
  margin-bottom: 20px;
  box-shadow: 0 0 4px 0 #f0f0f0;
  border: 1px solid #e6e6e6;
}
.dropdown-link {
  display: flex;
  align-items: center;
  font-size: 16px;
  cursor: pointer;
}

:deep(.el-menu-item.is-active) {
  background-color: #f3f3f3;
}

:deep(.el-menu) {
  border: none;
}

:deep(.el-menu-item) {
  border-bottom: 1px solid #f3f3f3;
}
</style>

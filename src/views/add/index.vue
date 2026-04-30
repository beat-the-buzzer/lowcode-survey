<template>
  <div>
    <el-page-header @back="goBack" title="返回">
      <template #content>
        <span class="text-large font-600 mr-3"> 创建调查问卷 </span>
      </template>
    </el-page-header>
    <div class="my-20px flex justify-between">
      <div class="w-4/5 col-container">
        <div class="text-lg">从空白创建</div>
        <el-form :model="form" ref="formRef" :rules="rules" class="w-600px">
          <el-form-item prop="name">
            <el-input v-model="form.name" placeholder="请输入标题" />
          </el-form-item>
          <el-form-item prop="autosubmit" style="display: none">
            <el-input />
          </el-form-item>
        </el-form>
        <el-button type="primary" @click="handleCreate(formRef)"
          >立即创建</el-button
        >
      </div>
      <div class="flex-1 col-container ml-20px">
        <!--        <div class="text-lg">导入</div>-->
        <!--        <div class="text-center">-->
        <!--          <el-button disabled>下载模板</el-button>-->
        <!--          <el-button type="primary" disabled>Excel导入</el-button>-->
        <!--        </div>-->
      </div>
      <!-- <div class="w-220px col-container"></div> -->
    </div>
    <div class="my-20px">
      <div class="flex justify-between items-center">
        <div class="text-lg">复制问卷模板</div>
        <el-input
          style="width: 300px"
          v-model="search.name"
          placeholder="问卷名称"
          @keydown="handleKeyDown"
        >
          <template #append>
            <el-button type="primary" @click="getList">
              <el-icon><Search /></el-icon>
            </el-button>
          </template>
        </el-input>
      </div>
      <el-scrollbar class="models-scrollbar mt-20px">
        <el-row>
          <el-col
            v-for="item in list"
            :key="item.wjid"
            :span="4"
            class="mt-20px"
          >
            <div class="survey-model">
              <span class="model-title" :title="item.wjmc">{{
                item.wjmc
              }}</span>
              <div class="mt-10px">
                <el-tag class="mr-10px">{{ item.wjlxmc }}</el-tag>
                <el-tag
                  :type="
                    item.wjzt === '0'
                      ? 'info'
                      : item.wjzt === '1'
                      ? 'success'
                      : 'warning'
                  "
                >
                  {{ item.wjztmc }}</el-tag
                >
              </div>
              <div class="mt-30px flex justify-end">
                <!-- <el-link type="success" class="mr-10px">预览</el-link> -->
                <el-link type="primary" @click="handleCopy(item)">使用</el-link>
              </div>
            </div>
          </el-col>
        </el-row>
      </el-scrollbar>
      <el-pagination
        class="mt-20px"
        hide-on-single-page
        style="justify-content: end"
        v-model:current-page="pagination.current"
        v-model:page-size="pagination.size"
        :layout="'total, prev, pager, next, jumper'"
        :total="pagination.total"
        @current-change="handleCurrentChange"
      />
    </div>
    <el-dialog v-model="dialogVisible" title="复制模板" width="600">
      <el-form :model="copyForm" ref="copyFormRef">
        <el-form-item
          label="问卷名称"
          :label-width="100"
          prop="name"
          :rules="[{ required: true, message: '请输入问卷名称' }]"
        >
          <el-input v-model="copyForm.name" autocomplete="off" />
          <el-form-item prop="autosubmit" style="display: none">
            <el-input />
          </el-form-item>
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="dialogVisible = false">取消</el-button>
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
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from "vue";
import { addSurvey } from "@/api";
import type { FormRules } from "element-plus";
import { useRouter } from "vue-router";
import { getSurveyList, getSurvey } from "@/api";
import { ElMessage } from "element-plus";
import { Search } from "@element-plus/icons-vue";
import { rexFilter } from "@/utils/transform";

const router = useRouter();

const formRef = ref<any>();
const copyFormRef = ref<any>();
const dialogVisible = ref(false);

const form = reactive({
  name: "",
});

const copyForm = reactive({
  name: "",
  loading: false,
});

const origin = ref<any>({});

const pagination = reactive({
  current: 1,
  size: 18,
  total: 0,
});

const search = reactive({
  name: "",
});

const list = ref<any>([]);

const rules = reactive<FormRules>({
  name: [
    {
      required: true,
      message: "请输入标题",
      trigger: "change",
    },
  ],
});

const handleCreate = async (formEl: any) => {
  const { currentRoute } = router;
  await formEl.validate(async (valid: any, fields: any) => {
    if (valid) {
      const { data } = await addSurvey({
        wjmc: form.name,
        wjlx: "wj",
        ...currentRoute.value.params,
      });
      let routerData = router.resolve({
        name: "design",
        query: { id: data },
      });
      window.location.assign(routerData.href);
    } else {
      console.log("error submit!", fields);
    }
  });
};

const goBack = () => {
  router.push({ name: "list" });
};

const getList = async () => {
  const { currentRoute } = router;
  const { data } = await getSurveyList({
    size: pagination.size,
    current: pagination.current,
    wjmc: search.name,
    wjlx: "wj",
    ...currentRoute.value.params,
  });
  list.value = data?.records || [];
  pagination.total = data.total;
};

const handleCurrentChange = async (val: number) => {
  pagination.current = val;
  await getList();
};

const handleCopy = (item: any) => {
  copyForm.name = `${item["wjmc"]}-副本`;
  origin.value = item;
  dialogVisible.value = true;
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

const handleKeyDown = ({ keyCode, code, key }) => {
  if (keyCode === 13 || code === "Enter" || key === "Enter") {
    getList();
  }
};

onMounted(() => {
  getList();
});
</script>

<style lang="less" scoped>
.col-container {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
  padding: 30px;
  box-shadow: rgba(67, 71, 85, 0.27) 0px 0px 0.25em,
    rgba(90, 125, 188, 0.05) 0px 0.25em 1em;
  height: 200px;
}
.models-scrollbar {
  height: calc(100vh - 500px);
  box-shadow: rgba(67, 71, 85, 0.27) 0px 0px 0.25em,
    rgba(90, 125, 188, 0.05) 0px 0.25em 1em;
}

.survey-model {
  box-shadow: rgba(67, 71, 85, 0.27) 0px 0px 0.25em,
    rgba(90, 125, 188, 0.05) 0px 0.25em 1em;
  height: 130px;
  padding: 10px;
  margin: 0 10px;
  cursor: pointer;
  .model-title {
    font-size: 16px;
    display: block;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
  }
}
</style>

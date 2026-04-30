<template>
  <div>
    <div class="box">
      <div class="text-lg">{{ `${survey["wjmc"]} - 回收监测` }}</div>
      <div class="flex mt-20px gap-30px">
        <div class="flex items-center">
          分发对象：
          <el-radio-group v-model="query.identity" @change="onIdentityChange">
            <el-radio-button
              v-for="item in identities"
              :key="item"
              :label="item"
            >
              {{ identityEnum[item] }}
            </el-radio-button>
          </el-radio-group>
        </div>
        <div class="flex items-center">
          答卷状态：
          <el-radio-group v-model="query.state" @change="loadTable">
            <el-radio-button label="1">已答卷</el-radio-button>
            <el-radio-button label="0">未答卷</el-radio-button>
          </el-radio-group>
        </div>
      </div>
    </div>
    <div v-if="query.identity" class="box mt-20px">
      <Query
        :key="query.identity"
        :form="queryMap[query.identity]"
        :formModel="formModel"
        :identity="query.identity"
        @search="onSearch"
      />
    </div>
    <div id="recycle-monitor" class="mt-20px" v-if="query.identity">
      <div class="mb-10px">
        <!--        <el-button type="primary">导出</el-button>-->
        <el-button v-if="query.state === '1'" type="primary" @click="onDelete"
          >删除问卷</el-button
        >
      </div>
      <el-table ref="tableRef" :data="tableData" border table-layout="auto">
        <el-table-column type="selection" width="50" />
        <el-table-column
          v-for="item in column[query.identity]"
          :key="item.value"
          :prop="item.value"
          :label="item.label"
        >
          <template #default="{ row, column }">
            <template v-if="column.property === 'djzt'">
              {{ row["djzt"] === "1" ? "已答卷" : "未答卷" }}
            </template>
          </template>
        </el-table-column>
      </el-table>
      <div class="mt-20px text-right">
        <el-pagination
          class="justify-end"
          v-model:current-page="pagination.current"
          v-model:page-size="pagination.size"
          :page-sizes="[10, 20, 30, 50]"
          background
          :layout="'total,prev,pager,next,jumper,sizes'"
          :total="total"
          @size-change="loadTable"
          @current-change="loadTable"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { nextTick, onMounted, reactive, ref } from "vue";
import { getSurvey } from "@/api";
import { useRoute } from "vue-router";
import { getQuery, getRecords } from "@/api/distribute";
import { identityEnum } from "@/enums/commonEnums";
import Query from "@/components/Query";
import { api, column } from "./data";
import { clearEmpty } from "@/utils/help";
import { ElMessage, ElMessageBox, ElLoading } from "element-plus";
import { delAnswer } from "@/api/monitor";

const route = useRoute();

const survey = ref<any>({});
const identities = ref<string[]>([]);
const queryMap = ref<any>({});
const formModel = ref<any>({});
const tableData = ref<any[]>([]);
const total = ref(0);
const tableRef = ref<any>();

const query = reactive({
  identity: "",
  state: "1",
  conditions: {},
});

const pagination = reactive({
  current: 1,
  size: 10,
});

const loadSurvey = async () => {
  if (route.query?.id) {
    const { data } = await getSurvey(route.query?.id);
    survey.value = data;
  }
};

const loadQuery = async () => {
  const { data } = await getQuery();
  queryMap.value = data;
};

const loadRecord = async () => {
  const { data } = await getRecords({ wjid: route.query?.id });
  if (Array.isArray(data) && data.length > 0) {
    const arr = JSON.parse(data[0]["fftj"]);
    identities.value = arr.map((item: any) => item["identity"]);
    query.identity = identities.value[0];
  }
};

const onIdentityChange = () => {
  pagination.current = 1;
  tableData.value = [];
  total.value = 0;
};

const loadTable = async () => {
  await nextTick();
  const loadingInstance = ElLoading.service({
    target: document.getElementById("recycle-monitor") || document.body,
    text: "数据加载中...",
  });
  try {
    const { data } = await api[query.identity]({
      wjid: route.query?.id,
      djzt: query.state,
      ...query.conditions,
      current: pagination.current,
      size: pagination.size,
    });
    tableData.value = data.records;
    total.value = data.total;
  } finally {
    await nextTick(() => {
      loadingInstance.close();
    });
  }
};

const onSearch = (values: any) => {
  query.conditions = clearEmpty(values);
  loadTable();
};

const onDelete = () => {
  const rows = tableRef.value.getSelectionRows();
  if (rows.length) {
    ElMessageBox.confirm(
      `是否确认删除选中的${rows.length}条答卷信息？`,
      "删除确认",
      {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      }
    ).then(async () => {
      const { message } = await delAnswer({
        djids: rows.map((item: any) => item["djid"]),
      });
      ElMessage.success(message);
      loadTable();
    });
  } else {
    ElMessage.error("请选择至少一条数据！");
  }
};

onMounted(async () => {
  await loadSurvey();
  await loadQuery();
  await loadRecord();
});
</script>

<style lang="less" scoped>
.box {
  box-shadow: rgba(0, 0, 0, 0.16) 0 1px 4px;
  padding: 20px;
}

:deep(.el-table--border th.el-table__cell) {
  background-color: var(--el-color-primary-light-3);
  color: #000000;
}
</style>

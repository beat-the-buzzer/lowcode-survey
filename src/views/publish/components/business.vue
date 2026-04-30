<template>
  <div v-loading="loading">
    <div class="w-full flex items-center justify-between">
      <div class="flex items-center">
        <div class="mr-20px text-16px">分发对象：</div>
        <el-checkbox-group v-model="checkList">
          <el-checkbox
            v-for="item in identities"
            :key="item"
            :label="item"
            border
            @change="handleChecked(item)"
          >
            {{ identityEnum[item] }}
          </el-checkbox>
        </el-checkbox-group>
      </div>
      <el-button type="primary" @click="handleSubmit">分发</el-button>
    </div>
    <el-space fill wrap :size="20" class="w-full mt-30px">
      <el-card v-for="item in editList" :key="item['identity']" shadow="never">
        <template #header>
          <div class="flex items-center">
            <div class="text-16px w-300px">
              <span> {{ item["title"] }}</span>
              （共
              <span style="color: #e60039">{{ item["num"] }}</span>
              位）
            </div>
            <el-checkbox
              v-model="item['required']"
              true-label="1"
              false-label="0"
              size="large"
            >
              必答
            </el-checkbox>
            <el-tooltip
              content="勾选后用户必须完成答卷操作后才能进入下一步，如不勾选则不强制答卷，用户可以关闭问卷页面进行下一步操作。（该控制需要由业务提供支持）"
              placement="top"
            >
              <el-icon class="ml-5px"><InfoFilled /></el-icon>
            </el-tooltip>
          </div>
        </template>
        <div>
          <Query
            :form="queryMap[item['identity']]"
            :formModel="item['query']"
            :identity="item['identity']"
            @search="handleSearch"
          />
        </div>
        <el-divider />
        <div class="flex items-center">
          <div class="w-100px text-right mb-8px">触发条件：</div>
          <el-checkbox-group
            v-model="item['triggers']"
            style="width: calc(100% - 100px)"
          >
            <el-checkbox-button
              v-for="m in triggerMap[item['identity']]"
              :key="m['cfdm']"
              :label="m['cfdm']"
            >
              {{ m["cfmc"] }}
            </el-checkbox-button>
          </el-checkbox-group>
        </div>
      </el-card>
      <outer v-if="checkList.includes('other')" ref="outerRef" />
    </el-space>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from "vue";
import { identityEnum } from "@/enums/commonEnums";
import Query from "@/components/Query";
import { ElMessage, ElMessageBox } from "element-plus";
import { InfoFilled } from "@element-plus/icons-vue";
import {
  getQuery,
  getTriggers,
  getDistributeNums,
  distribute,
  getRecords,
  checkAnswer,
} from "@/api/distribute";
import { useRoute, useRouter } from "vue-router";
import { clearEmpty } from "@/utils/help";
import Outer from "./outer.vue";

const route = useRoute();
const router = useRouter();

const records = ref<any[]>([]);
const identities = ref<string[]>([]);
const checkList = ref<string[]>([]);
const editList = ref<any[]>([]);
const queryMap = ref<any>({});
const triggerMap = ref<any>({});
const loading = ref(false);
const outerRef = ref<any>();

const handleChecked = (key: any) => {
  const checked = checkList.value.findIndex((i) => i === key) > -1;
  if (checked) {
    if (key === "other") {
      checkList.value = ["other"];
      editList.value = [];
    } else {
      const hasOther = checkList.value.findIndex((i) => i === "other") > -1;
      if (hasOther) {
        checkList.value = checkList.value.filter((i) => i !== "other");
      }
      editList.value.push({
        title: identityEnum[key],
        identity: key,
        triggers: [],
        query: {},
        required: "0",
        num: 0,
      });
      sortByOrder(identities.value);
    }
  } else {
    editList.value = editList.value.filter((e) => e["identity"] !== key);
  }
};

const sortByOrder = (order: string[]) => {
  // @ts-ignore
  editList.value.sort((a, b) => {
    const _aIndex: number = order.indexOf(a["identity"]);
    const _bIndex: number = order.indexOf(b["identity"]);
    if (_aIndex > -1 && _bIndex > -1) {
      return _aIndex - _bIndex;
    } else if (_aIndex > -1) {
      return -1;
    } else if (_bIndex > -1) {
      return 1;
    }
  });
};

const validate = () => {
  if (editList.value.length === 0) {
    ElMessage.error(`分发对象不能为空！`);
    return true;
  }
  const validator = editList.value.find(
    (item) => item["triggers"].length === 0
  );
  if (validator) {
    ElMessage.error(
      `分发对象-${validator.title}：触发条件未选择，请完善配置！`
    );
  }
  return !!validator;
};

const handleSubmit = async () => {
  if (checkList.value.includes("other")) {
    outerRef.value.onSubmit();
  } else {
    if (validate()) return;
    const result = editList.value.filter((item) =>
      checkList.value.includes(item["identity"])
    );
    const { data } = await checkAnswer({
      wjid: route.query?.id,
      fftjArr: JSON.stringify(result),
    });
    if (data > 0) {
      ElMessageBox.confirm(
        "存在不在当前分发条件下的用户答卷记录，是否删除？",
        "警告",
        {
          type: "warning",
          distinguishCancelAndClose: true,
          confirmButtonText: "删除",
          cancelButtonText: "保留",
        }
      )
        .then(() => {
          publish(editList.value, "1");
        })
        .catch((action: any) => {
          action === "cancel" && publish("0");
        });
    } else {
      publish(editList.value, "0");
    }
  }
};

const publish = async (content: any, sfsc: string) => {
  const { message } = await distribute({
    wjid: route.query?.id,
    fftjArr: JSON.stringify(content),
    sfsc,
  });
  ElMessage.success(message);
};

const initQuery = async () => {
  const { data } = await getQuery();
  queryMap.value = data;
  identities.value = [...Object.keys(data)];
};

const initTriggers = async () => {
  const { data } = await getTriggers();
  triggerMap.value = data;
};

const handleSearch = (values: any, identity: string) => {
  const _values = clearEmpty(values);
  updateQueryAttr(
    identity,
    "query",
    Object.keys(_values).length > 0 ? _values : []
  );

  queryNums(_values, identity);
};

const queryNums = async (values: any, identity: string) => {
  const { data } = await getDistributeNums({
    identity,
    query: values,
  });
  updateQueryAttr(identity, "num", data);
};

/**
 * 更新对象数组属性
 * @param identity
 * @param key
 * @param value
 */
const updateQueryAttr = (identity: string, key: string, value: any) => {
  const index = editList.value.findIndex(
    (item) => item["identity"] === identity
  );
  if (index > -1) {
    editList.value[index][key] = value;
  }
};

const loadRecord = async () => {
  const { data } = await getRecords({ wjid: route.query?.id });
  if (Array.isArray(data) && data.length > 0) {
    records.value = data;
    const arr = JSON.parse(data[0]["fftj"]);
    checkList.value = arr.map((item: any) => item["identity"]);
    editList.value = arr.filter((item: any) => item["identity"] !== "other");
  }
};

onMounted(async () => {
  try {
    loading.value = true;
    await initQuery();
    await initTriggers();
    await loadRecord();
  } finally {
    loading.value = false;
  }
});
</script>

<style lang="less" scoped>
:deep(.el-card__header) {
  padding: 10px 20px;
}

:deep(.el-checkbox-button) {
  margin-right: 8px;
  margin-bottom: 8px;
}

:deep(.el-checkbox-button__inner) {
  border-radius: var(--el-border-radius-base);
  border: var(--el-border);
}
</style>

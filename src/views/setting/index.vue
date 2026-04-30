<template>
  <div>
    <div v-html="config.title"></div>
    <div class="w-1000px flex mx-auto py-30px">
      <div class="w-200px py-20px">
        <div
          class="nav-item"
          :class="{ active: activeAnchor === item.id }"
          v-for="item in anchorList"
          :key="item.id"
          @click="handleAnchorClick(item.id)"
        >
          {{ item.title }}
        </div>
      </div>
      <div
        class="flex-1 px-40px overflow-y-auto"
        style="max-height: calc(100vh - 100px)"
      >
        <div id="basic-setting">
          <h3 class="set-title">答题设置</h3>
          <div class="setting-item">
            <span>时间控制</span>
            <el-switch v-model="config['timeControl']"></el-switch>
          </div>
          <div class="setting-item" v-if="config['timeControl']">
            <span>开放时间</span>
            <div class="w-400px">
              <el-date-picker
                v-model="config.openTime"
                type="datetimerange"
                range-separator="~"
                value-format="YYYY-MM-DD HH:mm:ss"
              />
            </div>
          </div>
          <div class="setting-item">
            <span>答题倒计时</span>
            <el-switch v-model="config.countdown"></el-switch>
          </div>
          <div class="setting-item" v-if="config.countdown">
            <span>计时时长</span>
            <el-input
              v-model="config.timeLength"
              class="input-with-select"
              style="width: 300px"
            >
              <template #prepend>
                <el-select v-model="config.timeType" style="width: 100px">
                  <el-option label="总时长" value="1" />
                  <!--                  <el-option label="每页时长" value="2" />-->
                  <!--                  <el-option label="每题时长" value="3" />-->
                </el-select>
              </template>
              <template #append>
                <el-select v-model="config.timeUnit" style="width: 100px">
                  <el-option label="分钟" value="1" />
                  <el-option label="小时" value="2" />
                  <el-option label="秒" value="3" />
                </el-select>
              </template>
            </el-input>
          </div>
          <div class="setting-item">
            <span>答题进度条</span>
            <el-radio-group v-model="config.progress">
              <el-radio label="">不显示</el-radio>
              <el-radio label="1">按题目</el-radio>
              <el-radio label="2">按页</el-radio>
            </el-radio-group>
          </div>
          <div class="setting-item">
            <span>答题人</span>
            <el-radio-group
              v-model="config.limitRange"
              @change="onLimitRangeChange"
            >
              <el-radio label="user">仅分发对象</el-radio>
              <el-radio label="login">登录用户</el-radio>
              <el-radio label="open">公开</el-radio>
            </el-radio-group>
          </div>
          <div class="setting-item">
            <span>提交方式</span>
            <el-radio-group v-model="config['submitMethod']">
              <el-radio label="0" v-if="config.limitRange !== 'open'"
                >实名提交</el-radio
              >
              <el-radio label="1">匿名提交</el-radio>
            </el-radio-group>
          </div>
        </div>
        <div id="after-submit">
          <h3 class="set-title">提交后显示</h3>
          <div class="setting-box">
            <div class="flex items-center justify-between">
              <span>触发条件</span>
              <el-radio-group v-model="config.afterSubmit.method">
                <el-radio label="1">有条件触发</el-radio>
                <el-radio label="2">无条件触发</el-radio>
                <el-radio label="">不触发</el-radio>
              </el-radio-group>
            </div>
            <Conditions
              :formList="formData.list"
              :conditionsGroup="config.afterSubmit.conditionsGroup"
              v-if="config.afterSubmit.method === '1'"
            />
          </div>
          <div class="setting-box">
            <div class="flex items-center justify-between">
              <span>执行动作</span>
              <el-checkbox-group v-model="config.afterSubmit.action">
                <el-checkbox label="1"
                  >显示信息（图片、文字或附件下载）</el-checkbox
                >
                <el-checkbox label="2">跳转到指定页面</el-checkbox>
              </el-checkbox-group>
            </div>
            <div v-if="config.afterSubmit.action.includes('1')" class="p-10px">
              <div>显示内容</div>
              <InlineEditor
                v-model:modelValue="config.afterSubmit.content"
                class="border"
              />
            </div>
            <div v-if="config.afterSubmit.action.includes('2')" class="p-10px">
              <div>跳转地址</div>
              <el-input v-model="config.afterSubmit.link" placeholder="请输入">
                <template #prepend>Https://</template>
              </el-input>
            </div>
          </div>
        </div>
        <div class="flex justify-end py-20px">
          <el-button type="primary" @click="handleSubmit">提交</el-button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import { useDesignFormStore } from "@/stores/modules/design";
import Conditions from "./Conditions.vue";
import { getSurvey, updateSurveyConfig, updateSurvey } from "@/api";
import { useRoute, useRouter } from "vue-router";
import { ElMessage } from "element-plus";
import InlineEditor from "@/components/InlineEditor";

const route = useRoute();
const router = useRouter();
const store = useDesignFormStore();

const anchorList = [
  { id: "basic-setting", title: "答题设置" },
  { id: "after-submit", title: "提交后显示" },
];
const activeAnchor = ref("basic-setting");

const formData = ref<any>(store.formData);
const config = ref<any>(store.formData.config);

const handleAnchorClick = (flag: string) => {
  // 锚点跳转
  document.getElementById(`${flag}`)?.scrollIntoView({
    behavior: "smooth",
    block: "center",
    inline: "nearest",
  });
  activeAnchor.value = flag;
};

const onLimitRangeChange = (value: string) => {
  if (value === "open") {
    config.value["submitMethod"] = "1";
  }
};

const handleSubmit = async () => {
  if (
    config.value.timeControl &&
    (!config.value.openTime?.[0] || !config.value.openTime?.[1])
  ) {
    ElMessage.error("请完善开放时间！");
    return;
  }
  if (
    config.value.countdown &&
    !config.value.timeLength &&
    !config.value.timeUnit &&
    !config.value.timeType
  ) {
    ElMessage.error("请完善答题倒计时计时时长！");
    return;
  }
  await updateSurvey({
    wjid: route.query.id,
    wjnr: JSON.stringify(formData.value),
    mode: "remain",
  });
  await updateSurveyConfig({
    wjid: route.query.id,
    sjkz: config.value.timeControl ? "1" : "0",
    dtkssj: config.value.openTime?.[0] || undefined,
    dtjssj: config.value.openTime?.[1] || undefined,
    dtr: config.value.limitRange,
  });
  ElMessage.success("问卷设置已更新");
  router.push({ name: "list" });
};

onMounted(async () => {
  if (route.query?.id) {
    const { data } = await getSurvey(route.query?.id);
    try {
      if (data.wjnr) {
        formData.value = JSON.parse(data.wjnr);
        config.value = formData.value.config;
      }
    } catch (error) {
      ElMessage.error("问卷格式异常，请重新编辑！");
      router.push({ name: "list" });
    }
  }
});
</script>

<style lang="less" scoped>
.setting-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px 0;
  border-bottom: 1px solid #f2f2f2;
}

.setting-box {
  padding: 15px 0;
  border-bottom: 1px solid #f2f2f2;
}
.set-title {
  font-size: 18px;
  font-weight: bold;
  color: #262626;
  line-height: 26px;
  padding: 20px 0;
  border-bottom: 1px solid #f2f2f2;
}
.nav-item {
  font-size: 14px;
  color: #595959;
  cursor: pointer;
  // line-height: 44px;
  padding: 10px;
}

.nav-item.active {
  background-color: deepskyblue;
  color: #fff;
}
</style>

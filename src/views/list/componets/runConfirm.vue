<template>
  <div class="px-20px">
    <div class="setting-item">
      <span>答题人</span>
      <el-radio-group v-model="config.limitRange">
        <el-radio label="user">仅分发对象</el-radio>
        <el-radio label="login">登录用户</el-radio>
        <el-radio label="open">公开</el-radio>
      </el-radio-group>
    </div>
    <div class="setting-item">
      <span>提交方式</span>
      <el-radio-group v-model="config['submitMethod']">
        <el-radio label="0">实名提交</el-radio>
        <el-radio label="1">匿名提交</el-radio>
      </el-radio-group>
    </div>
    <div class="flex justify-end py-20px">
      <el-button type="primary" @click="onSubmit">提交</el-button>
    </div>
  </div>
</template>

<script setup lang="ts">
import {
  getSurvey,
  updateSurveyConfig,
  updateSurvey,
  updateSurveyState,
} from "@/api";
import { onMounted, ref } from "vue";
import { ElMessage } from "element-plus";
import { useRouter } from "vue-router";

const props = withDefaults(
  defineProps<{
    wjid: string;
  }>(),
  {
    wjid: "",
  }
);

const emit = defineEmits(["success"]);

const router = useRouter();
const formData = ref<any>({});
const config = ref<any>({});

const onSubmit = async () => {
  await updateSurvey({
    wjid: props.wjid,
    wjnr: JSON.stringify(formData.value),
    mode: "remain",
  });
  await updateSurveyConfig({
    wjid: props.wjid,
    sjkz: config.value.timeControl ? "1" : "0",
    dtkssj: config.value.openTime?.[0] || undefined,
    dtjssj: config.value.openTime?.[1] || undefined,
    dtr: config.value.limitRange,
  });
  await updateSurveyState({ wjid: props.wjid, wjzt: "1" });
  ElMessage.success("问卷启用成功");
  emit("success");
};

onMounted(async () => {
  const { data } = await getSurvey(props.wjid);
  try {
    if (data.wjnr) {
      formData.value = JSON.parse(data.wjnr);
      config.value = formData.value.config;

      console.log(config.value);
    }
  } catch (error) {
    ElMessage.error("问卷格式异常，请重新编辑！");
    router.push({ name: "list" });
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
</style>

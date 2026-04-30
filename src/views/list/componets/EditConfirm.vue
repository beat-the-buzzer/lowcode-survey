<template>
  <div>
    <div>
      此问卷已存在
      <span class="text-red-600 text-lg">{{ num }}份有效答卷</span>
      ，请选择问卷修改模式。
    </div>
    <div class="flex justify-around m-20px">
      <div
        class="checkbox"
        :class="{
          active: activeKey === 'remain',
        }"
        @click="activeKey = 'remain'"
      >
        <span class="title">保留答卷</span>
        <span>修改受限制</span>
      </div>
      <div
        class="checkbox"
        :class="{
          active: activeKey === 'remove',
        }"
        @click="activeKey = 'remove'"
      >
        <span class="title">删除所有答卷</span>
        <span>修改不受限制</span>
      </div>
    </div>
    <div>
      <!--      保留答卷：只能修改问卷的细节，如错别字、添加选项等。不能删除题目或选项、移动题目或选项。-->
    </div>
    <div class="mt-20px flex justify-center">
      <el-button size="large" type="primary" @click="handleConfirm"
        >下一步</el-button
      >
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import { ElMessage } from "element-plus";
import { getSurvey } from "@/api";

const props = defineProps({
  wjid: {
    type: String,
    default: "",
  },
});

const router = useRouter();
const num = ref(0);
const activeKey = ref("");

const handleConfirm = () => {
  if (activeKey.value) {
    let routerData = router.resolve({
      name: "design",
      query: { id: props.wjid, mode: activeKey.value },
    });
    window.location.assign(routerData.href);
  } else {
    ElMessage.error("请选择问卷修改模式！");
  }
};

onMounted(async () => {
  const { data } = await getSurvey(props.wjid);
  num.value = data.djsl;
});
</script>

<style lang="less" scoped>
.checkbox {
  border: 1px solid;
  width: 200px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 20px;
  color: #000;
  cursor: pointer;
}
.checkbox.active {
  border: 1px solid #409eff;
  background-color: #409eff;
  color: #fff;
}
.title {
  font-size: 16px;
  font-weight: bold;
  line-height: 36px;
}
.help {
  color: #999999;
}
</style>

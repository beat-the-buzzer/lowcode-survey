<template>
  <div class="check-container">
    <div class="header">答题人信息核对</div>
    <el-divider />
    <div class="w-500px my-50px">
      <el-form :model="formModel" label-position="top" ref="formRef">
        <el-form-item
          v-for="item in fields"
          :key="item"
          :label="`${item}：`"
          :prop="item"
          :rules="{
            required: true,
            message: '请输入',
            trigger: 'blur',
          }"
        >
          <el-input v-model="formModel[item]" />
        </el-form-item>
      </el-form>
    </div>
    <el-divider />
    <el-button type="primary" @click="onSubmit">开始答题</el-button>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import { getOuterFields } from "@/api/distribute";
import { checkOuter } from "@/api/user";
import { ElMessage } from "element-plus";

const route = useRoute();
const router = useRouter();

const formRef = ref<any>();
const formModel = ref<any>({});
const fields = ref<string[]>([]);

const getFormFields = async () => {
  const { data } = await getOuterFields({ wjid: route.query?.id });
  fields.value = data.metakey?.split(",") ?? [];
};

const onSubmit = async () => {
  await formRef.value.validate(async (valid) => {
    if (valid) {
      let result: string[] = [];
      fields.value.map((f) => result.push(formModel.value[f]));
      const { message, data } = await checkOuter({
        wjid: route.query?.id,
        metavalueArr: result,
      });
      ElMessage.success(message);
      router.push({ name: "detail", query: { ...route.query, user: data } });
    }
  });
};

onMounted(() => {
  getFormFields();
});
</script>

<style lang="less" scoped>
.check-container {
  width: 1280px;
  margin: 0 auto;
  padding: 50px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}
.header {
  font-size: 20px;
}
</style>

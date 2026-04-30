<template>
  <div class="w-full">
    <div class="w-full flex">
      <div class="flex-1" v-loading="loading">
        <el-input
          class="options-input"
          v-model="textarea"
          :autosize="{ minRows: 20, maxRows: 20 }"
          type="textarea"
          :placeholder="placeholderText"
        />
      </div>
      <div class="w-250px px-20px">
        <h3 class="bold text-lg">预定义选项</h3>
        <div>
          <el-tag
            class="m-2 cursor-pointer"
            type="info"
            v-for="item in tags"
            :key="item.label"
            @click="handleClick(item)"
            >{{ `${item.desc}` }}</el-tag
          >
        </div>
      </div>
    </div>
    <div class="flex justify-end">
      <el-button @click="handleCancel">取消</el-button>
      <el-button type="primary" @click="handleSubmit">确定</el-button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from "vue";
import { ElMessageBox } from "element-plus";
import { getOptionTags, getOptions } from "@/api";

const props = withDefaults(
  defineProps<{
    options?: any;
  }>(),
  {
    options: "",
  }
);

const loading = ref(false);

const emit = defineEmits(["setOptions", "cancel"]);

const placeholderText = `请输入级联数据，各级之间用/分割，每条数据独占一行，格式如下：
浙江省/杭州市/西湖区/蒋村街道
浙江省/杭州市/西湖区/西湖街道
`;

const textarea = ref(props.options);
const tags = ref([]);

const handleClick = (item: any) => {
  if (textarea.value?.trim()) {
    ElMessageBox.confirm(
      `是否确定加载【${item.desc}】数据，当前数据将被清除?`,
      "警告",
      {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      }
    ).then(() => {
      loadInnerData(item);
    });
  } else {
    loadInnerData(item);
  }
};

const loadInnerData = async (item: any) => {
  loading.value = true;
  const { data } = await getOptions(item.label);
  textarea.value = data;
  loading.value = false;
};

const handleCancel = () => {
  emit("cancel");
};

const handleSubmit = () => {
  emit("setOptions", textarea.value);
};

onMounted(() => {
  getOptionTags("cascader").then(({ data }) => {
    tags.value = data;
  });
});
</script>
<style lang="less" scoped>
.options-input {
  :deep(textarea::-webkit-scrollbar) {
    width: 10px;
  }
  :deep(textarea::-webkit-scrollbar-thumb) {
    cursor: pointer;
  }
}
</style>

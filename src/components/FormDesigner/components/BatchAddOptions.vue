<template>
  <div class="w-full">
    <div class="w-full flex">
      <div class="flex-1">
        <el-input
          v-model="textarea"
          :autosize="{ minRows: 20, maxRows: 20 }"
          type="textarea"
          :placeholder="placeholderText"
        />
      </div>
      <div class="w-250px px-20px">
        <h3 class="bold text-lg">预定义选项</h3>
        <div>
          <!--          <el-tag-->
          <!--            class="m-2 cursor-pointer"-->
          <!--            type="info"-->
          <!--            v-for="item in 15"-->
          <!--            :key="item"-->
          <!--            >{{ `预设${item}` }}</el-tag-->
          <!--          >-->
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
import { ref, computed } from "vue";
import { ElMessage } from "element-plus";

const props = withDefaults(
  defineProps<{
    type: string;
    options: any;
  }>(),
  {
    type: "select",
    options: [],
  }
);

const emit = defineEmits(["setOptions", "cancel"]);

const placeholderText = computed(() => {
  return props.type === "cascader"
    ? "最多支持四级，各级间使用“/”进行分隔。各级标题按相同格式放在第一行。"
    : "请输入选项，一行代表一个选项";
});

const textarea = ref(props.options.map((item) => item.title).join("\n"));
const tags = ref([]);

const handleCancel = () => {
  emit("cancel");
};

const handleSubmit = () => {
  console.log(textarea.value);
  const _value = textarea.value.split("\n");
  // if (_value.length > 50) {
  //   ElMessage.error(
  //     `当前存在${_value.length}个选项，系统限制最多50个选项，请重新输入！`
  //   );
  //   return;
  // }
  emit("setOptions", _value);
};
</script>
<style lang="less" scoped></style>

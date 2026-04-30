<template>
  <div class="main-tools">
    <el-button
      link
      type="primary"
      @click="btnClick(item.icon)"
      v-for="item in btnList"
      :key="item.icon"
    >
      <i :class="['iconfont icon-' + item.icon]"></i>{{ item.label }}
    </el-button>
  </div>
</template>

<script lang="ts" setup>
import { reactive, computed } from "vue";
import { useRoute } from "vue-router";
const props = withDefaults(
  defineProps<{
    type?: string;
  }>(),
  {
    type: "1", // // 1表单设计，2表格设计，3搜索设计
  }
);
const emits = defineEmits<{
  (e: "click", value: string): void;
}>();
const route = useRoute();

const state = reactive({
  list: [
    { icon: "refresh", label: "重置" },
    { icon: "preview", label: "预览", disabled: props.type === "2" },
    // { icon: "json", label: "JSON" },
    { icon: "save", label: "保存" },
  ],
});

const btnList = computed(() => {
  return state.list.filter((item: any) => {
    return !item.disabled;
  });
});
const btnClick = (type: string) => {
  emits("click", type);
};
</script>
<style lang="less" scoped>
.main-tools {
  line-height: 2.375rem;
  /* border-bottom: 2px solid #e4e7ed; */
  text-align: right;
}
.main-tools button {
  color: #66b1ff;
}
.main-tools button i {
  padding-right: 3px;
}
:deep(.el-button + .el-button) {
  margin-left: 5px;
}
</style>

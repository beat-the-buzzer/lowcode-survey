<template>
  <div class="p-10px">
    <div class="outline-header">问卷大纲</div>
    <el-tree
      :data="outLine"
      default-expand-all
      @node-click="handleNodeClick"
      highlight-current
    >
      <template #default="{ node }">
        <tree-line :node="node" showLabelLine>
          <template #node-label>
            <span class="outline-title"> {{ node.label }}</span>
          </template>
        </tree-line>
      </template>
    </el-tree>
  </div>
</template>
<script lang="ts" setup>
import { computed, ref, watch, h } from "vue";
import { getElementLabelLine } from "@/components/TreeLine";
import { rexFilter } from "@/utils/transform";

const emit = defineEmits(["clickOutline"]);

const TreeLine = getElementLabelLine(h);

const props = defineProps({
  formData: { type: Object, default: () => {} },
});

const outLine = ref<any[]>([]);

watch(
  () => props.formData,
  (value) => {
    let tree: any[] = [];
    value?.list
      ?.filter((item: any) => !["pagination", "paragraph"].includes(item.type))
      .map((item: any, index: number) => {
        tree.push({
          label: `${index + 1}、${rexFilter(item.title)}`,
          index: index,
          id: item.id,
        });
      });
    outLine.value = tree;
  },
  {
    deep: true,
    immediate: true,
  }
);

const handleNodeClick = (node: any) => {
  // 锚点跳转
  document.querySelector(`.question-${node.id}`)?.scrollIntoView({
    behavior: "smooth",
    block: "center",
    inline: "nearest",
  });
};
</script>
<style lang="less" scoped>
:deep(.el-tree-node__content) {
  height: auto;
  padding: 5px;
}

//:deep(.el-tree--highlight-current
//    .el-tree-node.is-current
//    > .el-tree-node__content) {
//  background: #409eff;
//  color: #ffffff;
//}
.outline-header {
  font-size: 16px;
  font-weight: bold;
  text-align: center;
  border-bottom: 1px solid #d3d3d3;
  margin-bottom: 10px;
  line-height: 32px;
}
.outline-title {
  word-break: break-all;
  width: auto;
  display: block;
  white-space: pre-wrap;
  overflow: hidden;
}
</style>

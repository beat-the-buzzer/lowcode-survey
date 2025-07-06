<template>
  <div class="components-list">
    <!--左侧拖动内容-->
    <div v-for="(list, index) in controlList" :key="index">
      <div class="title">
        {{ list.title }}
      </div>
      <draggable itemKey="key123" tag="ul" v-model="list.children" :group="{ name: 'form', pull: 'clone', put: false }"
        ghost-class="ghost" :sort="false" :clone="clone" :distance="1" :move="handleMove">
        <template #item="{ element }">
          <li :class="[element.type]" @click="handleControlClick(element)">
            <i :class="`iconfont icon-${element.icon}`" style="font-size: 18px"></i>
            <span class="ml-5px" :title="element.title">{{
              element.title
            }}</span>
          </li>
        </template>
      </draggable>
    </div>
  </div>
</template>
<script lang="ts" setup>
import controlListData from "./controlList";
import draggable from "vuedraggable-es";
import { computed, ref, watch, h, reactive } from "vue";
import { questionAddOptions } from "./formUtils";

const emit = defineEmits(["clickControl"]);

const props = defineProps({
  formData: { type: Object, default: () => { } },
});

const controlList = computed(() => {
  return controlListData;
});
const clone = (origin: any) => {
  const obj = JSON.parse(JSON.stringify(origin));
  return questionAddOptions(obj);
};

const handleControlClick = (element: any) => {
  const obj = JSON.parse(JSON.stringify(element));
  emit("clickControl", questionAddOptions(obj));
};


const handleMove = (e: any) => {
  if (
    e.relatedContext.element?.type === "pagination" &&
    e.relatedContext.index === 0
  ) {
    return false;
  }
};
</script>
<style scoped>
:deep(.el-tree-node__content) {
  height: auto;
  padding: 5px;
}

</style>

<template>
  <div class="common-layout">
    <el-container>
      <el-header class="header">问卷编辑页</el-header>
      <el-main style="display: flex;">
        <div style="width: 25%;">
          <!--左侧的拖动区域-->
          <DragControl :form-data="formData" @clickControl="handleAddControl"></DragControl>
        </div>

        <div style="width: 50%;">
          <!--中间的问卷主体-->
          <MainSurvey :form-data="formData"></MainSurvey>
        </div>


        <!--右侧的问题编辑-->
      </el-main>
    </el-container>
  </div>
</template>

<script lang="ts" setup>
import { computed, nextTick, onMounted, onUnmounted, reactive } from 'vue';
import DragControl from './components/DragControl.vue';
import MainSurvey from './components/MainSurvey.vue';
import { questionSortIndex } from './components/formUtils';
import { useDesignFormStore } from '@/stores/modules/design';

const store = useDesignFormStore();
const formData: any = computed(() => {
  return store.formData;
});

const handleAddControl = (item: any) => {
  console.log('执行了formData添加的事件')
  const currentItem = store.activeItem;
  const index = formData.value.list.findIndex((q) => q.id === currentItem.id);
  // 如果当前没有选中的数据，就直接放到最后面，如果有选中的数据，就放到选中的数据后面
  if (index === -1) {
    formData.value.list.push(item);
  } else {
    formData.value.list.splice(index + 1, 0, item);
  }
  const sortIndex = questionSortIndex(formData.value.list, item);
  store.setActiveItem({
    ...item,
    name: `Q${sortIndex}问题设置`,
  });
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.header {
  background-color: #409EFF;
  color: #fff;
  line-height: var(--el-header-height);
}
</style>
  
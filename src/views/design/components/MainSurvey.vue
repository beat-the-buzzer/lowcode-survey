<template>
  <div class="main-body" @click="handleBodyClick">
    <div class="survey-container" id="survey-container">
      <div class="survey-body">
        <!-- 问卷标题 -->
        <div class="survey-title" v-html="formData.config.title"></div>
        <!-- 问卷设计 -->
        <div class="main-form" v-loading="state.loading">
          <div class="empty-tips" v-if="formData.list.length === 0">
            <el-empty description="从左侧拖拽组件进行问卷设计" />
          </div>
          <div class="design-form">
            <form-group :data="formData.list" :config="formData.config" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script lang="ts" setup>
import controlListData from "./controlList";
import draggable from "vuedraggable-es";
import FormGroup from "./formGroup.vue";
import { computed, ref, watch, h, reactive } from "vue";
import { questionAddOptions } from "./formUtils";
import { useDesignFormStore } from "@/stores/modules/design";

const store = useDesignFormStore();

const props = defineProps({
  formData: { type: Object, default: () => { } },
});

// 页面状态数据
const state = reactive({
  visibleDialog: false,
  dialogType: "",
  dialogTitle: "",
  codeType: "",
  editor: {} as any,
  loading: false,
  formDataPreview: {} as any,
  previewVisible: false, // 预览窗口
});

const handleBodyClick = () => {
  store.setActiveItem({});
};

</script>
<style scoped></style>

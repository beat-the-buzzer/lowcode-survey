<template>
  <div class="design-container">
    <!-- 左侧组件栏/大纲 -->
    <el-affix :offset="100">
      <form-control
        :form-data="formData"
        @clickControl="handleAddControl"
        @click-outline="handleOutlineClick"
      />
    </el-affix>
    <div
      class="main-body"
      @click="handleBodyClick"
      :style="{
        background: `url(${formData.config.bgUrl})`,
        backgroundRepeat: 'no-repeat',
        backgroundSize: 'cover',
        backgroundAttachment: 'fixed',
      }"
    >
      <div class="survey-container" id="survey-container">
        <!--        <el-backtop-->
        <!--          target=".main-body .el-scrollbar__wrap"-->
        <!--          :visibility-height="50"-->
        <!--        />-->

        <div class="survey-body">
          <!-- 问卷标题 -->
          <div
            class="survey-title"
            v-html="formData.config.title"
            v-if="false"
          ></div>

          <!-- 问卷简介 -->
          <!-- <InlineEditor v-model:modelValue="formData.config.desc" /> -->
          <!-- 问卷设计 -->
          <div class="main-form" v-loading="state.loading">
            <div class="empty-tips" v-if="formData.list.length === 0">
              <el-empty description="从左侧拖拽组件进行问卷设计" />
            </div>
            <form-design :type="4" :formData="formData" />
          </div>
          <!-- 问卷底部 -->
          <InlineEditor v-model:modelValue="formData.config.suffix" />
          <!-- 提交按钮 -->
          <!-- <div class="flex justify-center">
          <InlineEditor
            id="surveySubmitButton"
            :model-value="state.surveySubmitButton"
          />
        </div> -->
        </div>
      </div>
    </div>
    <el-affix :offset="100">
      <head-tools @click="headToolClick" />
      <!-- 右侧属性栏 -->
      <form-control-attr
        v-model:formData="formData.list"
        v-model:formConfig="formData.config"
      />
    </el-affix>
    <!-- json -->
    <el-drawer
      v-model="state.visibleDialog"
      size="60%"
      :title="state.dialogTitle"
      direction="rtl"
      custom-class="ace-dialog"
      :append-to-body="true"
      :before-close="drawerBeforeClose"
    >
      <template #header>
        <div v-html="state.dialogTitle"></div>
      </template>
      <div v-if="state.visibleDialog" id="editJson"></div>
      <div class="dialog-footer">
        <el-button type="primary" size="small" @click="dialogConfirm">
          确定
        </el-button>
      </div>
    </el-drawer>
    <!-- 预览 -->
    <el-dialog
      v-model="state.previewVisible"
      title="预览"
      fullscreen
      class="survey-preview-dialog"
    >
      <Preview
        v-if="state.previewVisible"
        :preview-data="state.formDataPreview"
      />
    </el-dialog>
  </div>
</template>
<script setup lang="ts">
import HeadTools from "./components/headTools.vue";
import FormControl from "./components/dragControl.vue";
import FormDesign from "./components/form.vue";
import FormControlAttr from "./components/formControlAttr.vue";
import { computed, nextTick, onMounted, onUnmounted, reactive } from "vue";
import { useDesignFormStore } from "@/stores/modules/design";
import { ElMessage, ElLoading, ElMessageBox } from "element-plus";
import { useRoute, useRouter } from "vue-router";
import { aceEdit } from "./components/utils";
import {
  json2string,
  objToStringify,
  string2json,
  stringToObj,
} from "@/utils/form";
import Preview from "@/components/Preview/index.vue";
import {
  handleAddPagination,
  forcePagination,
  questionSortIndex,
} from "./components/formUtils";
import { getSurveyDetail, saveSurvey } from "@/api";
import { rexFilter } from "@/utils/transform";
import { emptySurvey } from "@/const/survey";
import { useIntervalFn } from "@vueuse/core";
import InlineEditor from "@/components/InlineEditor";

const store = useDesignFormStore();

const router = useRouter();
const route = useRoute();

let intervalId: any = null;

const formData: any = computed(() => {
  return store.formData;
});

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

const headToolClick = async (type: string) => {
  state.dialogType = ""; // 清空下防意外
  const _title = rexFilter(formData.value.config.title);
  switch (type) {
    case "refresh":
      ElMessageBox.confirm(
        "是否确认重置问卷，当前页面编辑的问卷题目将会被清空",
        "警告",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        }
      ).then(async () => {
        formData.value.list = [];
        store.setActiveItem({});
      });

      break;
    case "preview":
      // 打开预览窗口
      store.setActiveItem({});
      state.formDataPreview = JSON.parse(JSON.stringify(formData.value));
      state.previewVisible = true;
      break;
    case "json":
      // 生成脚本预览
      dialogOpen(formData.value, "", {
        title: "可编辑修改或将已生成的脚本粘贴进来",
      });
      break;
    case "save":
      if (!_title) {
        ElMessage.error("请完善问卷名称！");
        return;
      }
      console.log("json", formData.value);

      // await saveSurvey({
      //   wjmbb_id: route.query.wjmbb_id,
      //   mb_json_str: JSON.stringify(formData.value),
      // });
      ElMessage.success("问卷保存成功！");
      break;
  }
};
// 弹窗确认
const dialogConfirm = () => {
  // 生成脚本预览和导入json，都是将编辑器内容更新至state.formData
  try {
    const editVal = state.editor.getValue();
    if (typeof state.dialogType === "function") {
      // callback
      state.dialogType =
        state.codeType === "json" ? string2json(editVal) : stringToObj(editVal);
    } else {
      formData.value = stringToObj(editVal);
    }
    state.visibleDialog = false;
  } catch (err) {
    console.log(err);
  }
};

const dialogOpen = (obj: any, type?: any, params?: any) => {
  // 编辑属性和校验规则时从左边弹出
  state.dialogType = type; // 暂存,在窗口关闭时作为条件判断，类型为字符串或callback
  state.codeType = params?.codeType || "";
  state.dialogTitle = params?.title ? `提示：${params?.title}` : "";
  state.visibleDialog = true;
  let editData =
    state.codeType === "json"
      ? json2string(obj, true)
      : objToStringify(obj, true);

  nextTick(() => {
    state.editor = aceEdit(editData, "", state.codeType);
  });
};
const drawerBeforeClose = (done: () => void) => {
  dialogCancel();
  done();
};
const dialogCancel = () => {
  state.visibleDialog = false;
  state.dialogType = "";
};

onUnmounted(() => {
  console.log("===============");
  if (Object.keys(state.editor).length !== 0) {
    state.editor.destroy();
    state.editor.container.remove();
  }
  clearInterval(intervalId);
});
// 左侧栏点击添加组件
const handleAddControl = (item: any) => {
  const currentItem = store.activeItem;
  const index = formData.value.list.findIndex((q) => q.id === currentItem.id);
  if (index === -1) {
    formData.value.list.push(item);
  } else {
    formData.value.list.splice(index + 1, 0, item);
  }
  // const obj = questionAddOptions(item);
  if (item.type === "pagination") {
    handleAddPagination(formData.value.list);
  } else {
    if (formData.value.config?.forcePagination) {
      formData.value.list = forcePagination(formData.value.list);
    }
    const sortIndex = questionSortIndex(formData.value.list, item);
    store.setActiveItem({
      ...item,
      name: `Q${sortIndex}问题设置`,
    });
  }
};

const handleBodyClick = () => {
  store.setActiveItem({});
};

const handleOutlineClick = (index: number) => {
  const obj = formData.value.list[index];
  store.setActiveItem({
    ...obj,
    name: `Q${index + 1}问题设置`,
  });
};

const getImg = (type: string, name: string) => {
  return new URL(`../../assets/${type}/${name}.png`, import.meta.url).href;
};

const autoSave = async () => {
  return;
};

const { pause, resume } = useIntervalFn(autoSave, 3 * 60 * 1000, {
  immediate: false,
  immediateCallback: false,
});

onMounted(async () => {
  if (route.query?.wjmbb_id) {
    const loadingInstance = ElLoading.service({
      lock: true,
      text: "数据加载中...",
      background: "rgba(0, 0, 0, 0.3)",
    });
    let _survey: any;
    // console.log('测试')
    try {
      // TODO 调用接口获取保存的问卷信息
      // const { data } = await getSurveyDetail({
      //   wjmbb_id: route.query?.wjmbb_id,
      // });
      const data = {}
      // formData.value.list = data.mb_json_str ? JSON.parse(data.mb_json_str) : [] ;
      if (data.mb_json_str) {
        _survey = JSON.parse(data.mb_json_str);
        _survey.config.title = data.mbmc;
      } else {
        _survey = emptySurvey(data.mbmc);
      }
      _survey && store.setFormData(_survey);
      resume();
    } catch (error) {
      ElMessage.error("问卷格式异常，请联系管理员查看！");
      _survey = null;
    } finally {
      await nextTick(() => {
        loadingInstance.close();
      });
    }
  }
});
</script>
<style lang="less" scoped>
.survey-body {
  margin: 20px auto 10px;
  width: 794px;
  background-color: #fff;
}
.survey-container {
  min-height: calc(100vh - 90px);
  box-shadow: rgba(0, 0, 0, 0.1) 0 4px 12px;
  padding: 20px 0;
}

.survey-title {
  padding: 0 10px;
  text-align: center;
  font-size: 32px;
  font-weight: bold;
  .survey-title-text {
    padding: 6px 10px;
    border: 1px dashed transparent;
    line-height: 30px;
    margin: 0;
    font-size: 20px;
  }
  .survey-title-text:hover {
    border: 1px dashed #7b7b7b;
  }
  [contenteditable]:focus {
    outline: none;
    background-color: #f4f4f4;
    border: 1px solid #f4f4f4;
  }
}

.page-header {
  width: 100%;
  height: 200px;
  object-fit: fill;
}
</style>

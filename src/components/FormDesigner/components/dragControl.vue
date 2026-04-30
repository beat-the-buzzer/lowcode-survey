<template>
  <div class="components-list">
    <el-tabs v-model="activeTab" stretch @tab-click="handleTabsClick">
      <el-tab-pane label="题型" name="1">
        <div v-for="(list, index) in controlList" :key="index">
          <div class="title">
            {{ list.title }}
          </div>
          <draggable
            itemKey="key123"
            tag="ul"
            v-model="list.children"
            :group="{ name: 'form', pull: 'clone', put: false }"
            ghost-class="ghost"
            :sort="false"
            :clone="clone"
            :distance="1"
            :move="handleMove"
          >
            <template #item="{ element }">
              <li :class="[element.type]" @click="handleControlClick(element)">
                <i
                  :class="`iconfont icon-${element.icon}`"
                  style="font-size: 18px"
                ></i>
                <span class="ml-5px" :title="element.title">{{
                  element.title
                }}</span>
              </li>
            </template>
          </draggable>
        </div>
      </el-tab-pane>
      <el-tab-pane label="大纲" name="2">
        <div class="h-80vh overflow-y-auto">
          <el-tree
            :data="outLine"
            default-expand-all
            @node-click="handleNodeClick"
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
      </el-tab-pane>
      <!-- <el-tab-pane label="基础信息" name="3">
        <div style="padding: 20px;">
          <el-form
            ref="infoFormRef"
            :model="infoForm"
            :rules="infoFormRules"
            label-width="100px"
            class="info-ruleForm"
            size="small"
            status-icon
          >
            <el-form-item label="模板名称" prop="name">
              <el-input v-model="infoForm.name" />
            </el-form-item>
            <el-form-item label="评价类型" prop="type">
              <el-select v-model="infoForm.type" placeholder="请选择">
                <el-option label="学评教" value="xpj"></el-option>
                <el-option label="教评教" value="jpj"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="参评对象" prop="user">
              <el-select v-model="infoForm.user" placeholder="请选择" disabled>
                <el-option label="学生" value="xs"></el-option>
                <el-option label="教师" value="js"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="反向总分上限" prop="fxzfsx">
              <el-input v-model="infoForm.fxzfsx" />
            </el-form-item>
            <el-form-item label="启用状态" prop="qyzt">
              <el-select v-model="infoForm.qyzt" placeholder="请选择">
                <el-option label="启用" :value="1"></el-option>
                <el-option label="停用" :value="0"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="开启评语" prop="kqpy">
              <el-select v-model="infoForm.kqpy" placeholder="请选择">
                <el-option label="开启" :value="1"></el-option>
                <el-option label="关闭" :value="0"></el-option>
              </el-select>
            </el-form-item>
          </el-form>  
        </div>
      </el-tab-pane> -->
    </el-tabs>
  </div>
</template>
<script lang="ts" setup>
import controlListData from "./controlList";
import Draggable from "vuedraggable-es";
import { computed, ref, watch, h, reactive } from "vue";
import type { TabsPaneContext, FormInstance, FormRules } from "element-plus";
import { getElementLabelLine } from "@/components/TreeLine";
import { rexFilter } from "@/utils/transform";
import { questionAddOptions } from "./formUtils";

const emit = defineEmits(["clickControl", "clickOutline"]);

const TreeLine = getElementLabelLine(h);

const props = defineProps({
  formData: { type: Object, default: () => {} },
});

const activeTab = ref("1");

const outLine = ref<any[]>([]);

const infoFormRef = ref<FormInstance>()
const infoForm = ref<any>({
  name: '',
  type: 'xpj',
  user: 'xs',
  fxzfsx: 0,
  qyzt: 1,
  kqpy: 1,
})


const checkFxzfsx = (rule: any, value: any, callback: any) => {
  setTimeout(() => {
    if (isNaN(value)) {
      callback(new Error('只能输入数值'))
    } else {
      if (value < 0) {
        callback(new Error('反向总分上限不能小于0'))
      } else if (value > 100) {
        callback(new Error('反向总分上限不能大于100'))
      } else {
        callback()
      }
    }
  }, 1000)
}

const infoFormRules = reactive<FormRules>({
  name: [
    { required: true, message: '请输入模板名称', trigger: 'blur' },
  ],
  type: [
    { required: true, message: '请选择评教类型', trigger: 'blur' },
  ],
  user: [
    { required: true, message: '请选择参评对象', trigger: 'blur' },
  ],
  fxzfsx: [
    // { type: 'number', message: '只能填入数值' },
    { validator: checkFxzfsx, trigger: 'blur' }
  ],
  qyzt: [
    { required: true, message: '请选择启用状态', trigger: 'blur' },
  ],
  kqpy: [
    { required: true, message: '请选择开启评语', trigger: 'blur' },
  ],
})

watch(
  () => props.formData,
  (value) => {
    let tree: any[] = [];
    value.list
      .filter((item: any) => !["pagination", "paragraph"].includes(item.type))
      .map((item: any, index: number) => {
        const real_index = value.list.findIndex((e) => e.id === item.id);
        tree.push({
          id: item.id,
          label: `${index + 1}、${rexFilter(item.title)}`,
          index: real_index,
        });
      });
    outLine.value = tree;
    // console.log(22222222222)
    // console.log(value)
  },
  {
    deep: true,
    immediate: true,
  }
);

watch(
  () => infoForm.value.type,
  (value) => {
    if (value === 'xpj') {
      infoForm.value.user = 'xs'
    } else if (value === 'jpj') {
      infoForm.value.user = 'js'
    }
  },
  {
    deep: true,
    immediate: true,
  }
);

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

const handleTabsClick = (tab: TabsPaneContext, event: Event) => {
  console.log(tab, event);
};

const handleNodeClick = (node: any) => {
  // 锚点跳转
  document.querySelector(`.question-${node.id}`)?.scrollIntoView({
    behavior: "smooth",
    block: "center",
    inline: "nearest",
  });
  emit("clickOutline", node.index);
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
<style lang="less" scoped>
:deep(.el-tree-node__content) {
  height: auto;
  padding: 5px;
}
.outline-title {
  word-break: break-all;
  width: auto;
  display: block;
  white-space: pre-wrap;
  overflow: hidden;
}
</style>

<template>
  <div>
    <div class="flex items-center">
      <div class="mr-20px">分发对象：</div>
      <el-checkbox-group v-model="checkList">
        <el-checkbox
          v-for="item in identity_list"
          :key="item.value"
          :label="item.value"
          border
          @change="handleChecked(item)"
        >
          {{ item.label }}
        </el-checkbox>
      </el-checkbox-group>
    </div>
    <el-space direction="vertical" fill wrap :size="20" class="w-full mt-30px">
      <div v-for="item in editList" :key="item.title" class="identity-card">
        <el-alert
          :title="`身份：${item.title}`"
          type="info"
          :closable="false"
        />
        <div class="p-20px">
          <div class="flex items-center">
            <span class="setting-label"> 用户组：</span>
            <el-tree-select
              style="width: 800px"
              v-model="item.userGroup"
              :data="userGroups"
              multiple
              :render-after-expand="false"
              show-checkbox
              check-strictly
              check-on-click-node
              node-key="id"
              :props="{
                label: 'name',
                children: 'child',
              }"
            />
          </div>
          <div class="mt-20px flex items-center">
            <span class="setting-label"> 触发条件：</span>
            <el-checkbox-group v-model="item.triggers">
              <el-checkbox-button
                v-for="m in triggerMethods"
                :key="m.value"
                :label="m.value"
                >{{ m.label }}</el-checkbox-button
              >
            </el-checkbox-group>
          </div>
          <div class="mt-20px flex items-center">
            <span class="setting-label"> 是否必答：</span>
            <el-radio-group v-model="item.required">
              <el-radio-button label="0">否</el-radio-button>
              <el-radio-button label="1">是</el-radio-button>
            </el-radio-group>
          </div>
        </div>
      </div>
    </el-space>
    <div class="text-center mt-20px">
      <el-button v-if="editList.length" type="primary" @click="handleSubmit"
        >保存</el-button
      >
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { identity_list, triggerMethods, userGroups } from "./const";
import { ElMessage } from "element-plus";

const checkList = ref<string[]>([]);

const editList = ref<any[]>([]);

const handleChecked = (item) => {
  const checked = checkList.value.findIndex((i) => i === item.value) > -1;
  if (checked) {
    editList.value.push({
      title: item.label,
      identity: item.value,
      triggers: [],
      userGroup: [],
      required: "0",
    });
    sortByOrder(identity_list.map((r) => r.value));
  } else {
    editList.value = editList.value.filter((e) => e.identity !== item.value);
  }
};

const sortByOrder = (order) => {
  editList.value.sort((a, b) => {
    const _aIndex: number = order.indexOf(a.identity);
    const _bIndex: number = order.indexOf(b.identity);
    if (_aIndex > -1 && _bIndex > -1) {
      return _aIndex - _bIndex;
    } else if (_aIndex > -1) {
      return -1;
    } else if (_bIndex > -1) {
      return 1;
    }
  });
};

const handleSubmit = () => {
  const validator = editList.value.find(
    (item) => item.userGroup.length === 0 || item.triggers.length === 0
  );
  if (validator) {
    ElMessage.error(`分发对象-${validator.title}：配置项未完善，请完善配置！`);
    return;
  }
};
</script>

<style lang="less" scoped>
.identity-card {
  padding: 20px;
  border: 1px solid #d3d3d3;

  .setting-label {
    display: inline-block;
    text-align: right;
    width: 100px;
  }
}
</style>

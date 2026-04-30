<!-- eslint-disable vue/no-mutating-props -->
<template>
  <div class="score-config">
    <div class="current-title">
      当前题目：
      <div class="curr-ques" v-html="props.config.title"></div>
    </div>
    <div class="content mb-10px">
      <div>
        <label>选择正确答案</label>
        <span class="yellow ml-10px">勾选表示是正确答案</span>
      </div>
      <el-row :gutter="10">
        <el-col :span="18"><div class="thead-h">选项</div></el-col>
        <el-col :span="6" v-if="config.attribute.sxdfgz === '1'">
          <div class="thead-h">少选得分</div>
        </el-col>
      </el-row>
      <el-checkbox-group
        v-model="checked"
        v-if="config.type === 'mult_choice'"
        class="mult-choice"
      >
        <el-row :gutter="10" v-for="item in config.children" :key="item.id">
          <el-col :span="18">
            <el-checkbox :label="item.id">
              <div class="flex items-center">
                <div class="whitespace-pre-wrap" v-html="item.title"></div>
              </div>
            </el-checkbox>
          </el-col>
          <el-col :span="6" v-if="showScore(item)">
            <el-input-number
              v-model="item.fs"
              :min="0.01"
              :max="config.attribute.tmzf"
              size="small"
              :precision="2"
              :step="0.1"
              style="width: 100%"
            />
          </el-col>
        </el-row>
      </el-checkbox-group>

      <el-radio-group
        v-model="checked"
        v-if="config.type === 'single_choice'"
        class="single_choice"
      >
        <el-row :gutter="10">
          <el-col :span="24" v-for="item in config.children" :key="item.id">
            <el-radio :label="item.id">
              <div class="flex items-center">
                <div class="whitespace-pre-wrap" v-html="item.title"></div>
              </div>
            </el-radio>
          </el-col>
        </el-row>
      </el-radio-group>
    </div>
    <div class="content">
      <div class="mb-10px">
        <label class="mr-20px">分数信息配置</label>
        <!-- <el-checkbox
          label="应用至其他题目"
          v-model="batchEdit"
          true-label="1"
          false-label="0"
          v-if="config.attribute.sxdfgz !== '1'"
        /> -->
      </div>
      <div class="flex gap-10px items-center mb-10px">
        <label>题目总分</label>
        <el-input-number
          v-model="config.attribute.tmzf"
          :min="1"
          :max="99999"
          size="small"
          :precision="2"
          :step="0.1"
          @change="handleTmzfChange"
        />
      </div>
      <template v-if="config.type === 'mult_choice'">
        <div class="flex gap-10px items-center mb-10px">
          <label>少选得分</label>
          <el-switch
            v-model="config.attribute.sxdf"
            @change="handleSxdfChange"
            active-value="1"
            inactive-value="0"
          ></el-switch>
        </div>
        <div
          class="flex gap-10px items-center mb-10px"
          v-if="config.attribute.sxdf === '1'"
        >
          <label>少选得分规则</label>
          <div>
            <el-radio-group
              v-model="config.attribute.sxdfgz"
              @change="handleSxdfgzChange"
            >
              <el-radio label="0">得固定分</el-radio>
              <el-radio label="1">得部分分</el-radio>
            </el-radio-group>
          </div>
        </div>
        <div
          class="flex gap-10px items-center"
          v-if="
            config.attribute.sxdf === '1' && config.attribute.sxdfgz === '0'
          "
        >
          <label style="width: 80px"></label>
          <el-input-number
            v-model="config.attribute.gddf"
            :min="1"
            :max="config.attribute.tmzf"
            size="small"
            :precision="2"
            :step="0.1"
          />
        </div>
      </template>
    </div>
    <div class="btn-group">
      <el-button @click="cancel">取消</el-button>
      <el-button type="primary" @click="doSave">确认</el-button>
    </div>
  </div>
</template>
<script setup lang="ts">
import { ref, toRefs, toRaw, onMounted } from "vue";
import { useDesignFormStore } from "@/stores/modules/design";
import { ElMessage, ElMessageBox } from "element-plus";
import { cloneDeep } from "lodash-es";

const store = useDesignFormStore();

const checked = ref<string | string[]>();

const batchEdit = ref("0");

const emit = defineEmits(["close"]);

const props = withDefaults(
  defineProps<{
    config: any;
    formData: any;
  }>(),
  {
    config: () => {},
    formData: () => [],
  }
);

const { config, formData } = toRefs(props);

const showScore = (record) => {
  return (
    config.value.attribute.sxdfgz === "1" &&
    Array.isArray(checked.value) &&
    checked.value.includes(record.id)
  );
};

const handleTmzfChange = (val) => {};

const handleSxdfChange = (val) => {};

const handleSxdfgzChange = (val) => {};

//处理正确答案
const handleZqda = () => {
  if (config.value.type === "single_choice") {
    for (const item of config.value.children) {
      item.attribute.zqda = checked.value === item.id ? true : false;
    }
  } else {
    for (const item of config.value.children) {
      item.attribute.zqda = checked.value?.includes(item.id) ? true : false;
    }
  }
};

onMounted(() => {
  if (props.config.type === "single_choice") {
    checked.value = "";
    const commonItem = props.config.children.find(
      (item) => item.attribute.zqda
    );
    checked.value = commonItem?.id ?? "";
  } else {
    checked.value = [];
    for (const item of props.config.children) {
      item.attribute.zqda && checked.value?.push(item.id);
    }
  }
});

const doSave = () => {
  if (
    config.value.type === "mult_choice" &&
    config.value.attribute.sxdfgz === "1"
  ) {
    const arr = config.value.children.filter((item) =>
      checked.value?.includes(item.id)
    );
    const totalScore = arr.reduce((sum, curr) => sum + curr.fs, 0);
    if (totalScore > config.value.attribute.tmzf) {
      ElMessage.error(
        `得部分分的总分${totalScore}大于题目总分${config.value.attribute.tmzf}，请修改分数!`
      );
      return;
    }
  }
  if (config.value.attribute.sxdfgz === "1") {
    batchEdit.value = "0";
  }

  if (batchEdit.value === "1") {
    let list: any[] = cloneDeep(store.formData.list);
    for (const item of list) {
      item.attribute.tmzf = config.value.attribute.tmzf;
      if (
        config.value.type === item.type &&
        config.value.type === "mult_choice"
      ) {
        item.attribute.sxdf = config.value.attribute.sxdf;
        item.attribute.sxdfgz = "0";
        item.attribute.gddf = config.value.attribute.gddf;
      }
    }
    store.setFormList(list);
  }

  handleZqda();
  emit("close", toRaw(config), batchEdit.value);
  ElMessage.success("设置成功！");
};
const cancel = () => {
  emit("close");
};
</script>

<style lang="less" scoped>
.yellow {
  color: #f68d00;
}
.thead-h {
  font-size: 12px;
  text-align: center;
  height: 30px;
}
.mult-choice {
  :deep(.el-checkbox) {
    height: auto !important;
    margin-bottom: 20px;
  }
}
.single_choice {
  :deep(.el-radio) {
    height: auto !important;
    margin-bottom: 20px;
  }
  width: 100%;
  display: block;
}
.table {
  min-width: 400px;
  width: 100%;
  display: table;
  border-collapse: collapse;
}
.score-config {
  .current-title {
    font-size: 16px;
  }
}

.content {
  background: #f1f1f1;
  padding: 10px;
  border-radius: 4px;
}

.table-th {
  display: table-header-group;
  table-layout: fixed;
  font-size: 16px;
  color: #000000;
  background-color: #f1f1f1;
  border: 1px solid #f0f0f0;
}

.table-tr {
  display: table-row;
}

.table-td {
  display: table-cell;
  text-align: center;
  border: 1px solid #f0f0f0;
  padding: 5px;
  vertical-align: middle;
}

.curr-ques {
  display: inline-block;
  font-weight: bold;
}

.btn-group {
  margin-top: 20px;
  display: flex;
  justify-content: flex-end;
}
</style>

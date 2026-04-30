<template>
  <div class="p-10px">
    <div class="flex justify-between items-center">
      <span class="font-bold text-base py-10px">触发条件</span>
      <el-button @click="handleAddGroup" type="primary">添加条件组</el-button>
    </div>
    <div>
      <div
        v-for="(item, index) in conditionsGroup"
        :key="item.id"
        class="flex my-5px"
      >
        <div
          class="group-label flex-1 p-5px mr-10px cursor-pointer"
          :class="{ active: index === group_check }"
          @click="group_check = index"
        >
          {{ `${item.name}--${item.label}` }}
        </div>
        <el-button
          type="danger"
          circle
          size="small"
          @click="handleDelGroup(index)"
        >
          <el-icon><Minus /></el-icon>
        </el-button>
      </div>
    </div>
    <div>
      <div class="table" v-if="group_check > -1">
        <div class="table-th">
          <div class="table-td" style="width: 200px">问卷题目</div>
          <div class="table-td" style="width: 100px">条件</div>
          <div class="table-td" style="width: 200px">题目答案</div>
          <div class="table-td" style="width: 50px">操作</div>
        </div>
        <div
          class="table-tr"
          v-for="c in conditionsGroup[group_check].conditions"
          :key="c.key"
        >
          <div class="table-td" style="width: 200px">
            <el-select
              v-model="c.question"
              @change="(val) => handleQuestionChange(val, c)"
            >
              <el-option
                v-for="q in questions"
                :key="q.id"
                :value="q.id"
                :label="q.label"
              ></el-option>
            </el-select>
          </div>
          <div class="table-td" style="width: 100px">
            <el-select
              v-model="c.operator"
              @change="(val) => handleOperatorChange(val, c)"
            >
              <el-option
                v-for="o in operators"
                :key="o.value"
                :value="o.value"
                :label="o.label"
              ></el-option>
            </el-select>
          </div>
          <div class="table-td" style="width: 200px">
            <el-select
              v-model="c.answer"
              @change="(val) => handleAnswerChange(val, c)"
            >
              <el-option
                v-for="a in initOptions(c.question)"
                :key="a.id"
                :value="a.id"
                :label="a.title"
              ></el-option>
            </el-select>
          </div>
          <div class="table-td" style="width: 50px">
            <el-button type="danger" link @click="handleDelCondition(c.key)">
              <el-icon><Delete /></el-icon>
            </el-button>
          </div>
        </div>
      </div>
      <div
        v-if="conditionsGroup[group_check]?.conditions.length === 0"
        class="flex items-center justify-center h-50px text-slate-500 border-1"
      >
        暂无数据
      </div>
      <div v-if="group_check > -1">
        <el-button @click="handleAddCondition" class="w-full"
          >添加条件</el-button
        >
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, toRefs } from "vue";
import { rexFilter } from "@/utils/transform";
import { Delete, Minus } from "@element-plus/icons-vue";

const props = defineProps({
  formList: {
    type: Array,
    default: () => [],
  },
  conditionsGroup: {
    type: Array,
    default: () => [],
  },
});

const { conditionsGroup } = toRefs<any>(props);
const group_check = ref(-1);

// const conditionsGroup = ref<any>([]);
const data = reactive({
  group: [
    {
      key: `t${new Date().getTime().toString()}`,
      name: `条件组1`,
      label: "",
      conditions: [],
    },
    {
      key: `t2${new Date().getTime().toString()}`,
      name: `条件组2`,
      label: "",
      conditions: [],
    },
  ] as any,
  group_check: -1,
});

const questions = ref<any>([]);
const answers = ref<any>([]);
const operators = ref<any>([{ value: "1", label: "等于(=)" }]);

const handleAddGroup = () => {
  const index = conditionsGroup.value.length || 0;
  const newData = {
    key: `t${new Date().getTime().toString()}`,
    name: `条件组${index + 1}`,
    label: "",
    conditions: [],
  };
  conditionsGroup.value.push(newData);
  group_check.value = index;
};

const handleAddCondition = () => {
  const newData = {
    key: `t${new Date().getTime().toString()}`,
    question: "",
    operator: "",
    answer: "",
  };
  conditionsGroup.value[group_check.value].conditions.push(newData);
};

const initQuestions = () => {
  const list = props.formList.filter(
    (item: any) => !["pagination", "paragraph"].includes(item.type)
  );
  const arr = list
    .map((item: any, index: number) => {
      return {
        value: item.id,
        label: `${index + 1}、${rexFilter(item.title)}`,
        id: item.id,
        type: item.type,
        children: item.children,
      };
    })
    .filter((item: any) => item.type === "single_choice");
  questions.value = arr;
};

const initOptions = (questionId: string) => {
  const _question = questions.value.find((item: any) => item.id === questionId);
  return _question?.children || [];
};

const handleQuestionChange = (val: any, condition: any) => {
  const _question = questions.value.find((item: any) => item.id === val);
  condition.qLabel = _question.label;
  answers.value = _question?.children || [];
  condition.answer = "";
  createLabel();
};

const handleAnswerChange = (val: any, condition: any) => {
  const _answer = answers.value.find((item: any) => item.id === val);
  condition.aLabel = _answer.title;
  createLabel();
};

const handleOperatorChange = (val: any, condition: any) => {
  const _operator = operators.value.find((item: any) => item.value === val);
  condition.oLabel = _operator.label;
  createLabel();
};

const createLabel = () => {
  conditionsGroup.value[group_check.value].label = conditionsGroup.value[
    group_check.value
  ].conditions
    .map(
      (item: any) =>
        `${item.qLabel || ""} ${item.oLabel || ""} ${item.aLabel || ""}`
    )
    .join(" & ");
};

const handleDelCondition = (key: string) => {
  conditionsGroup.value[group_check.value].conditions = conditionsGroup.value[
    group_check.value
  ].conditions.filter((item: any) => item.key !== key);
};

const handleDelGroup = (index: number) => {
  conditionsGroup.value.splice(index, 1);
  group_check.value = -1;
};

onMounted(() => {
  initQuestions();
});
</script>
<style lang="less" scoped>
.group-label {
  border: 1px solid #d3d3d3;
  display: flex;
  align-items: center;
  font-size: 14px;
}
.group-label.active {
  background-color: #409eff;
  color: #fff;
}
.table {
  min-width: 600px;
  width: 100%;
  margin: 0 auto;
  display: table;
  border-collapse: collapse;
}

.table-th {
  display: table-header-group;
  font-size: 14px;
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
</style>

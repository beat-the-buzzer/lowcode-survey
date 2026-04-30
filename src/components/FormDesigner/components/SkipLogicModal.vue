<!-- eslint-disable vue/no-mutating-props -->
<template>
  <div>
    <div class="flex justify-center">
      <el-checkbox
        v-if="config.type === 'single_choice'"
        v-model="checked1"
        label="按选项跳题"
        size="large"
        border
        @change="handleChange1"
      />
      <el-checkbox
        v-model="checked2"
        label="无条件跳题"
        size="large"
        border
        @change="handleChange2"
      />
    </div>
    <div v-if="checked1" class="p-20px">
      <div class="table">
        <div class="table-th">
          <div style="width: 200px" class="table-td">选项</div>
          <div style="width: 200px" class="table-td">跳转到</div>
        </div>
        <div class="table-tr" v-for="item in config.children" :key="item.id">
          <div style="width: 200px" class="table-td">
            <div v-html="item.title"></div>
          </div>
          <div style="width: 200px" class="table-td">
            <el-select
              v-model="item.attribute.skipPath"
              placeholder="请选择要跳转到的题目"
              filterable
            >
              <el-option
                v-for="item in byOptionOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </div>
        </div>
      </div>
    </div>
    <div v-if="checked2" class="p-20px flex justify-center items-center">
      <span class="font-bold mr-10px">填写此题后跳转到</span>
      <el-select
        v-model="config.attribute.skipPath"
        placeholder="请选择要跳转到的题目"
      >
        <el-option
          v-for="item in unConditionOptions"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        />
      </el-select>
    </div>
  </div>
</template>
<script setup lang="ts">
import { ref, toRefs, computed, onMounted } from "vue";
import { rexFilter } from "@/utils/transform";
import { useDesignFormStore } from "@/stores/modules/design";

const store = useDesignFormStore();

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

const { config } = toRefs(props);

const checked1 = ref(false);
const checked2 = ref(false);

const byOptionOptions = ref<any[]>([]);
const unConditionOptions = ref<any[]>([]);
const basicOptions = [
  { value: "", label: "不跳转，按顺序填写下一题" },
  { value: "end", label: "跳到问卷末尾结束作答" },
];

// 构建跳转选项
const createOptions = () => {
  const questions = props.formData.filter(
    (item: any) => !["pagination", "paragraph"].includes(item.type)
  );
  const _index = questions.findIndex(
    (item: any) => item.id === config.value.id
  );
  const arr = questions
    .map((item: any, index: number) => {
      return {
        value: item.id,
        label: `${index + 1}、${rexFilter(item.title)}`,
        id: item.id,
        disabled: item.type === "paragraph",
      };
    })
    .filter((item: any, index: number) => index > _index);

  byOptionOptions.value = [...basicOptions, ...arr];
  unConditionOptions.value = [...basicOptions, ...arr];
};

const initSkipOptions = () => {
  let groupOptions: any[] = [];
  let pageIndexArr: number[] = [];
  // 当前题目索引
  const _index = props.formData.findIndex(
    (item: any) => item.id === config.value.id
  );
  // 获取分页页数
  const paginations = props.formData
    .filter((item: any) => item.type === "pagination")
    .map((item: any, index: number) => {
      groupOptions.push({
        value: item.id,
        label: `第${index}页`,
        id: item.id,
        options: [],
      });
      pageIndexArr.push(index);
    });
  if (paginations.legnth > 0) {
    // 过滤当前题目前的分页
    pageIndexArr = pageIndexArr.filter((item) => item < _index);
    groupOptions.map((item, index) => {
      item.options = props.formData.filter((item: any, index: number) => {});
    });
  } else {
    groupOptions = props.formData
      .filter((item: any, index: number) => index > _index)
      .map((item: any, index: number) => {
        return {
          value: item.id,
          label: `${index + 1}、${rexFilter(item.title)}`,
          id: item.id,
          disabled: item.type === "paragraph",
        };
      });
  }
};

const handleChange1 = (value: any) => {
  if (value) {
    checked2.value = false;
    config.value.attribute.skip = "byOption";
    config.value.attribute.skipPath = "";
  } else {
    config.value.attribute.skip = "";
    config.value.attribute.skipPath = "";
    config.value.children.map((item: any) => (item.attribute.skipPath = ""));
  }
};

const handleChange2 = (value: any) => {
  if (value) {
    checked1.value = false;
    config.value.attribute.skip = "unCondition";
    config.value.children?.map((item: any) => {
      if (item.attribute?.skipPath) {
        item.attribute.skipPath = "";
      }
    });
  } else {
    config.value.attribute.skip = "";
  }
};

onMounted(() => {
  createOptions();
  if (config.value.attribute?.skip === "byOption") checked1.value = true;
  if (config.value.attribute?.skip === "unCondition") checked2.value = true;
});
</script>

<style lang="less" scoped>
.table {
  min-width: 400px;
  width: 100%;
  display: table;
  border-collapse: collapse;
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
</style>

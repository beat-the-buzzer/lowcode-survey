<template>
  <div>
    <div class="table">
      <div class="table-th">
        <div
          v-for="(item, index) in data.children"
          :key="item.id"
          class="table-td"
          @click.stop="handleOptionSetting(item, index + 1, 'table_column')"
        >
          <InlineEditor
            v-model:modelValue="item.title"
            class="inline-block min-w-80px"
          />
          <el-dropdown
            class="absolute right-0 top-0"
            @command="handleChildCommand"
          >
            <el-icon color="#999999"><CaretBottom /></el-icon>
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item
                  v-if="index > 0"
                  :command="{ type: 'left', index, item }"
                  >左移</el-dropdown-item
                >
                <el-dropdown-item
                  v-if="index < data.children.length - 1"
                  :command="{ type: 'right', index, item }"
                  >右移</el-dropdown-item
                >
                <el-dropdown-item :command="{ type: 'del', index }"
                  >删除</el-dropdown-item
                >
              </el-dropdown-menu>
            </template>
          </el-dropdown>
        </div>
      </div>
      <div
        class="table-tr"
        v-for="item in data.attribute.defaultRows"
        :key="item"
      >
        <div class="table-td" v-for="c in data.children" :key="c.id">
          <el-select v-if="c.attribute.dataType === 'select'">
            <el-option
              v-for="item in c.attribute.options"
              :key="item.id"
              :label="item.title"
              :value="item.id"
            />
          </el-select>
          <el-input-number
            v-else-if="c.attribute.inputType === 'number'"
            :min="c.attribute.minValue"
            :max="c.attribute.maxValue"
            :precision="c.attribute.precision ?? 0"
            size="small"
          />
          <el-input v-else v-model="inputValue" size="small"></el-input>
        </div>
      </div>
    </div>
    <div class="py-10px">
      <el-button class="w-full">
        <el-icon size="18" class="mr-10px"><CirclePlus /></el-icon>
        继续填写
      </el-button>
    </div>
    <div v-if="activeKey === data.id" class="m-10px mt-20px">
      <el-button link type="primary" @click.stop="handleAddChild">
        <el-icon><Plus /></el-icon>
        添加选项
      </el-button>
    </div>
    <div
      v-if="data.attribute.skip === 'unCondition' && data.attribute.skipPath"
      class="text-sm text-orange-400 text-center"
    >
      {{ skipTarget }}
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, toRefs } from "vue";
import { buildShortUUID } from "@/utils/uuid";
import { CaretBottom, CirclePlus, Plus } from "@element-plus/icons-vue";
import { useDesignFormStore } from "@/stores/modules/design";
import { ElMessage } from "element-plus";
import InlineEditor from "@/components/InlineEditor";

const props = withDefaults(
  defineProps<{
    data: any;
    questionList: any[];
  }>(),
  {
    data: () => {},
    questionList: () => [],
  }
);

const { data } = toRefs(props);
const inputValue = ref("");

const emit = defineEmits(["optionSet"]);

const activeKey = computed(() => {
  return useDesignFormStore().activeItem.id;
});

const handleOptionSetting = (item: any, index: number, type: string) => {
  emit("optionSet", item, index, type);
};

const handleAddChild = () => {
  data.value.children.push({
    title: `选项${data.value.children.length + 1}`,
    id: buildShortUUID(),
    attribute: {},
  });
};

const handleChildCommand = (command: any) => {
  const { type, index, item } = command;
  if (type === "right") {
    // 右移
    data.value.children.splice(index + 2, 0, item);
    data.value.children.splice(index, 1);
  }
  if (type === "left") {
    // 左移
    data.value.children.splice(index - 1, 0, item);
    data.value.children.splice(index + 1, 1);
  }
  if (type === "del") {
    // 删除
    if (data.value.children.length > 1) {
      data.value.children.splice(index, 1);
    } else {
      ElMessage.error("请保留最少一列");
    }
  }
};

const skipTarget = computed(() => {
  const { data, questionList } = props;
  if (data.attribute.skipPath === "end") {
    return "无条件跳题：跳至结束";
  } else {
    const index = questionList.findIndex(
      (item) => item.id === data.attribute.skipPath
    );
    return index > -1 ? `无条件跳题：跳转至第${index + 1}题` : "";
  }
});
</script>

<style lang="less" scoped>
.table {
  width: 100%;
  margin: 0 auto;
  display: table;
  border-collapse: collapse;
}

.table-th {
  display: table-header-group;
  border: 1px solid #ccc;
}

.table-tr {
  display: table-row;
}

.table-td {
  width: 100px;
  display: table-cell;
  text-align: center;
  border: 1px solid #ccc;
  padding: 5px 10px;
  vertical-align: middle;
  position: relative;
}
</style>

<template>
  <div>
    <div>
      <el-select>
        <el-option
          v-for="item in data.children"
          :key="item.id"
          :label="item.title"
          :value="item.id"
        />
      </el-select>
    </div>
    <div v-if="activeKey === data.id" class="m-10px">
      <el-button link type="primary" @click="dialogVisible = true">
        <el-icon><Plus /></el-icon>
        添加选项
      </el-button>
      <el-button link type="primary" @click="batchAddOptionsVisible = true">
        <el-icon><Plus /></el-icon>
        批量添加选项
      </el-button>
    </div>
    <div
      v-if="data.attribute.skip === 'unCondition' && data.attribute.skipPath"
      class="text-sm text-orange-400 text-center"
    >
      {{ skipTarget }}
    </div>
    <el-dialog
      v-model="dialogVisible"
      title="选项编辑"
      width="600px"
      :close-on-click-modal="false"
    >
      <div style="height: 400px">
        <el-auto-resizer>
          <template #default="{ height, width }">
            <el-table-v2
              :columns="columns"
              :data="data.children"
              :width="width"
              :height="height"
              fixed
            />
          </template>
        </el-auto-resizer>
      </div>
      <el-button
        class="mt-4"
        style="width: 100%"
        @click="onAddItem"
        type="primary"
        >新增选项</el-button
      >
    </el-dialog>
    <el-dialog
      v-model="batchAddOptionsVisible"
      title="批量添加选项"
      width="800px"
      :close-on-click-modal="false"
    >
      <BatchAddOptions
        v-if="batchAddOptionsVisible"
        class="w-full"
        type="select"
        :options="data.children"
        @cancel="batchAddOptionsVisible = false"
        @set-options="handleSetOptions"
      />
    </el-dialog>
  </div>
</template>

<script setup lang="tsx">
import { ref, computed, toRefs } from "vue";
import { useDesignFormStore } from "@/stores/modules/design";
import { buildShortUUID } from "@/utils/uuid";
import { ElInput, ElButton } from "element-plus";
import type { FunctionalComponent } from "vue";
import type { Column } from "element-plus";
import { Delete, Plus } from "@element-plus/icons-vue";
import BatchAddOptions from "../components/BatchAddOptions.vue";

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

const activeKey = computed(() => {
  return useDesignFormStore().activeItem.id;
});

const dialogVisible = ref(false);
const batchAddOptionsVisible = ref(false);

const InputCell: FunctionalComponent<any> = ({
  value,
  onChange,
  forwardRef,
}) => {
  return (
    <ElInput ref={forwardRef as any} onInput={onChange} modelValue={value} />
  );
};

const columns: Column<any>[] = [
  {
    key: "title",
    title: "选项文字",
    dataKey: "title",
    width: 400,
    cellRenderer: ({ rowData, column }) => {
      const onChange = (value: string) => {
        rowData[column.dataKey!] = value;
      };
      const onEnterEditMode = () => {
        rowData.editing = true;
      };

      const onExitEditMode = () => (rowData.editing = false);
      const input = ref();
      const setRef = (el) => {
        input.value = el;
        if (el) {
          el.focus?.();
        }
      };

      return rowData.editing ? (
        <InputCell
          forwardRef={setRef}
          value={rowData[column.dataKey!]}
          onChange={onChange}
          onBlur={onExitEditMode}
          onKeydownEnter={onExitEditMode}
        />
      ) : (
        <div class="table-v2-inline-editing-trigger" onClick={onEnterEditMode}>
          {rowData[column.dataKey!]}
        </div>
      );
    },
  },
  {
    key: "operations",
    title: "操作",
    cellRenderer: ({ rowIndex }) => {
      const deleteRow = () => {
        data.value.children.splice(rowIndex, 1).splice(rowIndex, 1);
      };

      return (
        <>
          <ElButton
            size="small"
            type="danger"
            icon={Delete}
            onClick={deleteRow}
          ></ElButton>
        </>
      );
    },
    width: 150,
    align: "center",
    flexGrow: 1,
  },
];

const onAddItem = () => {
  data.value.children.push({
    title: "选项" + (data.value.children.length + 1),
    id: buildShortUUID(),
  });
};

const handleSetOptions = (arr: any) => {
  batchAddOptionsVisible.value = false;
  data.value.children = arr
    .filter((item) => !!item)
    .map((item: any) => {
      return {
        title: item,
        id: buildShortUUID(),
      };
    });
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
:deep(.table-v2-inline-editing-trigger) {
  border: 1px transparent dotted;
  padding: 4px;
}

:deep(.table-v2-inline-editing-trigger:hover) {
  border-color: var(--el-color-primary);
}
</style>

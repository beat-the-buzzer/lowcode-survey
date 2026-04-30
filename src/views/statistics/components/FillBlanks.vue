<template>
  <div class="p-20px">
    <div v-html="config.attribute.content" class="mb-20px"></div>
    <el-table :data="tableData" border>
      <el-table-column prop="name" label="填空" />
      <el-table-column prop="value" label="操作">
        <template #default="{ row }">
          <el-button link type="primary" size="small" @click="handleClick(row)"
            >查看答卷数据</el-button
          >
        </template>
      </el-table-column>
    </el-table>
    <el-dialog v-model="visible" :title="title" width="1000px" destroy-on-close>
      <AnswerTable
        :params="params"
        :question="question"
        custom-class="terse-modal"
      />
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import AnswerTable from "./AnswerTable.vue";

const props = defineProps({
  question: {
    type: Object,
    default: () => {},
  },
  content: {
    type: Object,
    default: () => {},
  },
});

const visible = ref(false);
const params = ref<any>({});
const title = ref("");

const config = ref(props.question.children[0]);

const tableData = ref([]);

const initTableList = () => {
  tableData.value = config.value.children.map((item: any, index: number) => {
    return {
      id: item.id,
      name: `填空${index + 1}`,
    };
  });
};

initTableList();

const handleClick = async (row: any) => {
  title.value = row.name + "-答卷数据";
  params.value = {
    xmid: row.id,
    wtlx: props.content?.wtlx,
  };
  visible.value = true;
};
</script>

<style lang="less"></style>

<template>
  <div class="p-20px">
    <el-table :data="tableData" :span-method="objectSpanMethod" border>
      <el-table-column prop="row" label="行标题" />
      <el-table-column prop="column" label="列标题" />
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
import { rexFilter } from "@/utils/transform";
import AnswerTable from "./AnswerTable.vue";
import md5 from "md5";

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
const title = ref("");
const params = ref<any>({});

const tableData = ref<any[]>([]);

const initTableData = () => {
  const { row, children } = props.question;
  let arr: any = [];
  row.map((r: any) => {
    children.map((c: any) => {
      arr.push({
        row: rexFilter(r.title),
        column: rexFilter(c.title),
        rowId: r.id,
        columnId: c.id,
      });
    });
  });
  tableData.value = arr;
};

initTableData();

const objectSpanMethod = ({ row, rowIndex, columnIndex }: any) => {
  let num = 1;
  // 根据columnIndex判断需要判断值是否相等的字段
  if (columnIndex === 0) {
    num = recursionRowSpan(row, rowIndex, "row", tableData.value);
  }
  return {
    rowspan: num,
    colspan: 1,
  };
};

// 通过递归获取单元格所占大小
let nowRowSpan = 1;
const recursionRowSpan = (
  row: any,
  rowIndex: number,
  str: string,
  data: any
): number => {
  let num = 0;
  // 判断上一行字段的值与改行值是否一致
  if (nowRowSpan == 1 && rowIndex > 0 && row[str] == data[rowIndex - 1][str]) {
    return 0;
  }
  // 判断下一行字段的值与改行值是否一致
  if (rowIndex + 1 < data.length && row[str] == data[rowIndex + 1][str]) {
    nowRowSpan++;
    num = rowIndex + 1;
    return recursionRowSpan(data[num], num, str, data);
  } else {
    num = nowRowSpan;
    nowRowSpan = 1;
    return num;
  }
};

const handleClick = (row: any) => {
  console.log(row);
  title.value = `${row.row}:${row.column}-答卷数据`;
  params.value = {
    xmid: md5(row.rowId + row.columnId),
    wtlx: props.content?.wtlx,
  };
  visible.value = true;
};
</script>

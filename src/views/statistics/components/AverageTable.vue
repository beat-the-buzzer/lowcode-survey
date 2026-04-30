<template>
  <div>
    <div class="text-right p-10px">
      <el-button @click="onExport">导出</el-button>
    </div>
    <el-table id="table-box" :data="tableData" border>
      <el-table-column prop="name" label="标题" />
      <el-table-column
        v-for="item in question.children"
        :key="item.id"
        :prop="item.id"
        :label="`${rexFilter(item.title)}-平均分`"
      ></el-table-column>
      <el-table-column prop="average" label="平均分" />
    </el-table>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { rexFilter } from "@/utils/transform";
import { utils, writeFile } from "xlsx";

const props = withDefaults(
  defineProps<{
    question: any;
    averageMap: any;
  }>(),
  {
    averageMap: () => {},
    question: () => {},
  }
);

const tableData = ref<any[]>();

const initTable = () => {
  const { row } = props.question;
  const content = row.map((item: any) => {
    let target: any = {};
    const arr = props.averageMap[item.id];
    arr.map((a: any) => {
      if (a["xmid"] != "total") {
        target[a["yid"]] = a["avgScore"];
      } else {
        target["average"] = a["avgScore"];
      }
    });
    return {
      name: rexFilter(item.title),
      ...target,
    };
  });
  const total: any = {
    name: "合计",
  };
  props.averageMap["total"].map((a) => {
    if (a["yid"] != "total") {
      total[a["yid"]] = a["avgScore"];
    } else {
      total["average"] = a["avgScore"];
    }
  });

  tableData.value = [...content, total];
};

const onExport = async () => {
  const { row, children } = props.question;
  let json = { name: "标题", average: "平均分" };
  children.map((c) => {
    json[c.id] = `${rexFilter(c.title)}-平均分`;
  });
  const excelData = convert_excel_data(tableData.value, json);
  // 将数据写入表格
  const data = utils.json_to_sheet(excelData);
  // 创建工作簿
  const wb = utils.book_new();
  // 将表格放入工作簿
  utils.book_append_sheet(wb, data, rexFilter(props.question.title));
  writeFile(wb, `${rexFilter(props.question.title)}.xlsx`);
};

const convert_excel_data = (excelData: any, tHeader: any) => {
  return excelData.map((item) => {
    const obj = {};
    for (const k in item) {
      if (tHeader[k]) {
        obj[tHeader[k]] = item[k];
      }
    }
    return obj;
  });
};

initTable();
</script>
<style lang="less" scoped>
.column-title {
  font-size: 14px;
  font-weight: bold;
  margin: 10px 0;
}
</style>

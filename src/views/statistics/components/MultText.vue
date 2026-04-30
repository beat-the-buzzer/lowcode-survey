<template>
  <div class="p-20px">
    <div class="flex justify-end mb-10px">
      <el-radio-group v-model="activeType">
        <el-radio-button label="table">表格</el-radio-button>
        <el-radio-button label="wordcloud">词云</el-radio-button>
      </el-radio-group>
    </div>
    <Table v-if="activeType === 'table'" :table-data="list" :total="total" />
    <WordCloud v-else :data-source="list" />
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import WordCloud from "./WordCloud.vue";
import Table from "./Table.vue";

const props = defineProps({
  content: {
    type: Object,
    default: () => {},
  },
});

const activeType = ref("wordcloud");

const list = ref([]);

const total = ref(0);

const init = () => {
  const { totalDjCount, xmArr } = props.content;
  total.value = totalDjCount;
  list.value = xmArr.map((item: any) => {
    return {
      value: item.count,
      name: item.xmmc,
    };
  });
};

init();
</script>

<style lang="less" scoped></style>

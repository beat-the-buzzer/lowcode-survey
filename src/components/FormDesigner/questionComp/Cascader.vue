<template>
  <div>
    <div>
      <el-cascader
        class="w-full"
        v-model:model-value="mockValue"
        :options="data.children"
        :props="{
          multiple: data.attribute.multiple,
        }"
        clearable
        collapse-tags
      />
    </div>
    <div v-if="activeKey === data.id" class="mt-10px">
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
      v-model="batchAddOptionsVisible"
      title="批量添加选项"
      width="1000px"
      :close-on-click-modal="false"
    >
      <AddCascaderOptions
        v-if="batchAddOptionsVisible"
        class="w-full"
        type="cascader"
        :options="data.text_source"
        @cancel="batchAddOptionsVisible = false"
        @set-options="handleSetOptions"
      />
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, toRefs } from "vue";
import { useDesignFormStore } from "@/stores/modules/design";
import { buildShortUUID } from "@/utils/uuid";
import AddCascaderOptions from "../components/AddCascaderOptions.vue";
import { Plus } from "@element-plus/icons-vue";
import { multText2Tree } from "@/utils/text2Tree";
import { isString } from "@/utils/is";

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

const mockValue = ref<any>();

const { data } = toRefs(props);

const activeKey = computed(() => {
  return useDesignFormStore().activeItem.id;
});

const batchAddOptionsVisible = ref(false);

const onAddItem = () => {
  data.value.children.push({
    title: "选项" + (data.value.children.length + 1),
    id: buildShortUUID(),
  });
};

const handleSetOptions = (value: string) => {
  batchAddOptionsVisible.value = false;
  data.value.text_source = value;
  data.value.children = multText2Tree(value, "/");
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
<style lang="less" scoped></style>

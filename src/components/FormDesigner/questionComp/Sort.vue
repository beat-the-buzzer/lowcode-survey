<template>
  <div>
    <el-row :gutter="16">
      <draggable
        class="w-full"
        itemKey="id"
        :list="data.children"
        name="fade"
        :group="`option-${data.id}`"
        handle=".drag-move"
      >
        <template #item="{ element, index }">
          <el-col
            :span="24 / data.attribute.optionSpan"
            class="option"
            :class="{
              active: activeKey === element.id,
            }"
            @click.stop="handleOptionSetting(element, index + 1, 'sort_item')"
          >
            <div
              class="drag-move iconfont icon-tuozhuai mr-10px cursor-move"
              title="拖拽"
            ></div>
            <div class="w-15px h-15px border-1 border-gray-300"></div>
            <InlineEditor
              v-model:modelValue="element.title"
              class="inline-block"
            />
            <span
              v-if="element.attribute.exclusion"
              class="text-xs text-gray-400 mr-10px"
              >[互斥]</span
            >
            <el-input
              v-if="element.attribute?.addInput"
              class="!w-200px"
            ></el-input>
            <el-icon
              v-if="activeKey === element.id"
              :size="18"
              color="#f55"
              class="cursor-pointer ml-10px"
              @click="handleDelOption(index)"
              ><CircleClose
            /></el-icon>
          </el-col>
        </template>
      </draggable>
    </el-row>

    <div v-if="activeKey === data.id" class="mt-10px">
      <el-button link type="primary" @click="handleAddOption">
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
import { useDesignFormStore } from "@/stores/modules/design";
import Draggable from "vuedraggable-es";
import { CircleClose, Plus, Setting } from "@element-plus/icons-vue";
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

const emit = defineEmits(["optionSet"]);

const activeKey = computed(() => {
  return useDesignFormStore().activeItem.id;
});

const handleOptionSetting = (item: any, index: number, type: string) => {
  emit("optionSet", item, index, type);
};

const handleAddOption = () => {
  data.value.children.push({
    id: buildShortUUID(),
    title: `选项${data.value.children.length + 1}`,
    attribute: {
      skipPath: "",
    },
  });
};
const handleDelOption = (index: number) => {
  data.value.children.splice(index, 1);
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

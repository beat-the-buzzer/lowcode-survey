<template>
  <div>
    <draggable
      itemKey="id"
      :list="data.children"
      name="fade"
      :group="`option-${data.id}`"
      handle=".drag-move"
    >
      <template #item="{ element, index }">
        <div
          class="choice-option"
          :class="{
            active: activeKey === element.id,
          }"
          :style="{ width: 100 / data.attribute.optionSpan + '%' }"
          @click.stop="handleOptionSetting(element, index + 1, 'radio')"
        >
          <div
            class="drag-move iconfont icon-tuozhuai mr-10px cursor-move"
            title="拖拽"
          ></div>
          <div
            class="w-15px h-15px min-w-15px border-1 rounded-1/2 border-gray-300"
          ></div>
          <InlineEditor
            v-model:modelValue="element.title"
            class="inline-block min-w-60px"
          />
          <el-input
            v-if="element.attribute.addInput"
            class="w-100px max-w-100px"
          ></el-input>
          <el-icon
            v-if="activeKey === element.id"
            :size="18"
            color="#f55"
            class="delete-icon"
            @click="handleDelOption(index)"
          >
            <CircleClose />
          </el-icon>
          <span v-if="element.attribute.skipPath" class="text-orange-400">{{
            element.attribute.skipPath === "end"
              ? "（跳至结束）"
              : `（跳转至第${questionIndex(element.attribute.skipPath)}题）`
          }}</span>
        </div>
      </template>
    </draggable>

    <div v-if="activeKey === data.id" class="m-10px">
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
import { CircleClose, Plus } from "@element-plus/icons-vue";
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

const handleSetOptions = (arr: any) => {
  data.value.children = arr
};

window[`setOpt${data.value.id}`] = (arr) => {
  handleSetOptions(arr)
}

const handleDelOption = (index: number) => {
  data.value.children.splice(index, 1);
};

const questionIndex = (id: string) => {
  return props.questionList.findIndex((item: any) => item.id === id) + 1;
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
<style scoped>
.choice-option {
  display: inline-flex;
  align-items: center;
  border: 1px dashed transparent;
  padding: 0 5px;
  position: relative;
}

.choice-option.active {
  border: 1px dashed #66b1ff;
}

.delete-icon {
  position: absolute;
  right: 0;
  top: 0;
  cursor: pointer;
}
</style>

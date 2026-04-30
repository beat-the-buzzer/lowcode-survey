<template>
  <div>
    <div
      v-for="(item, index) in data.children"
      :key="item.id"
      class="nps-option w-4/5"
      :class="{
        active: activeKey === item.id,
      }"
      @click.stop="handleOptionSetting(item, index + 1, 'nps-option')"
    >
      <div class="flex" @mouseleave="mouseoverIndex = 0">
        <div
          v-for="index in item.attribute.maxScore + 1"
          :key="index"
          class="nps-item"
          :style="loadStyle(index)"
          @mouseover="handleMouseOver(index)"
        >
          {{ index - 1 }}
        </div>
      </div>
      <div class="flex justify-between mt-5px text-gray-400">
        <span>{{ item.attribute.startTip }}</span>
        <span>{{ item.attribute.endTip }}</span>
      </div>
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
import { ref, computed } from "vue";
import { useDesignFormStore } from "@/stores/modules/design";

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

const emit = defineEmits(["optionSet"]);

const activeKey = computed(() => {
  return useDesignFormStore().activeItem.id;
});

const mouseoverIndex = ref(0);
const handleMouseOver = (index: number) => {
  mouseoverIndex.value = index;
};

const loadStyle = (index: number) => {
  return mouseoverIndex.value >= index
    ? {
        backgroundColor: "rgb(38,114,255)",
        opacity: (0.8 / mouseoverIndex.value) * index + 0.2,
      }
    : "";
};

const handleOptionSetting = (item: any, index: number, type: string) => {
  emit("optionSet", item, index, type);
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
.nps-item {
  display: flex;
  flex: 1 1;
  align-items: center;
  justify-content: center;
  height: 32px;
  margin: 0 4px;
  color: #aaa;
  font-size: 14px;
  line-height: 0.29rem;
  text-align: center;
  background: #eaeaea;
  background-color: #ccc;
  border-right: 0;
  border-radius: 2px;
}
.nps-tip {
  color: #8e8e8e;
  margin-top: 5px;
}

.nps-option {
  border: 1px dashed transparent;
  padding: 5px;
}
.nps-option.active {
  border: 1px dashed #66b1ff;
}
</style>

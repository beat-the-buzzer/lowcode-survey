<template>
  <div>
    <div
      v-for="(item, index) in data.children"
      :key="item.id"
      class="option"
      :class="{
        active: activeKey === item.id,
      }"
      @click.stop="handleOptionSetting(item, index + 1, 'timepicker')"
    >
      <el-date-picker
        v-if="item.attribute.type === 'date'"
        type="date"
        placeholder="请选择日期"
        :format="item.attribute.format"
        :value-format="item.attribute.format"
      />
      <el-date-picker
        v-if="item.attribute.type === 'datetime'"
        type="datetime"
        placeholder="请选择日期时间"
        :format="item.attribute.format"
        :value-format="item.attribute.format"
      />
      <el-time-picker
        v-if="item.attribute.type === 'time'"
        placeholder="请选择时间"
        :format="item.attribute.format"
        :value-format="item.attribute.format"
      />
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
import { Setting } from "@element-plus/icons-vue";

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

<template>
  <div>
    <el-progress
      :percentage="percentage"
      :text-inside="true"
      :stroke-width="20"
    >
      <span class="text-gray-300">{{ format }}</span>
    </el-progress>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";

const props = defineProps({
  total: {
    type: Number,
    default: 1,
  },
  current: {
    type: Number,
    default: 0,
  },
  type: {
    type: String,
    default: "1",
  },
});

const percentage = computed(() => {
  return Math.floor((props.current / props.total) * 100);
});

const format = computed(() => {
  return props.type === "2"
    ? `${props.current}/${props.total}页`
    : `${props.current}/${props.total}题`;
});
</script>

<style></style>

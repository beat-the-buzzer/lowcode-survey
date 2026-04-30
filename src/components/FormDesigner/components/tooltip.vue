<template>
  <el-tooltip placement="top">
    <template #content>
      <span v-html="content"></span>
    </template>
    <i class="icon-help"></i>
  </el-tooltip>
</template>

<script lang="ts" setup>
withDefaults(defineProps<{ content: string }>(), {});
</script>

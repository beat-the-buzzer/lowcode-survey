<template>
  <div v-html="config.title"></div>
</template>

<script setup lang="ts">
import { computed } from "vue";

const props = withDefaults(
  defineProps<{
    config: any;
    value: any;
    readOnly: boolean;
  }>(),
  {
    config: () => {},
    value: undefined,
    readOnly: false,
  }
);

const config = computed(() => {
  return props.config;
});

</script>
<style scoped>
:deep(.el-input__inner) {
  text-align: left;
}
</style>

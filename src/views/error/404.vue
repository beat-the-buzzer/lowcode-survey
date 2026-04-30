<template>
  <div class="error-container">
    <SvgIcon name="not-found" size="500" />
  </div>
</template>

<script setup lang="ts">
import SvgIcon from "@/components/SvgIcon";
</script>

<style lang="less" scoped>
.error-container {
  width: 100vw;
  height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}
</style>

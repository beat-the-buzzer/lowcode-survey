<template>
  <div id="app-box">
    <RouterView />
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'App'
});
</script>

<style>
html, body {
  padding: 0;
  margin: 0;
}
</style>

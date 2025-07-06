<template>
  <div class="common-layout">
    <el-container>
      <el-header class="header">问卷页面导航</el-header>
      <el-main>
        <el-button type="primary" @click="jumpToEdit">编辑问卷</el-button>
        <el-button type="primary">填写问卷</el-button></el-main>
    </el-container>
  </div>
</template>
  
<script lang="ts" setup>
import { useRouter } from 'vue-router';

const router = useRouter();

function jumpToEdit() {
  router.push('/design')
}

</script>
  
  <!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="css" scoped>
.header {
  background-color: #409EFF;
  color: #fff;
  line-height: var(--el-header-height);
}
</style>
  
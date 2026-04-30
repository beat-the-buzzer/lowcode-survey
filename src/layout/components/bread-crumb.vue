<template>
  <div>
    <el-breadcrumb separator="/">
      <el-breadcrumb-item
        v-for="item in breadList"
        :key="item.name"
        :to="item.path"
      >
        {{ item.meta.title }}
      </el-breadcrumb-item>
    </el-breadcrumb>
  </div>
</template>

<script lang="ts" setup>
import { ref, watch, computed } from "vue";
import { useRoute } from "vue-router";

const route = useRoute();
const breadList = ref<any>([]);

const isHome = computed(() => {
  return route.name === "home";
});

const getBreadcrumb = () => {
  let matched: any = route.matched;
  //如果不是首页
  if (!isHome.value) {
    matched = [].concat(matched);
  }
  breadList.value = matched;
};

watch(
  () => route,
  () => {
    getBreadcrumb();
  },
  { deep: true, immediate: true }
);
</script>

<style less scoped></style>

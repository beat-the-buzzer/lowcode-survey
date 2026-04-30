<template>
  <div class="flex justify-center">
    <el-space :size="50">
      <div class="stat-item" v-if="mode === 'user'">
        <div class="title">调研人数</div>
        <div class="num">{{ data.ffsl }}</div>
      </div>
      <div class="stat-item">
        <div class="title">答卷人数</div>
        <div class="num">{{ data.djsl }}</div>
      </div>
      <div class="stat-item" v-if="mode === 'user'">
        <div class="title">未答卷人数</div>
        <div class="num">{{ data.ffsl - data.djsl }}</div>
      </div>
      <div class="stat-item" v-if="mode === 'user'">
        <div class="title">回收率</div>
        <div class="num">
          {{
            `${((parseInt(data.djsl) / parseInt(data.ffsl)) * 100).toFixed(2)}%`
          }}
        </div>
      </div>
    </el-space>
  </div>
</template>

<script setup lang="ts">
defineProps({
  data: {
    type: Object,
    default: () => {},
  },
  mode: {
    type: String,
    default: "",
  },
});
</script>
<style lang="less" scoped>
.stat-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  .title {
    font-size: 14px;
    font-weight: bold;
    line-height: 30px;
  }
  .num {
    font-size: 14px;
    font-weight: bold;
    color: #1677ff;
  }
}
</style>

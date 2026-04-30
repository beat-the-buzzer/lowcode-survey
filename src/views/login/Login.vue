<template>
  <div class="login-box p-20px">
    <div class="w-1/2">
      <div class="p-60px">
        <img src="/images/left.png" class="w-full h-full object-fill" alt="" />
      </div>
    </div>
    <div class="w-1/2 p-100px flex items-center justify-center flex-col">
      <div class="flex w-full">
        <div
          class="login-type"
          :class="{ active: activeKey === '1' }"
          @click="activeKey = '1'"
        >
          账号登录
        </div>
      </div>
      <AccountForm v-if="activeKey === '1'" />
    </div>
  </div>
</template>
<script lang="ts" setup>
import { computed, ref, onMounted, unref } from "vue";
import AccountForm from "./AccountForm.vue";

const activeKey = ref("1");

onMounted(async () => {});
</script>
<style lang="less" scoped>
.login-box {
  width: 1200px;
  min-width: 1200px;
  height: 600px;
  display: flex;
  position: relative;
  background-color: rgba(43, 140, 250, 0.1);
  border-radius: 20px;
}
// .login-box::after {
//   content: '';
//   background: #2b8cfa;
//   opacity: 0.1;
//   position: absolute;
//   border-radius: 20px;
//   top: 0;
//   right: 0;
//   bottom: 0;
//   left: 0;
// }

.angle-qrcode {
  width: 120px;
  height: 120px;
  position: absolute;
  right: 0;
  top: 0;
  z-index: 2;
  background-image: url("./assets/qr-back.png");
  background-position: 100%;
  background-repeat: no-repeat;
  background-size: 100% 100%;
  border-radius: 0 20px 0 0;
}
.qr-change {
  position: absolute;
  right: 16px;
  top: 16px;
  width: 70px;
  height: 70px;
  object-fit: fill;
  cursor: pointer;
}
.login-type {
  color: #444444;
  font-size: 20px;
  line-height: 30px;
  font-weight: 600;
  cursor: pointer;
  border-bottom: 3px solid transparent;
}
.login-type.active {
  color: #2b8cfa;
  border-bottom: 3px solid #2b8cfa;
}
.other-login-img {
  width: 30px;
  height: 30px;
  object-fit: fill;
  margin-left: 20px;
}
.other-login-label {
  font-weight: 400;
  color: #2b8cfa;
}
</style>

<template>
  <el-container>
    <el-header class="header" height="64px">
      <!--min-w-1280px-->
      <div class="header-container  w-full max-w-1920px mx-auto">
        <div class="cursor-pointer flex items-center">
          <img :src="sysStore.logo" alt="" class="h-32px object-fill mr-8px" />
          <span class="title" @click="handleTitleClick">问卷</span>
          <!--          <bread-crumb class="ml-30px" />-->
        </div>
        <div v-if="false">
          <el-dropdown>
            <div class="flex items-center">
              <el-avatar
                class="!bg-transparent mr-10px"
                :size="40"
                :src="userInfo.avatar || defaultAvatar"
                fit="fill"
                alt=""
              />
              <span class="text-white"> {{ userInfo.xm }}</span>
            </div>
            <template #dropdown>
              <el-dropdown-menu v-permission="'download'">
                <el-dropdown-item @click="goDownload"
                  >下载管理</el-dropdown-item
                >
              </el-dropdown-menu>
              <el-dropdown-menu>
                <el-dropdown-item @click="handleLogout">登出</el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
        </div>
      </div>
    </el-header>
    <el-main>
      <div class="min-w-1280px max-w-1920px mx-auto">
        <router-view> </router-view>
      </div>
    </el-main>
  </el-container>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { useRouter } from "vue-router";
import { useUserStore } from "@/stores/modules/user";
import { useSysStore } from "@/stores/modules/system";
import defaultAvatar from "@/assets/images/avatar.png";
import { Storage } from "@/utils/storage";

const userStore = useUserStore();
const sysStore = useSysStore();
const router = useRouter();

const userInfo = computed(() => userStore.userInfo);

const handleLogout = () => {
  const login_way = Storage.get("login_way");
  const isProd = import.meta.env.PROD;
  userStore.LogOut();
  if (login_way && isProd) {
    window.location.replace(`${location.origin}/login`);
  } else {
    router.push({ name: "login" });
  }
};
const handleTitleClick = () => {
  router.push({ name: "list" });
};

const goDownload = () => {
  router.push({ name: "download" });
};
</script>

<style lang="less" scoped>
.header {
  //box-shadow: rgba(50, 50, 93, 0.25) 0 2px 5px -1px,
  //  rgba(0, 0, 0, 0.3) 0px 1px 3px -1px;
  display: flex;
  align-items: center;
  justify-content: center;
  position: sticky;
  z-index: 999;
  top: 0;
  background: var(--el-color-primary);
  //padding: 0 20px;
}
.header-container {
  display: flex;
  justify-content: space-between;
  align-items: center;
  .title {
    font-size: 20px;
    color: #fff;
    font-weight: bold;
  }
}
</style>

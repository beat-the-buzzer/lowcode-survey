<template>
  <div></div>
</template>
<script setup lang="ts">
import { computed, onMounted } from "vue";
import { useUserStore } from "@/stores/modules/user";
import { useRoute, useRouter } from "vue-router";
import { getCodeUrl } from "@/api/user";
import { getToken } from "@/utils/cookies";

const route = useRoute();
const router = useRouter();
const userStore = useUserStore();

const isMobile = computed(() => {
  return navigator.userAgent.match(
    /(phone|pad|pod|iPhone|iPod|ios|iPad|Android|Mobile|BlackBerry|IEMobile|MQQBrowser|JUC|Fennec|wOSBrowser|BrowserNG|WebOS|Symbian|Windows Phone)/i
  );
});

const authLogin = async () => {
  if (isMobile.value && getToken()) {
    const redirect_uri = route.query?.redirect_uri;
    if (redirect_uri) {
      window.location.replace(
        `/survey${decodeURIComponent(redirect_uri as string)}` as string
      );
    } else {
      window.location.replace("/survey/list/ty");
    }
  } else {
    const code = route.query?.code;
    if (code) {
      const redirect_uri = route.query?.state;
      const czlx = redirect_uri ? "answer" : "";
      await userStore.zfAuth({ code, czlx });
      localStorage.setItem("authType", "zf");
      if (redirect_uri) {
        window.location.replace(
          `/survey${decodeURIComponent(redirect_uri as string)}` as string
        );
      } else {
        window.location.replace("/survey/list/xg");
      }
    } else {
      const redirect_uri = route.query?.redirect_uri;
      const { data } = await getCodeUrl({ state: redirect_uri });
      window.location.replace(data);
    }
  }
};

onMounted(() => {
  authLogin();
});
</script>

<style scoped></style>

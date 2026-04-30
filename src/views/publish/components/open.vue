<template>
  <div class="publish-card">
    <div class="text-lg">问卷链接与二维码</div>
    <el-divider />
    <div class="flex items-center">
      <div>
        <el-dropdown>
          <div>
            <canvas id="qrcode"></canvas>
          </div>
          <template #dropdown>
            <el-dropdown-menu>
              <el-dropdown-item
                v-for="item in qrcodeSize"
                :key="item"
                icon="download"
                @click="handleDownloadQrCode(item)"
              >
                <div class="flex items-center">
                  <el-icon><Download /></el-icon>
                  {{ item }}
                </div>
              </el-dropdown-item>
            </el-dropdown-menu>
          </template>
        </el-dropdown>
      </div>
      <div class="flex flex-col justify-around ml-30px h-128px">
        <div class="text-lg">{{ survey.wjmc }}</div>
        <div class="flex items-center">
          <div class="flex items-center">
            <el-icon class="el-input__icon" size="20"><Link /></el-icon>
            {{ source }}
          </div>
          <el-button @click="handleCopy" class="ml-20px">复制</el-button>
          <el-button @click="handleGo" class="ml-20px">打开</el-button>
        </div>
        <div>
          <el-link @click="handlePoster">制作海报</el-link>
          <el-divider direction="vertical" />
          <el-link @click="handleGoSetting">问卷设置</el-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from "vue";
import { useClipboard } from "@vueuse/core";
import { ElMessage } from "element-plus";
import { useRoute, useRouter } from "vue-router";
import QrCode from "qrcode";
import { Download, Link } from "@element-plus/icons-vue";
import { getSurvey } from "@/api";

const route = useRoute();
const router = useRouter();
const survey = ref<any>({});

const source = computed(() => {
  return `${window.location.origin}/survey/detail?id=${route.query?.id}`;
});
const { copy } = useClipboard({ source, legacy: true });

const qrcodeSize: any = ["128*128", "256*256", "512*512", "1024*1024"];

const handleCopy = () => {
  copy(source.value);
  ElMessage.success("链接已复制");
};

const handleGo = () => {
  window.open(source.value, "_target");
};

const handleGoSetting = () => {
  router.push({ name: "setting", query: { id: route.query?.id } });
};

const handlePoster = () => {
  router.push({ name: "poster", query: { id: route.query?.id } });
};

const initQrCode = () => {
  const opts = {
    errorCorrectionLevel: "H", //容错级别
    type: "image/png", //生成的二维码类型
    quality: 0.3, //二维码质量
    margin: 0, //二维码留白边距
    width: 128, //宽
    height: 128, //高
  };
  // @ts-ignore
  QrCode.toCanvas(
    document.getElementById("qrcode"),
    source.value,
    opts,
    function (error: string) {
      console.log(error);
    }
  );
};

const initTitle = async () => {
  if (route.query?.id) {
    const { data } = await getSurvey(route.query?.id);
    survey.value = data;
  }
};

const handleDownloadQrCode = (item: string) => {
  const size = item.split("*");
  const opts = {
    errorCorrectionLevel: "H", //容错级别
    type: "image/png", //生成的二维码类型
    quality: 0.3, //二维码质量
    margin: 0, //二维码留白边距
    width: size[0], //宽
    height: size[1], //高
  };
  // @ts-ignore
  QrCode.toDataURL(source.value, opts, function (error: string, url: string) {
    const downloadElement = document.createElement("a");
    downloadElement.href = url;
    downloadElement.download = `问卷二维码(${item}).png`;
    document.body.appendChild(downloadElement);
    downloadElement.click();
    document.body.removeChild(downloadElement);
  });
};

onMounted(() => {
  initTitle();
  initQrCode();
});
</script>
<style lang="less" scoped>
.publish-card {
  box-shadow: rgba(0, 0, 0, 0.16) 0 1px 4px;
  padding: 20px 50px;
}
</style>

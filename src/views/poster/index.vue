<template>
  <div class="poster-designer">
    <div class="left">
      <div class="mt-20px">
        <div class="column-header">海报背景</div>
        <el-space wrap :size="15">
          <div v-for="item in bgImages" :key="item.key" class="relative">
            <img
              class="bg-img"
              :src="getImg(item.url)"
              alt=""
              @click="handleBackgroundSet(item.key, getImg(item.url))"
            />
            <span class="clicked" v-if="content.bgChecked === item.key">
              使用中
            </span>
          </div>
          <el-upload
            ref="upload"
            class="avatar-uploader"
            action=""
            accept="image/*"
            :limit="1"
            :on-change="handleUploadChange"
            :auto-upload="false"
            :show-file-list="false"
          >
            <div class="relative" v-if="content.customBgUrl">
              <img
                :src="content.customBgUrl"
                alt=""
                class="bg-img"
                @click.stop="handleBackgroundSet('custom', content.customBgUrl)"
              />
              <span class="clicked" v-if="content.bgChecked === 'custom'">
                使用中
              </span>
              <el-icon class="delete-icon" @click.stop="handleClearImage"
                ><CloseBold
              /></el-icon>
            </div>
            <div
              v-else
              class="upload-icon flex flex-col justify-center items-center"
            >
              <el-icon style="font-size: 28px"><Plus /></el-icon>
              <div class="mt-20px">点击上传</div>
              <div class="mt-10px text-12px">推荐尺寸:750*1250</div>
              <div class="mt-10px text-12px">不超过20M</div>
            </div>
          </el-upload>
        </el-space>
      </div>
      <div class="mt-30px">
        <div class="column-header">海报标题</div>
        <InlineEditor v-model:modelValue="content.title" />
      </div>
      <div class="mt-30px">
        <div class="column-header">辅助文字</div>
        <InlineEditor v-model:modelValue="content.tip" />
      </div>
      <div class="mt-30px">
        <div class="column-header">二维码</div>
        <div class="flex items-end">
          <span class="mx-20px text-16px">大小：</span>
          <el-slider
            style="width: 400px"
            v-model="content.qrcodeSize"
            :min="64"
            :max="256"
            show-input
            input-size="small"
            :marks="marks"
            @change="initQrCode"
          />
        </div>
      </div>
    </div>
    <el-affix :offset="100">
      <div class="right">
        <div id="poster" class="poster">
          <img
            v-if="content.bgUrl"
            :src="content.bgUrl"
            alt=""
            class="w-full h-full absolute z-1"
          />
          <div ref="titleRef" class="title" v-html="content.title" v-drag></div>
          <div ref="qrcodeRef" class="qrcode" v-drag>
            <canvas id="qrcode"></canvas>
          </div>
          <div ref="tipRef" class="tip" v-html="content.tip" v-drag></div>
        </div>
        <div class="text-center mt-20px">
          <el-button type="success" @click="handleDownloadPoster"
            >生成海报</el-button
          >
          <el-button type="primary" @click="handleSavePoster"
            >保存配置</el-button
          >
        </div>
      </div>
    </el-affix>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, reactive, ref } from "vue";
import { useRoute, useRouter } from "vue-router";
import QrCode from "qrcode";
import { getPoster, getSurvey, savePoster } from "@/api";
import type { UploadInstance } from "element-plus";
import { ElMessage } from "element-plus";
import { getBase64Image } from "@/utils/base64";
import { outputImage } from "@/utils/htmlToImage";
import { rexFilter } from "@/utils/transform";
import { CloseBold, Plus } from "@element-plus/icons-vue";
import InlineEditor from "@/components/InlineEditor";

const route = useRoute();
const router = useRouter();

const marks = reactive<any>({
  64: "64",
  128: "128",
  256: "256",
});

const upload = ref<UploadInstance>();

const bgImages = ref<any[]>([]);

const titleRef = ref<any>();
const qrcodeRef = ref<any>();
const tipRef = ref<any>();

const getImg = (url: string) => {
  return new URL(url, import.meta.url).href;
};

const content = ref<any>({
  qrcodeSize: 128,
  title: "",
  tip: `<p style="text-align: center;"><span style="color: rgb(0, 0, 0);">长按识别二维码</span></p>`,
  bgUrl: "",
  bgChecked: "",
  customBgUrl: "",
  titleTop: 0,
  qrcodeTop: 0,
  tipTop: 0,
});

const source = computed(() => {
  return `${window.location.origin}/survey/detail?id=${route.query?.id}`;
});

const handleBackgroundSet = (flag: string, url: string) => {
  if (flag !== "custom") {
    const image = new Image();
    image.src = url;
    image.onload = () => {
      content.value.bgUrl = getBase64Image(image);
      content.value.bgChecked = flag;
    };
  } else {
    content.value.bgUrl = url;
    content.value.bgChecked = flag;
  }
};

const handleUploadChange = (uploadFile: any) => {
  content.value.bgChecked = "custom";
  content.value.customBgUrl = content.value.bgUrl = URL.createObjectURL(
    uploadFile.raw!
  );
};

const handleClearImage = () => {
  upload.value!.clearFiles();
  content.value.customBgUrl = "";
  if (content.value.bgChecked === "custom") {
    content.value.bgUrl = "";
  }
};

const initPoster = async () => {
  if (route.query?.id) {
    const { data } = await getPoster({ wjid: route.query?.id });
    try {
      if (data) {
        content.value = JSON.parse(data);
      } else {
        await initTitle();
      }
    } catch (error) {
      ElMessage.error("问卷格式异常，请重新编辑！");
      router.push({ name: "list" });
    }
  }
};

const initDefaultBackgrounds = () => {
  const imgMap = import.meta.glob("/src/assets/poster-bg/*.png", {
    eager: true,
  });
  for (const key in imgMap) {
    const ele: any = imgMap[key];
    bgImages.value.push({ key, url: ele.default });
  }
};

const initQrCode = () => {
  const opts = {
    errorCorrectionLevel: "H", //容错级别
    type: "image/png", //生成的二维码类型
    quality: 0.3, //二维码质量
    margin: 0, //二维码留白边距
    width: content.value.qrcodeSize, //宽
    height: content.value.qrcodeSize, //高
  };
  QrCode.toCanvas(document.getElementById("qrcode"), source.value, opts);
};

const initTitle = async () => {
  if (route.query?.id) {
    const { data } = await getSurvey(route.query?.id);
    try {
      if (data.wjnr) {
        const formData = JSON.parse(data.wjnr);
        content.value.title = formData.config.title;
      }
    } catch (error) {
      ElMessage.error("问卷格式异常，请重新编辑！");
      router.push({ name: "list" });
    }
  }
};

const handleDownloadPoster = () => {
  content.value.titleTop = titleRef.value.offsetTop;
  content.value.qrcodeTop = qrcodeRef.value.offsetTop;
  content.value.tipTop = tipRef.value.offsetTop;

  outputImage("poster", rexFilter(content.value.title));
};

const handleSavePoster = async () => {
  const { message } = await savePoster({
    wjid: route.query?.id,
    hbnr: JSON.stringify(content.value),
  });
  ElMessage.success(message);
};

onMounted(() => {
  initPoster();
  initDefaultBackgrounds();
  initQrCode();
});
</script>

<style lang="less" scoped>
.poster-designer {
  width: 1280px;
  margin: 0 auto;
  display: flex;
}

.left {
  flex: 1;
  padding: 0 20px 50px;
  border: 1px solid #eeeeee;
  .column-header {
    margin: 10px 0;
    font-size: 16px;
  }

  .bg-img {
    width: 120px;
    height: 200px;
    object-fit: fill;
    cursor: pointer;
  }
}

.upload-icon {
  width: 120px;
  height: 200px;
  border: 1px dashed #d3d3d3;
}

.right {
  width: 400px;
  margin-left: 20px;
}

.poster {
  width: 375px;
  height: 625px;
  margin: 0 auto;
  position: relative;
  border: 1px solid #e0e0e0;
}

.title {
  position: absolute;
  z-index: 99;
  top: 30px;
  width: 100%;
  padding: 0 10px;
  cursor: move;
}

.qrcode {
  position: absolute;
  z-index: 99;
  display: flex;
  justify-content: center;
  top: 420px;
  width: 100%;
  padding: 0 10px;
  cursor: move;
}

.tip {
  position: absolute;
  z-index: 99;
  padding: 0 10px;
  width: 100%;
  cursor: move;
  top: 560px;
}

.clicked {
  display: block;
  position: absolute;
  left: 0;
  top: 0;
  border-radius: 0 0 2px 0;
  background: rgba(0, 0, 0, 0.3);
  font-size: 14px;
  font-weight: 400;
  color: #ffffff;
  padding: 1px 2px;
  line-height: 18px;
}

.delete-icon {
  position: absolute;
  right: 0;
  top: 0;
  font-size: 20px;
  color: #fff;
  background-color: #f55;
}

:deep(.inline-editor) {
  background-color: #d3d3d3;
}

:deep([contenteditable="true"]:focus) {
  background-color: #d3d3d3;
}
</style>

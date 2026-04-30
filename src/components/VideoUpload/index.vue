<template>
  <div :id="`video-upload-${question.id}`" class="py-10px px-20px">
    <el-upload
      drag
      accept="video/*"
      :limit="1"
      :http-request="handleUpload"
      :show-file-list="false"
    >
      <el-icon class="el-icon--upload"><UploadFilled /></el-icon>
      <div class="el-upload__text">
        拖拽视频文件至此或者 <em>点击上传视频</em>
      </div>
    </el-upload>
  </div>
</template>

<script setup lang="ts">
import { nextTick, ref, toRefs } from "vue";
import { UploadFilled } from "@element-plus/icons-vue";
import { uploadVideo } from "@/api/file";
import { ElMessage, ElLoading } from "element-plus";
import { last } from "lodash-es";

const props = withDefaults(
  defineProps<{
    question: any;
  }>(),
  {
    question: () => {},
  }
);

const { question } = toRefs(props);

const handleUpload = async ({ file }) => {
  const check = beforeUpload(file);
  if (!check) return;
  const loadingInstance = ElLoading.service({
    target: `#video-upload-${question.value.id}`,
    text: "上传中，请稍后...",
    background: "rgba(122, 122, 122, 0.8)",
  });
  try {
    const { data, message } = await uploadVideo({
      file,
      data: { fldm: "survey" },
    });
    question.value.attribute["videoId"] = data["indexId"];
    ElMessage.success(message);
  } finally {
    await nextTick(() => {
      loadingInstance.close();
    });
  }
};

const beforeUpload = (file: File) => {
  const type = last(file.name?.split(".") ?? []);
  const isVideo = ["mp4", "avi", "flv", "wmv"].includes(type ?? "unknown");
  if (!isVideo) {
    ElMessage.error("请上传.mp4/.avi/.flv/.wmv格式的视频！");
  }
  return isVideo;
};
</script>

<style lang="less" scoped></style>

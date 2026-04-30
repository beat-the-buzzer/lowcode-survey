<template>
  <div class="w-full">
    <el-upload
      ref="uploader"
      class="mt-10px w-full"
      :accept="attribute.accept.toString()"
      :http-request="handleUpload"
      :show-file-list="false"
    >
      <el-button type="primary" v-if="!readOnly">
        <template #icon>
          <el-icon :size="30">
            <UploadFilled />
          </el-icon>
        </template>
      </el-button>
      <template #tip>
        <div class="text-12px mt-5px text-[#999999]">
          {{ loadTips(attribute) }}
        </div>
      </template>
    </el-upload>
    <div v-if="fileList.length">
      <div
        class="flex items-center justify-between"
        v-for="item in fileList"
        :key="item['url']"
      >
        {{ item["name"] }}
        <el-icon
          v-if="!readOnly"
          class="cursor-pointer"
          color="#f55"
          :size="16"
          @click="onDelete(item)"
        >
          <Delete />
        </el-icon>
        <el-icon
          v-if="true || readOnly"
          class="cursor-pointer"
          :size="16"
          @click="onPreview(item)"
        >
          <View />
        </el-icon>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, unref, watch } from "vue";
import { ElMessage, useFormItem } from "element-plus";
import { Delete, UploadFilled, View } from "@element-plus/icons-vue";
import { isUnDef } from "@/utils/is";
import dict from "@/components/FormDesigner/components/attrDict";
import { uploadFile, previewFile } from "@/api/file";
import { encryptByBase64 } from "@/utils/cipher";

const { formItem } = useFormItem();

const props = withDefaults(
  defineProps<{
    config: any;
    value: any[] | undefined;
    readOnly?: boolean;
  }>(),
  {
    config: () => {},
    value: () => [],
    readOnly: false,
  }
);

const attribute = ref(props.config.children[0].attribute);

const uploader = ref<any>();
const fileList = ref<any[]>([]);

watch(
  () => props.value,
  (value) => {
    if (isUnDef(value)) {
      fileList.value = [];
    } else {
      fileList.value = value
    }
  }
);

const emit = defineEmits(["update:value"]);

const loadTips = (attr: any) => {
  const files = attr.accept.map((item: string) =>
    dict.fileType.find((f: any) => f.value === item)
  );
  const fileTips = files.map((item: any) => item.label).join(",");

  return `文件类型(${fileTips})，文件大小限制${attr.size}M，最多上传${attr.limit}个`;
};

const beforeUpload = (rawFile: any) => {
  const attr = unref(attribute);
  const type = rawFile.name.substring(rawFile.name.lastIndexOf(".") + 1);
  if (rawFile.size / 1024 / 1024 > attr.size) {
    ElMessage.error(`上传文件大小限制为${attr.size}M!`);
    return false;
  }
  const files = attr.accept.map((item: string) =>
    dict.fileType.find((f: any) => f.value === item)
  );
  const fileTypes = files.map((item: any) => item.value).join(",");
  const allAllow = attr.accept.includes("*");
  if (!allAllow && !fileTypes.includes(type)) {
    ElMessage.error(`上传文件只能是${fileTypes}格式!`);
    return false;
  }
  return true;
};

const handleUpload = async ({ file }) => {
  const check = beforeUpload(file);
  if (!check) return;
  const { data } = await uploadFile({
    file,
    // data: { bucket: "wjdc" },
  });
  if (unref(fileList).length >= attribute.value.limit) {
    fileList.value.shift();
  }
  fileList.value.push({
    url: data?.url,
    name: file.name,
    id: data?.id
  });
  emitChange();
};

const onDelete = (file: any) => {
  const index = fileList.value.findIndex((f) => f.url === file.url);
  fileList.value.splice(index, 1);
  emitChange();
};

const onPreview = async (file: any) => {
  const { data } = await previewFile(file.id);
  data?.url && window.open(data?.url, "_target");
};

const emitChange = () => {
  emit("update:value", fileList.value);
  formItem?.validate("change");
};
</script>

<style></style>

<template>
  <div class="w-full">
    <van-signature :key="currKey" @submit="onSubmit" @clear="onClear" v-if="!readOnly" />
    <van-image v-if="image || readOnly" :src="image" />
  </div>
</template>

<script setup lang="ts">
import { ref, unref, watch } from "vue";
import '@vant/touch-emulator'
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
    value: any;
    readOnly?: boolean;
  }>(),
  {
    config: () => {},
    value: () => '',
    readOnly: false,
  }
);
const currKey = ref(new Date().getTime()) // 清空的时候，修改key触发重新加载
const image = ref(null);
const onSubmit = (data) => {
  image.value = data.image || null;
  emit("update:value", image.value);
  formItem?.validate("change");
};
const onClear = () => {
  image.value = null
  currKey.value++
  emit("update:value", image.value);
  formItem?.validate("change");
};

watch(
  () => props.value,
  (value) => {
    image.value = value || null;
  }
);


const emit = defineEmits(["update:value"]);






</script>

<style></style>

<template>
  <div>
    <div
      v-for="(item, index) in data.children"
      :key="item.id"
      class="option"
      :class="{
        active: activeKey === item.id,
      }"
      @click.stop="handleOptionSetting(item, index + 1, 'upload_action')"
    >
      <el-upload class="mt-10px" disabled>
        <el-button type="primary">
          <template #icon>
            <el-icon :size="30">
              <UploadFilled />
            </el-icon>
          </template>
        </el-button>
        <template #tip>
          <div class="text-12px mt-5px text-[#999999]">
            {{ loadTips(item.attribute) }}
          </div>
        </template>
      </el-upload>
    </div>
    <div
      v-if="data.attribute.skip === 'unCondition' && data.attribute.skipPath"
      class="text-sm text-orange-400 text-center"
    >
      {{ skipTarget }}
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";
import { useDesignFormStore } from "@/stores/modules/design";
import { UploadFilled } from "@element-plus/icons-vue";
import dict from "@/components/FormDesigner/components/attrDict";

const props = withDefaults(
  defineProps<{
    data: any;
    questionList: any[];
  }>(),
  {
    data: () => {},
    questionList: () => [],
  }
);

const emit = defineEmits(["optionSet"]);

const activeKey = computed(() => {
  return useDesignFormStore().activeItem.id;
});

const handleOptionSetting = (item: any, index: number, type: string) => {
  emit("optionSet", item, index, type);
};

const skipTarget = computed(() => {
  const { data, questionList } = props;
  if (data.attribute.skipPath === "end") {
    return "无条件跳题：跳至结束";
  } else {
    const index = questionList.findIndex(
      (item) => item.id === data.attribute.skipPath
    );
    return index > -1 ? `无条件跳题：跳转至第${index + 1}题` : "";
  }
});

const loadTips = (attr: any) => {
  const files = attr.accept.map((item: string) =>
    dict.fileType.find((f: any) => f.value === item)
  );
  const fileTips = files.map((item: any) => item.label).join(",");

  return `文件类型(${fileTips})，文件大小限制${attr.size}M，最多上传${attr.limit}个`;
};
</script>
<style lang="less" scoped></style>

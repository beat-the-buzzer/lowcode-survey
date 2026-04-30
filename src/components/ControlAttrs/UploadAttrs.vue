<template>
  <div>
    <div class="control-attr">
      <span>文件类型</span>
      <el-select
        v-model="attrs['accept']"
        multiple
        clearable
        size="small"
        class="!w-150px"
        @change="onTypeChange"
      >
        <el-option
          v-for="opt in attrDict.fileType"
          :key="opt.value"
          :value="opt.value"
          :label="opt.label"
        />
      </el-select>
    </div>
    <div class="control-attr">
      <span>上传数量限制</span>
      <el-input-number
        v-model="attrs['limit']"
        :min="1"
        :max="99"
        size="small"
      />
    </div>
    <div class="control-attr">
      <span>文件大小(M)</span>
      <el-input-number
        v-model="attrs['size']"
        :min="1"
        :max="99"
        size="small"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import attrDict from "@/components/FormDesigner/components/attrDict";
import { useVModel } from "@vueuse/core";

const props = withDefaults(
  defineProps<{
    value: any;
  }>(),
  {
    value: () => {},
  }
);

const emit = defineEmits(["update:value"]);

const attrs = useVModel(props, "value", emit);

const onTypeChange = (val: string) => {
  if (val.length === 0) {
    attrs.value["accept"] = ["*"];
  } else {
    const last = val[val.length - 1];
    if (last === "*") {
      attrs.value["accept"] = ["*"];
    } else {
      attrs.value["accept"] = attrs.value["accept"].filter(
        (item: string) => item !== "*"
      );
    }
  }
};
</script>

<style lang="less" scoped>
.control-attr {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 5px;
}
</style>

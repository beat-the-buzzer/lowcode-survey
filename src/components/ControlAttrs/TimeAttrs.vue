<template>
  <div>
    <div class="control-attr">
      <span>时间类型</span>
      <el-select
        v-model="attrs['type']"
        size="small"
        class="!w-150px"
        @change="onTypeChange"
      >
        <el-option
          v-for="opt in attrDict.timeType"
          :key="opt.value"
          :value="opt.value"
          :label="opt.label"
        />
      </el-select>
    </div>
    <div class="control-attr">
      <span>时间格式</span>
      <el-input
        v-model="attrs['format']"
        size="small"
        class="!w-150px"
      ></el-input>
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
  attrs.value["format"] = attrDict.timeFormat[val];
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

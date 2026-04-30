<template>
  <div>
    <div class="control-attr">
      <span>输入类型</span>
      <el-select v-model="attrs['inputType']" size="small" class="!w-150px">
        <el-option
          v-for="opt in attrDict.inputType"
          :key="opt.value"
          :value="opt.value"
          :label="opt.label"
        />
      </el-select>
    </div>
    <div v-if="attrs['inputType'] === 'string'">
      <div class="control-attr">
        <span>最多填写</span>
        <el-input-number v-model="attrs['maxLength']" :min="1" size="small" />
      </div>
      <div class="control-attr" v-if="false">
        <span>内容限制</span>
        <el-select
          v-model="attrs['regType']"
          size="small"
          clearable
          class="!w-150px"
        >
          <el-option
            v-for="item in validateConfig"
            :key="item.type"
            :value="item.type"
            :label="item.label"
          />
        </el-select>
      </div>
    </div>
    <div v-if="attrs['inputType'] === 'number'">
      <div class="control-attr" v-if="false">
        <span>最小值</span>
        <el-input-number v-model="attrs['minValue']" size="small" />
      </div>
      <div class="control-attr" v-if="false">
        <span>最大值</span>
        <el-input-number v-model="attrs['maxValue']" size="small" />
      </div>
      <div class="control-attr" v-if="false">
        <span>数值精度</span>
        <el-input-number
          v-model="attrs['precision']"
          :min="0"
          :max="3"
          placeholder="0"
          size="small"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import attrDict from "@/components/FormDesigner/components/attrDict";
import validateConfig from "@/utils/validate";
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

console.log(attrs);
</script>

<style lang="less" scoped>
.control-attr {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 5px;
}
</style>

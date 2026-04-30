<template>
  <svg
    v-if="!public"
    ref="svg"
    :style="getStyle"
    aria-hidden="true"
    class="svg-icon"
    v-bind="$attrs"
  >
    <use :xlink:href="symbolId" />
  </svg>
  <object
    v-bind="$attrs"
    v-else
    :data="symbolId"
    :style="getStyle"
    aria-hidden="true"
    class="svg-icon"
  />
</template>

<script lang="ts" setup>
import { computed, type CSSProperties } from "vue";

const props = defineProps({
  prefix: {
    type: String,
    default: "svg-icon",
  },
  name: {
    type: String,
    required: true,
  },
  size: {
    type: [Number, String],
    default: 16,
  },
  public: {
    type: Boolean,
    default: false,
  },
});
const symbolId = computed(() => {
  let data;
  if (props.public) {
  } else {
    data = `#${props.prefix}-${props.name}`;
  }
  return data;
});
const getStyle = computed((): CSSProperties => {
  const { size } = props;
  const s = `${size}`.replace("px", "").concat("px");
  return {
    width: s,
    height: s,
  };
});
</script>

<style lang="less">
.svg-icon {
  overflow: hidden;
  fill: currentColor;
}
</style>

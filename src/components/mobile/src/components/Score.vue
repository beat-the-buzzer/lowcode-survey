<template>
  <div>
    <van-rate
      v-model="score"
      :size="24"
      color="#ffd21e"
      void-icon="star"
      void-color="#eee"
      :count="attribute.maxScore"
      @change="handleChange"
    />
    <div
      class="flex justify-between text-gray-400"
      v-if="attribute.startTip && attribute.endTip"
    >
      <span>{{ attribute.startTip }}</span>
      <span>{{ attribute.endTip }}</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref, watch } from "vue";
import { useFormItem } from "element-plus";
import { isUnDef } from "@/utils/is";

const { formItem } = useFormItem();
const props = withDefaults(
  defineProps<{
    config: any;
    value: number | string;
    readOnly?: boolean;
  }>(),
  {
    config: () => {},
    value: 0,
    readOnly: false,
  }
);

const emit = defineEmits(["update:value", "triggerSkip"]);

const attribute = computed(() => props.config.children[0].attribute);

const score = ref(~~props.value);

watch(
  () => props.value,
  (value) => {
    if (isUnDef(value)) {
      score.value = 0;
    }
  }
);

const isEmpty = ref(true);
watch(
  () => isEmpty.value,
  () => {
    emit("triggerSkip", !isEmpty.value, score.value, props.config);
  }
);

const handleChange = (val: number) => {
  emit("update:value", val);
  formItem?.validate("change");
  isEmpty.value = !val;
};

onMounted(() => {
  score.value = ~~props.value;
});
</script>

<style></style>

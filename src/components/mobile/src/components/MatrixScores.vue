<template>
  <div class="w-full grid grid-cols-1 gap-15px">
    <div v-for="r in config.row" :key="r.id">
      <div v-html="r.title"></div>
      <div class="grid grid-cols-1 gap-10px mt-10px">
        <div v-for="c in config.children" :key="c.id">
          <div class="flex items-center gap-10px">
            <div class="flex-1" v-html="c.title"></div>
            <van-stepper
              v-model="scoreMap[r.id][c.id]"
              :min="1"
              :max="config.attribute.maxScore"
              default-value=""
              allow-empty
              integer
              @change="handleNumberChange"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref, unref, watch } from "vue";
import { useFormItem } from "element-plus";
import { isUnDef } from "@/utils/is";

const { formItem } = useFormItem();

const props = withDefaults(
  defineProps<{
    config: any;
    value: any;
    readOnly?: boolean;
  }>(),
  {
    config: () => {},
    value: () => {},
    readOnly: false,
  }
);

const emit = defineEmits(["update:value", "triggerSkip"]);

const scoreMap = ref<any>({});

watch(
  () => props.value,
  (value) => {
    isUnDef(value) && initScoreMap();
  }
);

// 初始化数据结构
const initScoreMap = () => {
  props.config.row.map((item: any) => {
    scoreMap.value[item.id] = {};
    props.config.children.map((c: any) => {
      scoreMap.value[item.id][c.id] = undefined;
    });
  });
};

initScoreMap();

const isEmpty = ref(true);

watch(
  () => isEmpty.value,
  () => {
    emit("triggerSkip", !isEmpty.value, scoreMap.value, props.config);
  }
);

const handleNumberChange = () => {
  const _value = unref(scoreMap.value);
  emit("update:value", _value);
  formItem?.validate("change");
  isEmpty.value = Object.values(_value).length === 0;
};

onMounted(() => {
  const { value } = props;
  if (value) {
    scoreMap.value = value;
  }
});
</script>

<style lang="less" scoped></style>

<template>
  <div class="w-full">
    <transition-group name="sort-list">
      <div
        v-for="(item, index) in optionsList"
        :key="item.id"
        class="flex items-center justify-between w-full"
      >
        <div class="flex items-center w-full">
          <div
            class="sort-checkbox mr-10px cursor-pointer"
            :class="{ active: checkedIndex(item.id) > -1 }"
            @click.stop="handleClick(item, item.attribute.exclusion)"
          >
            {{ checkedIndex(item.id) > -1 ? checkedIndex(item.id) + 1 : "" }}
          </div>
          <div class="whitespace-pre-wrap" v-html="item.title"></div>
        </div>
        <div class="flex items-center">
          <el-button
            circle
            size="small"
            type="primary"
            v-if="checkedIndex(item.id) > -1 && index > 0"
            @click.stop="handleUp(item.id, index)"
          >
            <el-icon size="16"><Top /></el-icon>
          </el-button>
          <el-button
            circle
            size="small"
            type="primary"
            v-if="checkedIndex(item.id) > -1 && index < checked.length - 1"
            @click.stop="handleDown(item.id, index)"
          >
            <el-icon size="16"><Bottom /></el-icon>
          </el-button>
        </div>
      </div>
    </transition-group>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, unref, watch, onMounted } from "vue";
import { useFormItem } from "element-plus";
import { Bottom, Top } from "@element-plus/icons-vue";
import { intersection } from "lodash-es";
import { isArray, isUnDef } from "@/utils/is";

const { formItem } = useFormItem();

const props = withDefaults(
  defineProps<{
    config: any;
    value: any[];
    readOnly?: boolean;
  }>(),
  {
    config: () => {},
    value: () => [],
    readOnly: false,
  }
);

const checked = ref<any[]>([]);

watch(
  () => props.value,
  (value) => {
    if (isUnDef(value)) {
      checked.value = [];
    }
  }
);

const optionsList = ref<any[]>(props.config.children);
const exclusionList = computed(() =>
  props.config.children
    .filter((item: any) => item.attribute.exclusion)
    .map((item: any) => item.id)
);

const checkedIndex = (id: string) => {
  return checked.value.findIndex((e) => e.value === id);
};

const handleClick = (target: any, exclusion: boolean | undefined) => {
  const current = unref(checked.value);
  if (current.findIndex((e) => e.value === target.id) === -1) {
    const _value = { value: target.id };
    if (target.attribute.addInput) {
      _value["addition"] = "";
    }
    // 互斥判断
    const arr = intersection(
      current.map((item) => item.value),
      exclusionList.value
    );
    if (arr.length > 0) {
      checked.value = [_value];
    } else {
      if (exclusion) {
        checked.value = [_value];
      } else {
        checked.value.push(_value);
      }
    }

    sortByAddChecked(optionsList.value, checked.value);
    handleChange(checked);
  } else {
    checked.value = checked.value.filter(
      (item: any) => item.value !== target.id
    );
    sortByAddChecked(optionsList.value, checked.value);
    handleChange(checked.value);
  }
};

// 勾选排序
const sortByAddChecked = (arr1: any[], arr2: any[]) => {
  const _checked = arr2.map((item) => item.value);
  const inBoth = (el: string) =>
    arr1.findIndex((item: any) => item.id === el) !== -1 &&
    _checked.indexOf(el) !== -1;
  const sorter = (a: any, b: any) => {
    if (inBoth(a.id) && inBoth(b.id)) {
      return _checked.indexOf(a.id) - _checked.indexOf(b.id);
    }
    if (inBoth(a.id)) {
      return -1;
    }
    if (inBoth(b.id)) {
      return 1;
    }
    return 0;
  };
  arr1.sort(sorter);
};

const handleUp = async (id: string, index: number) => {
  const target = checked.value.find((item) => item.value === id);
  checked.value.splice(index - 1, 0, target);
  checked.value.splice(index + 1, 1);
  sortByAddChecked(optionsList.value, checked.value);
  handleChange(checked.value);
};
const handleDown = async (id: string, index: number) => {
  const target = checked.value.find((item) => item.value === id);
  checked.value.splice(index + 2, 0, target);
  checked.value.splice(index, 1);
  sortByAddChecked(optionsList.value, checked.value);
  handleChange(checked.value);
};

const emit = defineEmits(["update:value", "triggerSkip"]);

const isEmpty = ref(true);
watch(
  () => isEmpty.value,
  () => {
    emit("triggerSkip", !isEmpty.value, checked.value, props.config);
  }
);

const handleInput = () => {
  emit("update:value", checked.value);
  formItem?.validate("change");
};

const handleChange = (val: any) => {
  emit("update:value", val);
  formItem?.validate("change");
  isEmpty.value = !(checked.value.length > 0);
};

const initValue = () => {
  const { value } = props;
  if (value && isArray(value)) {
    checked.value = value;
  }
};

onMounted(() => {
  initValue();
});
</script>

<style lang="less" scoped>
.sort-checkbox {
  width: 20px;
  height: 20px;
  border: 1px solid #a6a6a6;
  text-align: center;
  line-height: 20px;
  border-radius: 2px;
}
.sort-checkbox.active {
  background-color: #0095ff;
  border-color: #0095ff;
  color: #fff;
}
.sort-list-move {
  transition: transform 0.5s;
}
</style>

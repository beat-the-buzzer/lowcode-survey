<!-- eslint-disable vue/no-mutating-props -->
<template>
  <div>
    <div
      v-for="(item, index) in data.children"
      :key="item.id"
      class="blanks-option"
      :class="{
        active: activeKey === item.id,
      }"
    >
      <InlineEditor
        ref="editorRef"
        v-model:modelValue="item.attribute.content"
        class="w-full"
        @change="handleChange(item.attribute.content, item, index + 1)"
        @click.stop="handleOptionSetting(item, index + 1, 'blanks')"
      />
      <div v-if="activeKey === item.id" class="ml-20px">
        <el-button @click.stop="handleInsert" type="primary" size="small"
          >插入填空符</el-button
        >
        <span class="ml-20px text-xs text-gray-500"
          >（填空符用连续3个下划线表示，点击按钮可在光标处插入填空符）</span
        >
      </div>
      <el-dialog v-model="visible" title="填空属性" width="500px">
        <span>This is a message</span>
      </el-dialog>
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
import { ref, onMounted, toRefs, computed } from "vue";
import { rexFilter } from "@/utils/transform";
import { buildShortUUID } from "@/utils/uuid";
import { useDesignFormStore } from "@/stores/modules/design";
import InlineEditor from "@/components/InlineEditor";

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

const editorRef = ref<any>(null);
const visible = ref(false);
const activeKey = computed(() => {
  return useDesignFormStore().activeItem.id;
});

const emit = defineEmits(["optionSet"]);

const { data } = toRefs(props);

// 匹配___获取填空的个数
const createOptions = (htmlStr: string, item: any) => {
  let _children: any[] = [];
  // const str = rexFilter(htmlString);
  const reg = new RegExp(/(_)\1{2,}/g);
  let tempArr = htmlStr.match(reg) || [];
  tempArr.map((e: string) => {
    _children.push({
      id: buildShortUUID(),
      attribute: {
        width: 150,
        inputType: "string",
      },
      length: e.length,
    });
  });
  item.children = _children;
};

const handleChange = (htmlStr: string, item: any, index: number) => {
  createOptions(htmlStr, item);
  emit("optionSet", item, index, "blanks");
};

const handleInsert = () => {
  editorRef.value && editorRef.value[0]?.insertText("___");
};

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

onMounted(() => {
  if (!props.data.children[0]?.children) {
    createOptions(
      props.data.children[0]?.attribute?.content,
      props.data.children[0]
    );
  }
});
</script>

<style lang="less" scoped>
.blanks-option {
  border: 1px dashed transparent;
  padding: 5px;
}
.blanks-option.active {
  border: 1px dashed #66b1ff;
}
</style>

<template>
  <div class="w-full">
    <BlanksContent
      :value="value"
      @blank-input="handleBlankChange"
    ></BlanksContent>
  </div>
</template>

<script setup lang="ts">
import { defineComponent, ref, watch, onMounted } from "vue";
import { useFormItem, ElInput, ElInputNumber } from "element-plus";
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

const content = ref("");

// html输入框替换
const renderData = () => {
  let _content = props.config.children[0].attribute.content;
  const reg = new RegExp(/(_)\1{2,}/g);
  let tempArr = _content.match(reg) || [];
  tempArr.map((item: any, index: number) => {
    const child = props.config.children[0].children[index];
    const inputComponent = `
            <el-input
              v-model="inputMap['${child.id}']"
              :disabled="${props.readOnly}"
              class="mx-10px"
              style="width:${child.attribute.width || 150}px"
              show-word-limit
              maxlength="${child.attribute.maxLength || ""}"
              @input="handleInput"
            >
              <template #prefix v-if="${child.attribute.required}">
                <span class="text-red-500">*</span>
              </template>
            </el-input>`;

    const inputNumberComponent = `
      <span class="text-red-500">${child.attribute.required ? "*" : ""}</span>
      <el-input-number
        v-model="inputMap['${child.id}']"
        :disabled="${props.readOnly}"
        class="mx-10px"
        :min="${child.attribute.minValue}"
        :max="${child.attribute.maxValue}"
        :precision="${child.attribute.precision ?? 0}"
        @change="handleInput"
      />
    `;
    _content = _content.replace(
      item,
      child.attribute.inputType === "number"
        ? inputNumberComponent
        : inputComponent
    );
  });
  content.value = _content;
};

renderData();

// 填空题内容，html转组件
const BlanksContent = defineComponent({
  name: "BlanksContent",
  // eslint-disable-next-line vue/no-unused-components
  components: { ElInput, ElInputNumber },
  template: content.value,
  props: {
    config: {
      type: Object,
      default: () => {},
    },
    value: {
      type: Object,
      default: () => {},
    },
  },
  emits: ["blank-input"],
  setup(props, { emit }) {
    const inputMap = ref<any>({});

    watch(
      () => props.value,
      (value) => {
        if (isUnDef(value)) {
          inputMap.value = {};
        }
      }
    );

    const handleInput = () => {
      emit("blank-input", inputMap.value);
    };

    onMounted(() => {
      inputMap.value = props.value ?? {};
    });

    return {
      inputMap,
      handleInput,
    };
  },
});

const isEmpty = ref(true);

watch(
  () => isEmpty.value,
  () => {
    emit("triggerSkip", !isEmpty.value, content.value, props.config);
  }
);

const handleBlankChange = (val: any) => {
  emit("update:value", val);
  formItem?.validate("change");
  isEmpty.value = !Object.values(val).some((item) => !!item);
};
</script>

<style></style>

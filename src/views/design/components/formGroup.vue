<template>
  <draggable
    itemKey="id"
    :list="data"
    name="fade"
    class="drag"
    v-bind="{
      group: 'form',
      ghostClass: 'ghost',
      animation: 200,
      handle: '.drag-move',
    }"
    @add="draggableAdd"
    @end="draggableEnd"
    :move="draggableMove"
  >
    <template #item="{ element, index }">
      <div
        class="group"
        :class="{
          active: activeKey === element.id,
        }"
        @click.stop="groupClick(element, index)"
      >
        <form-item
          :data="element"
          :config="config"
          :index="getIndex(element)"
          :active="activeKey === element.id"
          :questionList="questionList"
          @set-option="handleSetOption"
        />
        <div class="drag-control">
          <div class="item-control">
            <div class="drag-move iconfont icon-lujing172" title="拖拽"></div>
            <i
              class="iconfont icon-lujing182"
              @click.stop="handleCopyOrDel('clone', index, element)"
              v-if="element.type !== 'pagination'"
              title="克隆"
            ></i>
            <i
              class="iconfont icon-lujing58"
              title="删除"
              @click.stop="handleCopyOrDel('del', index)"
            ></i>
          </div>
        </div>
      </div>
    </template>
  </draggable>
</template>

<script lang="ts" setup>
import { reactive, computed, ref, toRefs } from "vue";
import draggable from "vuedraggable-es";
import FormItem from "./formItem.vue";
import { useDesignFormStore } from "@/stores/modules/design";
import { buildShortUUID } from "@/utils/uuid";
import { forcePagination, handleAddPagination } from "./formUtils";

const props = withDefaults(
  defineProps<{
    data: [];
    config: any;
  }>(),
  {
    data: () => [],
    config: () => {},
  }
);

const { data, config } = toRefs(props);

const store = useDesignFormStore();

const questionList = computed(() => {
  return props.data.filter(
    (item) => !["pagination", "paragraph"].includes(item.type)
  );
});

const activeKey = computed(() => {
  return store.activeItem.id;
});

// 获取问题编号
const getIndex = (item: any) => {
  return questionList.value.findIndex((e: any) => e.id === item.id);
};

// 删除或复制
const handleCopyOrDel = (type: string, index: number, item?: any) => {
  if (type === "clone") {
    const key = buildShortUUID();
    const newItem = JSON.parse(JSON.stringify(item))
    // 替换所有子组件id
    if (newItem.children && newItem.children.length > 0) {
      newItem.children = replaceOptionsId(newItem.children);
    }
    if (newItem.row && newItem.row.length > 0) {
      newItem.row = replaceOptionsId(newItem.row);
    }
    data.value.splice(index, 0, Object.assign(newItem, { id: key }));
  } else if (type === "del") {
    data.value.splice(index, 1);
    // 清空右侧栏信息
    store.setActiveItem({});
  }
  if (config.value?.forcePagination) {
    store.setFormList(forcePagination(data.value));
  }
};

const replaceOptionsId = (options: any[]) => {
  for (let i = 0; i < options.length; i++) {
    options[i].id = buildShortUUID();
    if (options[i].children && options[i].children.length > 0) {
      options[i].children = replaceOptionsId(options[i].children);
    }
  }
  return options;
};

// 拖拽新增完成
const draggableAdd = (evt: any) => {
  console.log(evt)
  const newIndex = evt.newIndex;
  const obj: any = data.value[newIndex];
  if (obj.type === "pagination") {
    handleAddPagination(data.value);
  } else {
    groupClick(data.value[newIndex], newIndex);
    if (config.value?.forcePagination) {
      store.setFormList(forcePagination(data.value));
    }
  }
};

// 拖拽结束
const draggableEnd = () => {
  console.log('不会是执行了这个把')
  if (data.value.findIndex((item: any) => item.type === "pagination") > -1) {
    handleAddPagination(data.value);
  }
  if (config.value?.forcePagination) {
    store.setFormList(forcePagination(data.value));
  }
};
// 拖动过程
const draggableMove = (e: any) => {
  if (
    e.relatedContext.element?.type === "pagination" &&
    e.relatedContext.index === 0
  ) {
    return false;
  }
};

// 点击激活当前问题
const groupClick = (item: any, index: number) => {
  store.setActiveItem({
    ...item,
    name:
      item.type === "pagination"
        ? `分页-第${item.attribute.current}页设置`
        : item.type === "paragraph"
        ? "文字描述"
        : `Q${getIndex(item) + 1}问题设置`,
  });
};

// 点击激活当前问题控件设置
const handleSetOption = (item: any, info: any) => {
  store.setActiveItem({
    id: item.id,
    type: info.type,
    name: `Q${info.quesIndex + 1}-选项${info.optionIndex}设置`,
    attribute: item.attribute,
    children: item.children,
  });
};
</script>

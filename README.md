## 拖一拖控件，拖出个问卷——手把手教你写一个低代码平台

代码地址：XXXX

演示地址：XXXX

技术栈：vue3、element-plus、pinia、vuedraggable

参考项目：XXX

### 什么是低代码平台

### 项目搭建

1. vue-cli 新建一个项目 包含 vue-router 和 pinia

2. 页面结构分解和数据结构设计

- 左侧控件区域
- 中部问卷展示区域
- 右侧控件属性编辑区

数据结构其实并不复杂，问卷的主体就是一个list，list里面的对象就是题目，都是前端定义，前端使用，服务端只是存一下。



```js
{
  list: [],
  config: {
    title: '问卷标题',
  },
}
```


参考项目，从这个项目里分离出一个最简单的版本。

画一个思维导图，分析一下这个系统的代码架构：

- 页面结构设计：

左侧控件区域和大纲
中部问卷展示区域
右侧控件属性编辑区

数据结构：

使用 pinia 创建问卷的数据

```js
{
	list: [], // 问卷内容 里面存的属性都是前端定义、前端使用，服务端只是存一下·
  config: {
    title: '问卷标题',
	  // 问卷其他涉及到的属性都可以放在这里
	},
}
```

### 核心点一：拖动控件，生成页面

```ts
import Draggable from "vuedraggable-es";
```

关键代码：

```vue
<draggable
  itemKey="key123"
  tag="ul"
  v-model="list.children"
  :group="{ name: 'form', pull: 'clone', put: false }"
  ghost-class="ghost"
  :sort="false"
  :clone="clone"
  :distance="1"
  :move="handleMove"
>
</draggable>
```

关键点：clone模式的用法，拖动的节点数据会被复制。

这里设置的 name 非常关键，在中间的问卷主体里，是这样写的：

```vue
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
</draggable>
```

group 的 name 对应上，才能拖到指定位置，释放时候触发了 add 方法，会把 clone 的数据带过去，我们在 draggableAdd 里修改 store 里的数据。

```js
const draggableAdd = (evt: any) => {
  console.log(evt)
  const newIndex = evt.newIndex;
  const obj: any = data.value[newIndex];
  if (obj.type === "pagination") {
    handleAddPagination(data.value);
  } else {
    groupClick(data.value[newIndex], newIndex);
  }
};
```

### 核心点二：给控件添加定制化的属性

store 里面用 currentItem 去标识当前选中的数据，然后根据不同的type展示不同的定制化属性，最终这些定制化属性都会保存到store里。

### 核心点三：成果页面的展示逻辑

本质上就是把配置好的问卷用表单的形式展示出来：

type 就是题目类型，根据这个 type 渲染不同的组件

```vue
<SingleChoice 
  :config="question"
  :read-only="readOnly"
  @trigger-skip="handleTriggerSkip"
  v-if="question.type === 'single_choice'"
></SingleChoice>
<MultChoice 
  :config="question"
  :read-only="readOnly"
  @trigger-skip="handleTriggerSkip"
  v-else-if="question.type === 'mult_choice'"
></MultChoice> 
```

可以使用 `component` is 属性，不在这里使用大量的v-if语句：

```vue
<component
  v-model:value="formModel[question.id]"
  :config="question"
  :read-only="readOnly"
  :is="dom[question.type]"
  @trigger-skip="handleTriggerSkip"
></component>
```

```js
export { default as mult_text } from "./MultText.vue";
export { default as single_choice } from "./SingleChoice.vue";
export { default as mult_choice } from "./MultChoice.vue";

import * as Elements from "./export";
```

## 总结


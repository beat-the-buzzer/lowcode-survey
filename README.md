### 什么是低代码平台

低代码指的是一种通过可视化拖拽、组件复用，并结合少量代码配置，来快速构建应用程序的开发模式。其核心并非完全消除代码，而是将开发者从重复、底层的“手工劳动”中解放出来，转向“装配式开发”。换句话说，开发者从“开发一些页面”变成了“开发一个工具”，使用这个工具的人不仅仅是开发人员，不了解技术的运营人员也可以使用，根据自己的需要生成一个页面。

更准确地说，低代码开发平台是将底层架构、基础设施和通用能力抽象为图形化界面，以可视化设计为主、少量代码为辅，覆盖应用从设计、开发、测试、部署到运维全生命周期的一站式工具集。

下面是一个简单的问卷低代码平台，以此为例简单介绍一下技术重点。

[拖一拖控件，拖出个问卷（低代码平台）](https://juejin.cn/post/7634732507103313966)


[代码地址：https://github.com/beat-the-buzzer/lowcode-survey.git](https://github.com/beat-the-buzzer/lowcode-survey.git)

[演示地址：https://beat-the-buzzer.github.io/lowcode-survey/#/design/xg](https://beat-the-buzzer.github.io/lowcode-survey/#/design/xg)

技术栈：vue3、element-plus、pinia、vuedraggable

### 页面结构和项目搭建

页面结构设计：

*   左侧控件区域
*   中部问卷展示区域
*   右侧控件属性编辑区

数据结构设计：

数据结构其实并不复杂，问卷的主体就是一个list，list里面的对象就是题目，都是前端定义，前端使用，服务端只是存一下。

使用 pinia 创建问卷的数据：

```js
{
  list: [], // 问卷内容 里面存的属性都是前端定义、前端使用，服务端只是存一下·
  config: {
    title: '问卷标题',
	// 问卷其他涉及到的属性都可以放在这里
  },
}
```

### 核心技术点一：拖动控件，生成页面

```ts
import Draggable from "vuedraggable-es";
```

关键代码：

```html
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

```html
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

### 核心技术点二：给控件添加定制化的属性

store 里面用 currentItem 去标识当前选中的数据，然后根据不同的type展示不同的定制化属性，最终这些定制化属性都会保存到store里。

```html
<div
    v-if="
      showHide(['input', 'matrix_blanks_input'], true) ||
      (showHide(['table_column'], true) &&
        controlItem.attribute.dataType === 'text')
    "
    >
    <InputAttrs v-model:value="controlItem.attribute" />
    </div>
    <!-- 时间选择     -->
    <div v-if="showHide(['timepicker'], true)">
    <TimeAttrs v-model:value="controlItem.attribute" />
</div>
```

根据不同的类型展示不同的条件。

### 核心技术点三：成果页面的展示逻辑

本质上就是把配置好的问卷用表单的形式展示出来：

type 就是题目类型，根据这个 type 渲染不同的组件

```html
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

```html
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

### 其他难点以及后续改良方向

1.  数据如何回收

目前的结构里，每一道题目都有一个id，数据给服务端的时候，服务端很难将其转成有意义的字段。

改进方向：允许编辑id，使其变成服务端可识别的字段。

2.  难以做后端校验

问卷的结构目前是前端定义，前端解析，后端只是做了一个存和取的过程，因此到实际的问卷填报时，都是前端去做校验。如果后端做校验，就需要前端告知数据的结构，然后后端再把校验的逻辑写一遍。

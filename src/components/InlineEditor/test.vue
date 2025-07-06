<template>
  <div>
    <!--    <editor-->
    <!--      v-if="active"-->
    <!--      ref="inlineRef"-->
    <!--      v-model="content"-->
    <!--      tag-name="div"-->
    <!--      :init="simple_init"-->
    <!--      class="inline-editor"-->
    <!--      @blur="onBlur"-->
    <!--    />-->
    <div
      :id="id"
      class="preview-html"
      v-html="content"
      @click="onFocus"
      @blur="onBlur"
    />
    <el-dialog v-model="dialogVisible" width="800px">
      <editor
        v-if="dialogVisible"
        v-model="content"
        tag-name="div"
        :init="all_init"
      />
    </el-dialog>
  </div>
</template>
<script setup lang="ts">
import tinymce from "tinymce/tinymce";
import Editor from "@tinymce/tinymce-vue";
import { nextTick, ref, watch } from "vue";
import "./load_plugins";
import { buildShortUUID } from "@/utils/uuid";

const props = defineProps({
  modelValue: String,
  placeholder: String,
});

const emit = defineEmits(["update:modelValue", "change"]);

const dialogVisible = ref(false);
const publicPath =  "/"; // import.meta.env.VITE_BASE_URL ||
const active = ref(false);
const id = ref(buildShortUUID("editor"));

// 配置
const simple_init: any = {
  selector: `#${id.value}`,
  inline: true,
  auto_focus: true,
  language_url: publicPath + "static/plugins/tinymce/langs/zh_CN.js", // 中文语言包路径
  language: "zh_CN",
  skin_url: publicPath + "static/plugins/tinymce/skins/ui/oxide", // 编辑器皮肤样式
  content_css: false,
  menubar: false, // 隐藏菜单栏
  autoresize_bottom_margin: 50,
  // height: 320,
  toolbar_mode: "none",
  plugins:
    "preview searchreplace autolink directionality visualblocks visualchars fullscreen image link media code codesample table charmap pagebreak nonbreaking anchor insertdatetime advlist lists wordcount autosave ",
  toolbar:
    "fontsize forecolor backcolor bold italic underline removeformat | aligncenter alignleft alignright lineheight | undo redo | fullscreenplus",
  font_size_formats: "12px 14px 16px 18px 24px 36px 48px 56px 72px",
  font_formats:
    "微软雅黑=Microsoft YaHei,Helvetica Neue,PingFang SC,sans-serif;苹果苹方= PingFang SC, Microsoft YaHei, sans- serif; 宋体 = simsun, serif; 仿宋体 = FangSong, serif; 黑体 = SimHei, sans - serif; Arial = arial, helvetica, sans - serif;Arial Black = arial black, avant garde;Book Antiqua = book antiqua, palatino; ",
  branding: false,
  elementpath: false,
  resize: false, // 禁止改变大小
  statusbar: false, // 隐藏底部状态栏
  placeholder: props.placeholder,
  // 粘贴去除格式
  paste_auto_cleanup_on_paste: true,
  paste_remove_styles: true,
  paste_remove_styles_if_webkit: true,
  paste_strip_class_attributes: true,
  paste_as_text: true,
  setup: (editor: any) => {
    // 自定义工具栏按钮
    editor.ui.registry.addButton("fullscreenplus", {
      icon: "fullscreen",
      tooltip: "全屏",
      onAction: (_) => {
        dialogVisible.value = true;
        // @ts-ignore
        tinymce.init(all_init); // 初始化
      },
    });
  },
  init_instance_callback: (editor: any) => {
    // 失去焦点销毁
    editor.on("blur", () => {
      editor.remove();
    });
    editor.on("NodeChange Change KeyUp SetContent", () => {
      emit("update:modelValue", editor.getContent());
    });
  },
};

const custom_image_upload_handler = (blobInfo: any) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(blobInfo.blob());
    reader.onload = (file: any) => {
      resolve(file.currentTarget.result);
    };
  });

const all_init = {
  language_url: publicPath + "static/plugins/tinymce/langs/zh_CN.js", // 中文语言包路径
  language: "zh_CN",
  skin_url: publicPath + "static/plugins/tinymce/skins/ui/oxide", // 编辑器皮肤样式
  content_css: false,
  menubar: false, // 隐藏菜单栏
  autoresize_bottom_margin: 50,
  max_height: 500,
  min_height: 450,
  // height: 320,
  toolbar_mode: "sliding",
  plugins:
    "preview searchreplace autolink directionality visualblocks visualchars fullscreen image link media code codesample table charmap pagebreak nonbreaking anchor insertdatetime advlist lists wordcount autosave ",
  toolbar:
    "undo redo restoredraft | forecolor backcolor bold italic underline strikethrough link anchor table image | alignleft aligncenter alignright alignjustify outdent indent | styleselect formatselect fontselect fontsizeselect | bullist numlist | blockquote subscript superscript removeformat | media charmap emoticons insertdatetime | indent2em lineheight formatpainter axupimgs",
  font_size_formats: "12px 14px 16px 18px 24px 36px 48px 56px 72px",
  font_formats:
    "微软雅黑=Microsoft YaHei,Helvetica Neue,PingFang SC,sans-serif;苹果苹方= PingFang SC, Microsoft YaHei, sans- serif; 宋体 = simsun, serif; 仿宋体 = FangSong, serif; 黑体 = SimHei, sans - serif; Arial = arial, helvetica, sans - serif;Arial Black = arial black, avant garde;Book Antiqua = book antiqua, palatino; ",
  branding: false,
  elementpath: false,
  promotion: false,
  resize: false, // 禁止改变大小
  statusbar: false, // 隐藏底部状态栏
  placeholder: props.placeholder,
  images_upload_handler: custom_image_upload_handler,
};

// @ts-ignore
const content = ref(props.modelValue);
watch(props, (newVal) => (content.value = newVal.modelValue));
watch(content, (newVal) => {
  emit("update:modelValue", newVal);
  emit("change", newVal);
});

const insertText = (str: string) => {
  tinymce.activeEditor?.execCommand("mceInsertContent", false, str);
};

const onFocus = () => {
  tinymce.init(simple_init); // 初始化
  // nextTick(() => {
  //   inlineRef.value.getEditor().focus(true);
  // });
};

const onBlur = () => {
  active.value = false;
};

defineExpose({
  insertText,
});
</script>
<style>
.tox-tinymce-aux {
  z-index: 2200 !important; /*el-dialog层为2014，默认时在el弹出层显示不了编辑器里的弹窗*/
}
</style>
<style lang="less" scoped>
.preview-html {
  min-height: 33px;
  padding: 5px;
  margin: 5px;
  border: 1px solid transparent;
}
.preview-html:hover {
  background-color: #f4f4f4;
  border: 1px dashed #335dff;
}

.inline-editor {
  border: 1px solid transparent;
  padding: 5px;
  margin: 5px;
  :deep(img, svg, canvas) {
    display: inline-block !important;
  }
}
.inline-editor:hover {
  border: 1px dashed #335dff;
}
[contenteditable="true"]:focus {
  outline: none;
  background-color: #f4f4f4;
  border: 1px solid #335dff;
}

@keyframes axisX {
  from {
    transform: translateX(-100%);
  }
  to {
    transform: translateX(0px);
  }
}

.switch-enter-active {
  animation: axisX 0.5s;
}

.switch-leave-active {
  animation: axisX 0.5s reverse;
}
</style>

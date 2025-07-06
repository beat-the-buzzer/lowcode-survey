import type { Editor, RawEditorOptions } from "tinymce";
import { custom_image_upload_handler } from "./utils";

const publicPath = "/"; // import.meta.env.VITE_BASE_URL || 

export const inline_init: RawEditorOptions = {
  inline: true,
  language_url: publicPath + "static/plugins/tinymce/langs/zh_CN.js", // 中文语言包路径
  language: "zh_CN",
  skin_url: publicPath + "static/plugins/tinymce/skins/ui/oxide", // 编辑器皮肤样式
  content_css: false,
  menubar: false, // 隐藏菜单栏
  autoresize_bottom_margin: 50,
  // height: 320,
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
  // 粘贴去除格式
  paste_auto_cleanup_on_paste: true,
  paste_remove_styles: true,
  paste_remove_styles_if_webkit: true,
  paste_strip_class_attributes: true,
  paste_as_text: true,
};

export const all_init: RawEditorOptions = {
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
  images_upload_handler: custom_image_upload_handler,
};

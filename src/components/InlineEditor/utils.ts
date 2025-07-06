import type { Editor } from "tinymce";
import { watch } from "vue";

// 图片上传
export const custom_image_upload_handler = (blobInfo: any): Promise<string> =>
  new Promise((resolve, reject) => {
    try {
      const reader = new FileReader();
      reader.readAsDataURL(blobInfo.blob());
      reader.onload = (file: any) => {
        resolve(file.currentTarget.result);
      };
    } catch (e) {
      reject(e);
    }
  });

export const setValue = (editor: Editor, val: string) => {
  if (editor) {
    editor.setContent(val);
  }
};

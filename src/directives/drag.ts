import { App, Directive } from "vue";
import debounceInputDirective from "@/directives/debounceInput";

const dragDirective: Directive = {
  mounted(el: HTMLElement, binding: any) {
    // 当前拖拽元素
    const moveEl: HTMLElement = el;
    // 父元素
    const parent: HTMLElement = el.parentNode;
    // 可移动范围
    const rangeWidth = parent.clientWidth;
    const rangeHeight = parent.clientHeight;

    // 禁止选择网页上的文字
    // document.onselectstart = () => {
    //   return false;
    // };

    moveEl.onmousedown = (e: MouseEvent) => {
      // 鼠标按下，计算当前元素距离可视区的距离
      const disX = e.clientX - moveEl.offsetLeft;
      const disY = e.clientY - moveEl.offsetTop;
      const moveLeft = rangeWidth - moveEl.clientWidth;
      const moveTop = rangeHeight - moveEl.clientHeight;

      document.onmousemove = (event: MouseEvent) => {
        // 计算移动距离
        const left = event.clientX - disX;
        const top = event.clientY - disY;
        // 如果元素的移动位置大于窗口位置，则不再移动
        if (left - moveLeft) {
          moveEl.style.left = `${moveLeft}px`;
        } else {
          moveEl.style.left = `${left}px`;
        }
        if (left < 0) {
          moveEl.style.left = "0px";
        }
        if (top > moveTop) {
          moveEl.style.top = `${moveTop}px`;
        } else {
          moveEl.style.top = `${top}px`;
        }
        if (top < 0) {
          moveEl.style.top = "0px";
        }
      };

      document.onmouseup = (event: MouseEvent) => {
        document.onmousemove = null;
        document.onmouseup = null;
      };

      return false;
    };
  },
};

export function setupDragDirective(app: App) {
  app.directive("drag", dragDirective);
}

export default dragDirective;

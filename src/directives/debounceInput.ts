// @ts-nocheck
/* 
  输入框防抖(远程搜索)
*/
import type { Directive, App } from "vue";

// 输入法输入监测
function compositionStart(event: CompositionEvent) {
  event.target.composing = true;
}
function compositionEnd(e: CompositionEvent) {
  e.target.composing = false;
  const event = new Event("input", { bubbles: true });
  e.target?.dispatchEvent(event);
}

function debounce(
  input: (event: Event) => any,
  timeout: number
): (this: HTMLElement, ev: Event) => any {
  let timer: string | number | NodeJS.Timeout | undefined;
  return (event: Event) => {
    if (event.target.composing === true) {
      return;
    }
    if (timer) {
      clearTimeout(timer);
      timer = undefined;
    }
    timer = setTimeout(() => {
      input(event);
      clearTimeout(timer);
      timer = undefined;
    }, timeout);
  };
}

function isFunction(param: any): boolean {
  return Object.prototype.toString.call(param) === "[object Function]";
}

let inputFunction: (event: Event) => {};

function findInput(el: HTMLElement): HTMLElement | null {
  const quene: HTMLElement[] = [];
  quene.push(el);
  while (quene.length > 0) {
    const current = quene.shift();
    if (current?.tagName === "INPUT") {
      return current;
    }
    if (current?.childNodes) {
      quene.push(...current.childNodes);
    }
  }
  return null;
}

const debounceInputDirective: Directive = {
  mounted(el: HTMLElement, binding: any) {
    const { value, arg } = binding;
    if (value && isFunction(value)) {
      let timeout = 600;
      if (arg && !Number.isNaN(arg)) {
        timeout = Number(arg);
      }
      inputFunction = debounce(value, timeout);
      const input = findInput(el);
      el._INPUT = input;
      if (input) {
        input.addEventListener("input", inputFunction);
        input.addEventListener("compositionstart", compositionStart);
        input.addEventListener("compositionend", compositionEnd);
      }
    }
  },
  beforeUnmount(el: HTMLElement) {
    if (el._INPUT) {
      el._INPUT.removeEventListener("input", inputFunction);
      el._INPUT.removeEventListener("compositionstart", compositionStart);
      el._INPUT.removeEventListener("compositionend", compositionEnd);
    }
  },
};

export function setupDebounceInputDirective(app: App) {
  app.directive("debounceInput", debounceInputDirective);
}

export default debounceInputDirective;

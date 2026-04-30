import type { App, Directive } from "vue";
import { useUserStore } from "@/stores/modules/user";

export default function setupPermissionDirective(app: App) {
  const userStore = useUserStore();

  const hasPermission = (flag: string) => {
    const perms: string[] = userStore.buttons;
    return perms.findIndex((item) => item === flag) > -1;
  };
  const updateElVisible = (el: HTMLElement, flag: string) => {
    if (!flag) {
      throw new Error(`need flag: like v-permission="'add'"`);
    }
    if (!hasPermission(flag)) {
      el.parentElement?.removeChild(el);
    }
  };

  const permissionDirective: Directive<HTMLElement, string> = {
    mounted(el, binding) {
      updateElVisible(el, binding.value);
    },
    beforeUpdate(el, binding) {
      updateElVisible(el, binding.value);
    },
  };

  app.directive("permission", permissionDirective);
}

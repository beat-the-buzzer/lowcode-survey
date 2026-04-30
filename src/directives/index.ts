/**
 * Configure and register global directives
 */
import type { App } from "vue";
import { setupDebounceInputDirective } from "./debounceInput";
import { setupDragDirective } from "./drag";
import setupPermissionDirective from "./permission";

export function setupGlobDirectives(app: App) {
  setupDebounceInputDirective(app);
  setupDragDirective(app);
  setupPermissionDirective(app);
}

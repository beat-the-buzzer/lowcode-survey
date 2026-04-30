export default {
  list: () => import("@/views/list/index.vue"),
  add: () => import("@/views/add/index.vue"),
  design: () => import("@/views/design/index.vue"),
  setting: () => import("@/views/setting/index.vue"),
  publish: () => import("@/views/publish/index.vue"),
  statistics: () => import("@/views/statistics/index.vue"),
  monitor: () => import("@/views/monitor/index.vue"),
  download: () => import("@/views/download/index.vue"),
  poster: () => import("@/views/poster/index.vue"),
} as const;

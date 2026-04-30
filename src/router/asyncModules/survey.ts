export default {
  list: () => import("@/views/list/index.vue"),
  add: () => import("@/views/add/index.vue"),
  design: () => import("@/views/design/index.vue"),
  setting: () => import("@/views/setting/index.vue"),
  statistics: () => import("@/views/statistics/index.vue"),
  download: () => import("@/views/download/index.vue"),
  poster: () => import("@/views/poster/index.vue"),
} as const;

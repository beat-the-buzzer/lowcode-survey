import { createRouter, createWebHashHistory } from 'vue-router'
import type { App } from "vue";

const routes = [
  {
    path: '/home',
    component: () => import('../views/home/Index.vue')
  },
  {
    path: '/design',
    component: () => import('../views/design/Index.vue')
  },
  {
    path: '/detail',
    component: () => import('../views/detail/Index.vue')
  }
]

export const router = createRouter({
  history: createWebHashHistory(),
  routes
})


export function setupRouter(app: App<Element>) {
  app.use(router);
}
import { createRouter, createWebHistory } from 'vue-router'
import NotasView from '@/views/NotasView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'Notas',
      component: NotasView,
    },
  ],
})

export default router

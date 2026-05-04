import Homeview from '@/views/profile/Homeview.vue'
import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    
    {
      path: '/',
      name: 'homeview',
      component: Homeview,
    }
  ],
})

export default router

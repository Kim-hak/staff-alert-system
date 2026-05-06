import Homeview from '@/views/profile/Homeview.vue'
import StaffDashboardView from '@/views/staff/StaffDashboardView.vue'
import DashboardLayout from '@/views/staff/StaffDashboardView.vue'
import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [

    {
      path: '/',
      name: 'homeview',
      component: Homeview,
    },

    {
      path: '/staff',
      component: StaffdashboardView,
      children: [
        {
          path: '/staffdashboardView',
          name: 'staffDashboard',
          component: StaffDashboardView,
        },

      ]
    },
  ],
})

export default router

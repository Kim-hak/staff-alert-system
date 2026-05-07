import StaffDashboardView from '@/views/staff/StaffDashboardView.vue'
import FeedbackView from '@/views/staff/FeedbackView.vue'
import ProfileView from '@/views/staff/ProfileView.vue'
import SalaryView from '@/views/staff/SalaryView.vue'
import NotFoundView from '@/views/shared/NotFoundView.vue'
import DashboardLayout from '@/components/layout/DashboardLayout.vue'
import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [

    {
      path: '/',
      redirect: { name: 'staffDashboard' },
    },

    {
      path: '/StaffdashboardView',
      redirect: { name: 'staffDashboard' },
    },

    {
      path: '/staff',
      component: DashboardLayout,
      redirect: { name: 'staffDashboard' },
      children: [
        {
          path: 'dashboard',
          name: 'staffDashboard',
          component: StaffDashboardView,
        },
        {
          path: 'salary',
          name: 'staffSalary',
          component: SalaryView,
        },
        {
          path: 'feedback',
          name: 'staffFeedback',
          component: FeedbackView,
        },
        {
          path: 'profile',
          name: 'staffProfile',
          component: ProfileView,
        },
        {
          path: 'staffdashboard',
          redirect: { name: 'staffDashboard' },
        },
        {
          path: 'reports',
          redirect: { name: 'staffFeedback' },
        },

      ]
    },
    {
      path: '/:pathMatch(.*)*',
      name: 'notFound',
      component: NotFoundView,
    },
  ],
})

export default router

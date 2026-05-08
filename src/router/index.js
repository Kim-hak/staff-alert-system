import StaffDashboardView from '@/views/staff/StaffDashboardView.vue'
import FeedbackView from '@/views/staff/FeedbackView.vue'
import ProfileView from '@/views/staff/ProfileView.vue'
import SalaryView from '@/views/staff/SalaryView.vue'
import NotFoundView from '@/views/shared/NotFoundView.vue'
import DashboardLayout from '@/components/layout/DashboardLayout.vue'
import { useAuthStore } from '@/stores/useAuth'
import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
    path: "/",
    name: "Login",
    component: () => import("@/views/auth/LoginView.vue"),
    meta: { guest: true },
  },
  {
    path: "/auth/forget-password",
    alias: "/forgot-password",
    name: "ForgotPassword",
    component: () => import("@/views/auth/ForgotPasswordView.vue"),
    meta: { guest: true },
  },
  {
    path: "/auth/reset-password",
    alias: "/reset-password",
    name: "ResetPassword",
    component: () => import("@/views/auth/ResetPasswordView.vue"),
    meta: { guest: true },
  },
  {
    path: "/auth/change-password",
    alias: "/change-password",
    name: "ChangePassword",
    component: () => import("@/views/auth/ChangePasswordView.vue"),
    meta: { requiresAuth: true },
  },
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

router.beforeEach((to, from) => {
  let authStore = useAuthStore();
  document.title = to.meta.title ? `${to.meta.title} - My Admin` : "My Admin";

  // Check if route requires authentication
  if (to.meta.requiresAuth && !authStore.isLogined) {
    return { name: 'Login' }
  }

  // Redirect authenticated users away from login page
  if (to.name === 'Login' && authStore.isLogined) {
    return { name: 'Dashboard' }
  }

  // Redirect unauthenticated users trying to access auth pages to login
  if (to.meta.guest && authStore.isLogined) {
    return { name: 'Dashboard' }
  }
})
export default router

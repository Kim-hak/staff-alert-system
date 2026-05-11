import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/stores/useAuth'
import { getRoleKey } from '@/utils/roles'
// ==========================================
// 1. Layouts & Shared Views
// ==========================================
import DashboardLayout from "@/components/layout/DashboardLayout.vue";
import NotFoundView from "@/views/shared/NotFoundView.vue";

// ==========================================
// 2. Auth Views (សម្រាប់ Login / Forget Password)
// ==========================================
// ចំណាំ: សូមប្តូរឈ្មោះ File តាមជាក់ស្តែងនៅក្នុង Folder auth របស់អ្នក
// import LoginView from '@/views/auth/LoginView.vue'
// import ForgotPasswordView from '@/views/auth/ForgotPasswordView.vue'
// import ResetPasswordView from '@/views/auth/ResetPasswordView.vue'

// ==========================================
// 3. Admin Views
// ==========================================
import AdminDashboardView from "@/views/admin/AdminDashboardView.vue";
import UsersView from "@/views/admin/UsersView.vue";
import StaffManagementView from "@/views/admin/StaffManagementView.vue";
import ReportsView from "@/views/admin/ReportsView.vue";
import SalaryManagementView from "@/views/admin/SalaryManagementView.vue";

// ==========================================
// 4. Manager Views (សូមប្តូរឈ្មោះតាម File ជាក់ស្តែង)
// ==========================================
import ManagerDashboardView from '@/views/manager/ManagerDashboardView.vue'
import MyGroupsView from '@/views/manager/MyGroupsView.vue'
import MyReportsView from "@/views/manager/MyReportsView.vue";
import MyStaffsView from "@/views/manager/MyStaffsView.vue";

// ==========================================
// 5. Staff Views
// ==========================================
import StaffDashboardView from "@/views/staff/StaffDashboardView.vue";
import SalaryView from "@/views/staff/SalaryView.vue";
import ProfileView from "@/views/staff/ProfileView.vue"; // នេះជា Profile របស់ Staff
import AdminProfile from '@/views/admin/AdminProfile.vue';
import Notification from '@/views/staff/NotificationView.vue';


// ==========================================
// 6. Global Profile View (សម្រាប់ Admin/Manager)
// ==========================================
// import GlobalProfileView from '@/views/profile/ProfileView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    // --- Default Route ---
   

    // --- Auth Routes (មិនប្រើ Dashboard Layout ទេ) ---
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

    // --- ADMIN Routes ---
    {
      path: "/admin",
      component: DashboardLayout,
      redirect: { name: "adminDashboard" },
      children: [
        {
          path: "dashboard",
          name: "adminDashboard",
          component: AdminDashboardView,
        },
        { path: "users", name: "adminUsers", component: UsersView },
        { path: "staff", name: "adminStaff", component: StaffManagementView },
        { path: "reports", name: "adminReports", component: ReportsView },
        {
          path: "salary",
          name: "adminSalary",
          component: SalaryManagementView,
        },
        { path : "profile", name: "adminProfile", component: AdminProfile },
      ],
    },

    // --- MANAGER Routes ---
    {
      path: "/manager",
      component: DashboardLayout,
      redirect: { name: "managerDashboard" },
      children: [
        // សូម Uncomment ពេលអ្នកបង្កើត File ទាំងនេះរួច
        { path: 'dashboard', name: 'managerDashboard', component: ManagerDashboardView },
        { path: 'managerGroups', name: 'managersGroups', component: MyGroupsView },
        { path: 'managerReports', name: 'managerReports', component: MyReportsView },
        { path: 'managerStaffs', name: 'managerStaffs', component: MyStaffsView },

        
        
      ],
    },

    // --- STAFF Routes ---
    {
      path: "/staff",
      component: DashboardLayout,
      redirect: { name: "staffDashboard" },
      children: [
        {
          path: "dashboard",
          name: "staffDashboard",
          component: StaffDashboardView,
        },
        { path: "salary", name: "staffSalary", component: SalaryView },
        { path: "notification", name: "staffNotification", component: Notification },
        { path: "profile", name: "staffProfile", component: ProfileView },
       
      ],
    },

    // --- SHARED PROFILE Route (ប្រើសម្រាប់ Admin/Manager បើពួកគេមាន Profile រួម) ---
    {
      path: "/profile",
      component: DashboardLayout,
      children: [
        /* { path: '', name: 'globalProfile', component: GlobalProfileView }
         */
      ],
    },

    // --- 404 Not Found ---
    {
      path: "/:pathMatch(.*)*",
      name: "notFound",
      component: NotFoundView,
    },
  ],
})
router.beforeEach(async (to, from) => {
  const authStore = useAuthStore();

  // 1. Fetch profile if logged in but data is missing
  if (authStore.isLogined && !authStore.profile) {
    try {
      await authStore.fetchProfile();
    } catch (e) {
      return { name: 'Login' };
    }
  }

  const roleKey = getRoleKey(authStore.profile);

  // 2. STOP UNAUTHORIZED ACCESS TO ADMIN AREA
  if (to.path.startsWith('/admin') && roleKey !== 'admin') {
    // If not Admin, send them to their respective dashboard
    if (roleKey === 'manager') return { name: 'managerDashboard' };
    return { name: 'staffDashboard' }; 
  }

  // 3. STOP UNAUTHORIZED ACCESS TO MANAGER AREA (Role 2)
  if (to.path.startsWith('/manager') && roleKey !== 'manager') {
    // If not Manager, send them to their respective dashboard
    if (roleKey === 'admin') return { name: 'adminDashboard' };
    return { name: 'staffDashboard' };
  }

  // 4. STOP UNAUTHORIZED ACCESS TO STAFF AREA (Role 3)
  if (to.path.startsWith('/staff') && roleKey !== 'staff') {
     // If not Staff, send them back
     if (roleKey === 'admin') return { name: 'adminDashboard' };
     if (roleKey === 'manager') return { name: 'managerDashboard' };
  }

  // 5. REDIRECT LOGGED-IN USERS AWAY FROM LOGIN PAGE
  if (to.name === 'Login' && authStore.isLogined) {
    if (roleKey === 'admin') return { name: 'adminDashboard' };
    if (roleKey === 'manager') return { name: 'managerDashboard' };
    if (roleKey === 'staff') return { name: 'staffDashboard' };
  }
});
export default router

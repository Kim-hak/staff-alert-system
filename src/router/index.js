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

// ==========================================
// 3. Admin Views
// ==========================================
import AdminDashboardView from "@/views/admin/AdminDashboardView.vue";
import UsersView from "@/views/admin/UsersView.vue";
import StaffManagementView from "@/views/admin/StaffManagementView.vue";
import ReportsView from "@/views/admin/ReportsView.vue";
import NotificationsView from "@/views/admin/NotificationsView.vue";

// ==========================================
// 4. Manager Views (សូមប្តូរឈ្មោះតាម File ជាក់ស្តែង)
// ==========================================
import ManagerDashboardView from '@/views/manager/ManagerDashboardView.vue'
import MyGroupsView from '@/views/manager/MyGroupsView.vue'
import MyReportsView from "@/views/manager/MyReportsView.vue";
import MyStaffsView from "@/views/manager/MyStaffsView.vue";
import ManagerNotificationView from '@/views/manager/ManagerNotificationView.vue';
import ManagerTelegram from '@/views/manager/ManagerTelegram.vue';
// ==========================================
// 5. Staff Views
// ==========================================
import StaffDashboardView from "@/views/staff/StaffDashboardView.vue";
import SalaryView from "@/views/staff/SalaryView.vue";
import ProfileView from "@/views/staff/ProfileView.vue"; // នេះជា Profile របស់ Staff
import AdminProfile from '@/views/admin/AdminProfile.vue';
import TelegramView from '@/views/staff/TelegramView.vue';
import GroupsView from '@/views/admin/GroupsView.vue';
import GetUserByIDView from '@/views/admin/GetUserByIDView.vue';




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
  meta: { requiresAuth: true, roles: ["admin"] },
  children: [
    { path: "dashboard", name: "adminDashboard", component: AdminDashboardView },
    { path: "users", name: "adminUsers", component: UsersView },
    { path: "groups", name: "adminGroups", component:GroupsView },
    { path: "staff", name: "adminStaff", component: StaffManagementView },
    { path: "users/:id", name: "adminUserDetail", component:GetUserByIDView },
    { path: "reports", name: "adminReports", component: ReportsView },
    { path: "notifications", name: "adminNotifications", component: NotificationsView },
    { path: "profile", name: "adminProfile", component: AdminProfile },
  ],
},

// --- MANAGER Routes ---
{
  path: "/manager",
  component: DashboardLayout,
  redirect: { name: 'managerDashboard' },
  meta: { requiresAuth: true, roles: ["manager"] },
  children: [
    { path: 'dashboard', name: 'managerDashboard', component: ManagerDashboardView },
    // ចំណាំ៖ កែឈ្មោះ name ឱ្យដូចក្នុង Sidebar (managersGroups)
    { path: 'groups', name: 'managersGroups', component: MyGroupsView }, 
    { path: 'reports', name: 'managerReports', component: MyReportsView },
    { path: 'staffs', name: 'managerStaffs', component: MyStaffsView },
    // បន្ថែម Route នេះដើម្បីឱ្យ Link ប្រវត្តិរូបដើរ
    { path: 'profile', name: 'managerProfile', component: AdminProfile }, 
    {path: 'notifications', name: 'managerNotifications', component:ManagerNotificationView},
    {path: 'telegram', name: 'managerTelegram', component:ManagerTelegram}
  ],
},

// --- STAFF Routes ---
{
  path: "/staff",
  component: DashboardLayout,
  redirect: { name: "staffDashboard" },
  meta: { requiresAuth: true, roles: ["staff"] },
  children: [
    { path: "dashboard", name: "staffDashboard", component: StaffDashboardView },
    { path: "salary", name: "staffSalary", component: SalaryView },
    { path: "profile", name: "staffProfile", component: ProfileView },
    { path: "telegram", name: "staffTelegram", component: TelegramView },
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
  const token = localStorage.getItem('token'); // Direct read for instant check

  const redirectByRole = (profile) => {
    const roleKey = getRoleKey(profile);
    if (roleKey === 'admin') return { name: 'adminDashboard' };
    if (roleKey === 'manager') return { name: 'managerDashboard' };
    if (roleKey === 'staff') return { name: 'staffDashboard' };
    return { name: 'notFound' };
  };

  // If no token exists and the page isn't 'Login' or 'Forgot Password'
  if (!token && !to.meta.guest) {
    authStore.logoutLocal(); // Clear Pinia state
    return { name: 'Login' };
  }

  // If token exists but profile is missing (the refresh case)
  if (token && !authStore.profile) {
    try {
      await authStore.fetchProfile();
    } catch (error) {
      authStore.logoutLocal();
      return { name: 'Login' };
    }
  }

  // Redirect away from Login if already authenticated
  if (token && to.meta.guest) {
    return redirectByRole(authStore.profile);
  }

  const allowedRoles = to.meta.roles;
  if (token && Array.isArray(allowedRoles) && allowedRoles.length > 0) {
    const roleKey = getRoleKey(authStore.profile);
    if (!allowedRoles.includes(roleKey)) {
      return redirectByRole(authStore.profile);
    }
  }
});
export default router

import { createRouter, createWebHistory } from "vue-router";

// ==========================================
// 1. Layouts & Shared Views
// ==========================================
import DashboardLayout from "@/components/layout/DashboardLayout.vue";
import NotFoundView from "@/views/shared/NotFoundView.vue";

// ==========================================
// 2. Auth Views (សម្រាប់ Login / Forget Password)
// ==========================================
// ចំណាំ: សូមប្តូរឈ្មោះ File តាមជាក់ស្តែងនៅក្នុង Folder auth របស់អ្នក
import LoginView from "@/views/auth/LoginView.vue";

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
import FeedbackView from "@/views/staff/FeedbackView.vue";
import ProfileView from "@/views/staff/ProfileView.vue"; // នេះជា Profile របស់ Staff

// ==========================================
// 6. Global Profile View (សម្រាប់ Admin/Manager)
// ==========================================
// import GlobalProfileView from '@/views/profile/ProfileView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    // --- Default Route ---
    {
      path: "/",
      redirect: { name: "login" }, // គួរតែបាញ់ទៅ Login ជាមុន
    },

    // --- Auth Routes (មិនប្រើ Dashboard Layout ទេ) ---
    {
      path: "/login",
      name: "login",
      component: LoginView,
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
        { path: "feedback", name: "staffFeedback", component: FeedbackView },
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
});

export default router;

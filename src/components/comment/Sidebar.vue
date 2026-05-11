<template>
  <nav
    id="sidebar"
    :class="{
      closed: !isOpen && !isMobile,
      open: isOpen && isMobile
    }"
  >
    <div class="sidebar-brand text-center py-4">
      <div class="brand-icon mb-2">
        <!-- <i class="bi bi-bell-fill text-white fs-3"></i> -->
         <img style="width: 60px ; height: 60px;" src="../../assets/file_00000000c7007207a759e14e013b3f54.png" alt="">
      </div>
      <h4 class="brand-name text-white">AlertGo</h4>
    </div>

    <div class="sidebar-nav px-3">
      <!-- Admin Links -->
      <template v-if="roleId === 1">
        <RouterLink :to="{ name: 'adminDashboard' }" class="nav-item-custom">
          <i class="bi bi-grid-fill"></i> ផ្ទាំងគ្រប់គ្រង
        </RouterLink>
        <RouterLink :to="{ name: 'adminUsers' }" class="nav-item-custom">
          <i class="bi bi-person-fill"></i> អ្នកប្រើប្រាស់
        </RouterLink>
        <RouterLink :to="{ name: 'adminStaff' }" class="nav-item-custom">
          <i class="bi bi-people-fill"></i> ក្រុម
        </RouterLink>
        <RouterLink :to="{ name: 'adminReports' }" class="nav-item-custom">
          <i class="bi bi-file-earmark-bar-graph-fill"></i> របាយការណ៍
        </RouterLink>
        <RouterLink :to="{ name: 'adminSalary' }" class="nav-item-custom">
          <i class="bi bi-bell-fill"></i> សេចក្តីជូនដំណឹង
        </RouterLink>
        <RouterLink :to="{name : 'adminProfile'}" class="nav-item-custom">
          <i class="bi bi-person-square"></i> ប្រវត្តិរូប
        </RouterLink>
      </template>

      <!-- Manager Links -->
      <template v-if="roleId === 2">
        <RouterLink :to="{ name: 'managerDashboard' }" class="nav-item-custom">
          <i class="bi bi-grid-fill"></i> ផ្ទាំងគ្រប់គ្រង
        </RouterLink>
        <RouterLink :to="{ name: 'managerStaffs' }" class="nav-item-custom">
          <i class="bi bi-person-fill"></i> អ្នកប្រើប្រាស់
        </RouterLink>
        <RouterLink :to="{ name: 'managersGroups' }" class="nav-item-custom">
          <i class="bi bi-collection"></i> ក្រុមរបស់ខ្ញុំ
        </RouterLink>
        <RouterLink :to="{ name: 'managerReports' }" class="nav-item-custom">
           <i class="bi bi-file-earmark-bar-graph-fill"></i> របាយការណ៍
        </RouterLink>
        <a href="" class="nav-item-custom"> 
          <i class="bi bi-bell-fill"></i> សេចក្តីជូនដំណឹង
        </a>
        <a href="" class="nav-item-custom">
          <i class="bi bi-person-square"></i> ប្រវត្តិរូប
        </a>
        <a href="" class="nav-item-custom">
          <i class="bi bi-telegram"></i> Telegram
        </a>
        
      </template>

      <!-- Staff Links -->
      <template v-if="roleId === 3">
        <RouterLink :to="{ name: 'staffDashboard' }" class="nav-item-custom">
          <i class="bi bi-grid-fill"></i> ផ្ទាំងគ្រប់គ្រង
        </RouterLink>
        <RouterLink :to="{ name: 'staffSalary' }" class="nav-item-custom">
          <i class="bi bi-currency-dollar"></i> ប្រាក់ខែ
        </RouterLink>
        <RouterLink :to="{ name: 'staffFeedback' }" class="nav-item-custom">
          <i class="bi bi-bell-fill"></i> សេចក្តីជូនដំណឹង
        </RouterLink>
        <RouterLink :to="{ name: 'staffProfile' }" class="nav-item-custom">
          <i class="bi bi-person"></i> ប្រវត្តិរូប
        </RouterLink>
        <a href="" class="nav-item-custom">
          <i class="bi bi-telegram"></i> Telegram
        </a>
        
      </template>
    </div>

    <div class="sidebar-footer mt-auto p-3 text-white">
      <div class="user-info d-flex align-items-center gap-2">
        <div class="user-avatar">{{ userInitial }}</div>
        <div>
          <div class="fw-bold small">{{ userName }}</div>
          <div class="small text-white-50">{{ userRole }}</div>
        </div>
      </div>
    </div>
  </nav>
</template>

<script setup>
import { RouterLink } from 'vue-router'
import { useAuthStore } from '@/stores/useAuth'
import { computed } from 'vue'

const authStore = useAuthStore()

defineProps({
  isOpen: Boolean,
  isMobile: Boolean
})

const roleId = computed(() => authStore.profile?.role?.id)

const userName = computed(() => {
  if (authStore.profile) {
    return `${authStore.profile.firstName || ''} ${authStore.profile.lastName || ''}`.trim() || 'User'
  }
  return 'User'
})

const userInitial = computed(() => {
  return userName.value.charAt(0).toUpperCase()
})

const userRole = computed(() => {
  switch (roleId.value) {
    case 1: return 'ADMIN'
    case 2: return 'MANAGER'
    case 3: return 'AUTHORIZED STAFF'
    default: return 'USER'
  }
})
</script>


<style scoped>
/* Move your sidebar-specific CSS here */
#sidebar {
  position: fixed;
  width: var(--sidebar-width);
  height: 100vh;
  background: var(--sidebar-bg);
  display: flex;
  flex-direction: column;
  transition: 0.3s;
  z-index: 1050;
}
#sidebar.closed { transform: translateX(-100%); }
#sidebar.open { transform: translateX(0); }

.nav-item-custom {
  display: flex;
  gap: 10px;
  padding: 10px;
  color: rgba(255,255,255,0.7);
  border-radius: 10px;
  margin-bottom: 5px;
  cursor: pointer;
  text-decoration: none;
}
.nav-item-custom:hover, .nav-item-custom.router-link-active {
  background: rgba(255,255,255,0.2);
  color: white;
}
.user-avatar {
  width: 35px;
  height: 35px;
  background: rgba(255,255,255,0.3);
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 10px;
}
</style>

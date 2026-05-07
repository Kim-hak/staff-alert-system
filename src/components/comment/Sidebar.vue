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
        <i class="bi bi-bell-fill text-white fs-3"></i>
      </div>
      <h4 class="brand-name text-white">AlertGo</h4>
    </div>

    <div class="sidebar-nav px-3">
      <RouterLink :to="{ name: 'staffDashboard' }" class="nav-item-custom">
        <i class="bi bi-grid-fill"></i> Dashboard
      </RouterLink>
      <RouterLink :to="{ name: 'staffSalary' }" class="nav-item-custom">
        <i class="bi bi-currency-dollar"></i> Salary History
      </RouterLink>
      <RouterLink :to="{ name: 'staffFeedback' }" class="nav-item-custom">
        <i class="bi bi-chat-square-text"></i> Feedback
      </RouterLink>
      <RouterLink :to="{ name: 'staffProfile' }" class="nav-item-custom">
        <i class="bi bi-person"></i> Profile
      </RouterLink>
    </div>

    <div class="sidebar-footer mt-auto p-3 text-white">
      <div class="user-info d-flex align-items-center gap-2">
        <div class="user-avatar">S</div>
        <div>
          <div class="fw-bold small">Staff User</div>
          <div class="small text-white-50">AUTHORIZED STAFF</div>
        </div>
      </div>
    </div>
  </nav>
</template>

<script setup>
import { RouterLink } from 'vue-router'

defineProps({
  isOpen: Boolean,
  isMobile: Boolean
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

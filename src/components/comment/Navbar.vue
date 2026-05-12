
<template>
  <header class="topbar d-flex justify-content-between align-items-center px-3">
    
    <!-- Toggle Button -->
    <button class="toggle-btn" @click="$emit('toggle')">
      <i class="bi bi-list"></i>
    </button>

    <!-- Welcome -->
    <h5 class="mb-0">Welcome back, {{ userName }}!</h5>

    <!-- User Dropdown -->
    <div class="dropdown">
      <div
        class="d-flex align-items-center gap-2 dropdown-toggle cursor-pointer"
        data-bs-toggle="dropdown"
        style="cursor: pointer;"
      >
        <span>{{ userRole }}</span>
        <img
          src="https://via.placeholder.com/40"
          alt="User Avatar"
          class="user-avatar rounded-circle"
          width="40"
          height="40"
        />
      </div>

      <!-- Dropdown Menu -->
      <ul class="dropdown-menu dropdown-menu-end">
        <li>
          <a class="dropdown-item" href="#">
            <i class="bi bi-person me-2"></i> Profile
          </a>
        </li>

        <li><hr class="dropdown-divider" /></li>

        <li>
          <button class="dropdown-item text-danger" @click="logout">
            <i class="bi bi-box-arrow-right me-2"></i> Logout
          </button>
        </li>
      </ul>
    </div>

  </header>
</template>

<script setup>
import { useAuthStore } from '@/stores/useAuth'
import { computed } from 'vue'
import { getRoleKey } from '@/utils/roles'

const authStore = useAuthStore()

defineEmits(['toggle'])

const userName = computed(() => {
  if (authStore.profile) {
    return `${authStore.profile.firstName || ''} ${authStore.profile.lastName || ''}`.trim() || 'User'
  }
  return 'User'
})

const userRole = computed(() => {
  switch (getRoleKey(authStore.profile)) {
    case 'admin': return 'Admin'
    case 'manager': return 'Manager'
    case 'staff': return 'Staff'
    default: return 'User'
  }
})
</script>

<style scoped>
.topbar {
  height: 60px;
  background: var(--topbar-bg);
  color: white;
}
.toggle-btn {
  background: none;
  border: none;
  color: white;
  font-size: 1.5rem;
  cursor: pointer;
}
</style>

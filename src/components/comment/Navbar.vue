
<template>
  <header class="topbar d-flex justify-content-between align-items-center px-3">
    <button class="toggle-btn" @click="$emit('toggle')">
      <i class="bi bi-list"></i>
    </button>

    <h5 class="mb-0">Welcome back, {{ userName }}!</h5>

    <div class="d-flex align-items-center gap-2">
      <span>{{ userRole }}</span>
      <img src="" alt="User Avatar" class="user-avatar" />
    </div>
  </header>
</template>

<script setup>
import { useAuthStore } from '@/stores/useAuth'
import { computed } from 'vue'

const authStore = useAuthStore()

defineEmits(['toggle'])

const userName = computed(() => {
  if (authStore.profile) {
    return `${authStore.profile.firstName || ''} ${authStore.profile.lastName || ''}`.trim() || 'User'
  }
  return 'User'
})

const userRole = computed(() => {
  switch (authStore.profile?.role?.id) {
    case 1: return 'Admin'
    case 2: return 'Manager'
    case 3: return 'Staff'
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

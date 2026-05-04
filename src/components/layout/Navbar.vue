<template>
  <header class="topbar d-flex justify-content-between align-items-center px-3">
    <button class="toggle-btn" @click="$emit('toggle')">
      <i class="bi bi-list"></i>
    </button>

    <h5 class="mb-0">Welcome back, Staff User!</h5>

    <div class="d-flex align-items-center gap-2">
      <span>Staff</span>
      <img src="" alt="User Avatar" class="user-avatar" />
    </div>
  </header>
</template>

<script setup>
defineEmits(['toggle'])
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
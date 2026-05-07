<template>
  <div class="card custom-base-card h-100">
    <div v-if="title || $slots.headerAction" class="card-header bg-white border-0 pt-4 pb-0 px-4 d-flex justify-content-between align-items-center">
      <h5 class="fw-bold mb-0 text-dark">{{ title }}</h5>
      <slot name="headerAction" />
    </div>
    
    <div class="card-body p-4">
      <slot />
    </div>
  </div>
</template>

<script setup>
defineProps({
  title: String
});
</script>

<style scoped>
.custom-base-card {
  border: 1px solid #f0f0f0;
  border-radius: 16px;
  background-color: #ffffff;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.03);
  transition: box-shadow 0.3s ease;
}
.custom-base-card:hover {
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.06);
}
</style>
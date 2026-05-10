<template>
  <span :class="['custom-badge', badgeClass]">
    <slot />
  </span>
</template>

<script setup>
import { computed } from 'vue';

const props = defineProps({
  type: { type: String, default: 'success' } // success, warning, danger, draft
});

const badgeClass = computed(() => {
  const types = {
    success: 'badge-success', // សម្រាប់ Active / Reviewed
    warning: 'badge-warning', // សម្រាប់ Pending
    danger: 'badge-danger',   // សម្រាប់ Inactive
    draft: 'badge-draft'      // សម្រាប់ Draft
  };
  return types[props.type] || types.success;
});
</script>

<style scoped>
.custom-badge {
  padding: 0.35em 0.85em;
  font-size: 0.75rem;
  font-weight: 600;
  border-radius: 50rem;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}
.badge-success { background-color: #e8f5e9; color: #2e7d32; border: 1px solid #c8e6c9; }
.badge-warning { background-color: #fff8e1; color: #f57f17; border: 1px solid #ffecb3; }
.badge-danger  { background-color: #ffebee; color: #c62828; border: 1px solid #ffcdd2; }
.badge-draft   { background-color: #f5f5f5; color: #616161; border: 1px solid #e0e0e0; }
</style>
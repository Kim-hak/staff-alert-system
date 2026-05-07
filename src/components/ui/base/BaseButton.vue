<template>
  <button
    :type="type"
    :disabled="loading"
    :class="['btn base-btn d-flex align-items-center justify-content-center gap-2', variantClass, { 'w-100': fullWidth }]"
  >
    <span v-if="loading" class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
    <slot v-else />
  </button>
</template>

<script setup>
import { computed } from 'vue';

const props = defineProps({
  variant: { type: String, default: 'primary' }, // primary, secondary, danger, outline
  type: { type: String, default: 'button' },
  loading: Boolean,
  fullWidth: Boolean
});

const variantClass = computed(() => {
  const variants = {
    primary: 'btn-primary-custom',
    secondary: 'btn-light text-secondary',
    danger: 'btn-danger-custom',
    outline: 'btn-outline-custom'
  };
  return variants[props.variant] || variants.primary;
});
</script>

<style scoped>
.base-btn {
  padding: 0.5rem 1.25rem;
  font-weight: 500;
  border-radius: 8px;
  transition: all 0.3s ease;
  border: none;
}
.base-btn:active {
  transform: scale(0.96);
}
.btn-primary-custom {
  background-color: #4D7C6E;
  color: white;
  box-shadow: 0 4px 6px rgba(77, 124, 110, 0.2);
}
.btn-primary-custom:hover {
  background-color: #3D6358;
  color: white;
  transform: translateY(-2px);
  box-shadow: 0 6px 12px rgba(77, 124, 110, 0.3);
}
.btn-danger-custom {
  background-color: #ff4d4f;
  color: white;
}
.btn-danger-custom:hover {
  background-color: #d9363e;
  color: white;
  transform: translateY(-2px);
}
.btn-outline-custom {
  border: 1px solid #4D7C6E;
  color: #4D7C6E;
  background-color: transparent;
}
.btn-outline-custom:hover {
  background-color: #f0f5f3;
  color: #4D7C6E;
}
</style>
<template>
  <Teleport to="body">
    <Transition name="modal-fade">
      <div
        v-if="show"
        class="custom-modal-overlay"
        @click.self="$emit('close')"
      >
        <div class="custom-modal-dialog" :class="sizeClass">
          <div class="custom-modal-content">
            <div
              class="custom-modal-header d-flex justify-content-between align-items-center"
            >
              <h5 class="mb-0 fw-bold">{{ title }}</h5>
              <button @click="$emit('close')" class="btn-close-custom">
                <i class="bi bi-x-lg"></i>
              </button>
            </div>

            <div class="p-4">
              <slot />
            </div>

            <div v-if="$slots.footer" class="custom-modal-footer">
              <slot name="footer" />
            </div>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup>
import { computed } from "vue";

const props = defineProps({
  show: Boolean,
  title: String,
  size: {
    type: String,
    default: "md",
  },
});
defineEmits(["close"]);

const sizeClass = computed(() => {
  return {
    "modal-sm": props.size === "sm",
    "modal-lg": props.size === "lg",
    "modal-xl": props.size === "xl",
  };
});
</script>

<style scoped>
.custom-modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background-color: rgba(0, 0, 0, 0.4);
  backdrop-filter: blur(3px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1050;
}
.custom-modal-dialog {
  width: 100%;
  max-width: 500px;
  padding: 1rem;
  transition: max-width 0.3s ease;
}
.custom-modal-dialog.modal-sm {
  max-width: 350px;
}
.custom-modal-dialog.modal-lg {
  max-width: 800px;
}
.custom-modal-dialog.modal-xl {
  max-width: 1140px;
}
.custom-modal-content {
  background: white;
  border-radius: 16px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
  overflow-y: auto; /* បន្ថែម scrollbar */
  max-height: 90vh; /* កំណត់កម្ពស់អតិបរមា */
}
.custom-modal-header {
  background-color: #4d7c6e;
  color: white;
  padding: 1.25rem 1.5rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.btn-close-custom {
  background: rgba(255, 255, 255, 0.2);
  border: none;
  color: white;
  border-radius: 50%;
  width: 30px;
  height: 30px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background 0.2s;
}
.btn-close-custom:hover {
  background: rgba(255, 255, 255, 0.4);
}
.custom-modal-footer {
  padding: 1rem 1.5rem;
  background-color: #f8f9fa;
  border-top: 1px solid #f1f1f1;
  display: flex;
  justify-content: flex-end;
  gap: 0.5rem;
}

/* Animation */
.modal-fade-enter-active,
.modal-fade-leave-active {
  transition: all 0.3s ease;
}
.modal-fade-enter-from,
.modal-fade-leave-to {
  opacity: 0;
  transform: translateY(-20px) scale(0.95);
}
</style>

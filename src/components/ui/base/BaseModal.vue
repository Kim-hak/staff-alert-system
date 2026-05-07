<template>
  <!-- Backdrop -->
  <div class="modal-backdrop-custom" @click="closeModal"></div>

  <!-- Modal -->
  <div class="modal fade show d-block" tabindex="-1">
    <div class="modal-dialog">
      <div class="modal-content">
        <div
          class="modal-header"
          style="background-color: var(--secondary-color)"
        >
          <h5 class="modal-title text-white">{{ title }}</h5>

          <button
            type="button"
            class="btn-close"
            aria-label="Close"
            @click="closeModal"
          ></button>
        </div>

        <div class="modal-body">
          <slot name="body"></slot>
        </div>

        <div class="modal-footer">
          <slot name="footer"></slot>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
const emit = defineEmits(["close-modal"])

const closeModal = () => {
  emit("close-modal")
}

defineProps({
  title: String,
  description: String,
})
</script>

<style scoped>
.modal-backdrop-custom {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;

  /* dark overlay */
  background: rgba(0, 0, 0, 0.3);

  /* blur effect */
  backdrop-filter: blur(5px);
  -webkit-backdrop-filter: blur(5px);

  z-index: 1040;
}

.modal {
  z-index: 1050;
}
</style>
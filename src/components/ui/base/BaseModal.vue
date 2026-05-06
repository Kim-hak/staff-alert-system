<template>
  <div class="modal fade show d-block" tabindex="-1">
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title">{{ title }}</h5>
          <button
            type="button"
            class="btn-close"
            data-bs-dismiss="modal"
            aria-label="Close"
            @click="closeModal"
          ></button>
        </div>
        <div class="modal-body">
          <!-- <p>{{ description }}</p> -->`
           <slot name="body"></slot>
        </div>

        <div class="modal-footer">
          <slot name="footer">
            
          </slot>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup>
// emits

const emit = defineEmits(["close-modal"]);

const closeModal = () => {
  emit("close-modal");
};

defineProps({
    title : String,
    description : String,
})
</script>

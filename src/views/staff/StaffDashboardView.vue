<template>

  <!-- Open button -->
  <button class="btn btn-primary" @click="showModal = true">
    Open Modal
  </button>

  <!-- Modal -->
  <BaseModal
    v-if="showModal"
    title="Delete User"
    @close-modal="showModal = false"
  >
    <!-- Body -->
    <template #body>
      <p>Are you sure you want to delete this user?</p>
    </template>

    <!-- Footer -->
    <template #footer>
      <button 
        class="btn btn-secondary"
        @click="showModal = false"
      >
        Cancel
      </button>

      <button 
        class="btn btn-danger"
        @click="deleteUser"
      >
        Delete
      </button>
    </template>

  </BaseModal>

</template>

<script setup>
import { ref } from 'vue'
import BaseModal from '@/components/ui/base/BaseModal.vue';

const showModal = ref(false)

const deleteUser = () => {
  console.log("Deleted")
  showModal.value = false
}


</script>

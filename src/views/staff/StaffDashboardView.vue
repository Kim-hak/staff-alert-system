<template>
  <div class="container-fluid p-4">
    <div class="mb-4 text-start">
      <h2 class="fw-bold">Dashboard</h2>
      <p class="text-muted">Welcome back, Staff User!</p>
    </div>

    <div class="row g-4 mb-5">
      <div class="col-12 col-md-4">
        <StatCard 
          title="Monthly Salary" 
          value="$6,250" 
          icon="bi bi-wallet2" 
          icon-color="text-success"
          bg-color="bg-light-green" 
        />
      </div>
      
      <div class="col-12 col-md-4">
        <StatCard 
          title="Profile Status" 
          value="Active" 
          value-color="#28a745"
          icon="bi bi-person-check" 
          icon-color="text-primary"
          bg-color="bg-light-blue" 
        />
      </div>

      <div class="col-12 col-md-4">
        <StatCard 
          title="Notifications" 
          value="5" 
          value-color="#fd7e14"
          icon="bi bi-bell" 
          icon-color="text-warning"
          bg-color="bg-light-orange" 
        />
      </div>
    </div>

    <div class="text-start">
      <button @click="showModal = true" class="btn btn-custom px-4 py-2 shadow-sm">
        <i class="bi bi-plus-circle me-2"></i>Open Action Modal
      </button>
    </div>

    <BaseModal :show="showModal" title="Confirm Action" @close="showModal = false">
      <div class="p-3 text-center">
        <i class="bi bi-exclamation-triangle text-warning display-4 mb-3 d-block"></i>
        <p class="fs-5">តើអ្នកពិតជាចង់បន្តប្រតិបត្តិការនេះមែនទេ?</p>
      </div>
      <template #footer>
        <button class="btn btn-light px-4" @click="showModal = false">Cancel</button>
        <button class="btn btn-danger px-4" @click="handleDelete">Confirm Delete</button>
      </template>
    </BaseModal>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import StatCard from '@/components/ui/base/StatCard.vue';
import BaseModal from '@/components/ui/base/BaseModal.vue';

const showModal = ref(false);
const handleDelete = () => { showModal.value = false; };
</script>

<style>
/* Custom Button ពណ៌បៃតងដូចក្នុង Design */
.btn-custom {
  background-color: #4D7C6E !important;
  color: white !important;
  border-radius: 8px;
  transition: all 0.3s;
}
.btn-custom:hover {
  background-color: #3D6358 !important;
  transform: translateY(-2px);
}
</style>
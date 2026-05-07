<template>
  <div class="container-fluid p-4">
    

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

   
  </div>
</template>

<script setup>
import { ref } from 'vue';
import StatCard from '@/components/ui/base/StatCard.vue';

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
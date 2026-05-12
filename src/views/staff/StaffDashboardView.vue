<template>
  <div class="container-fluid p-4">

    <!-- Header -->


    <!-- Stats -->
    <div class="row g-4 mb-4">

      <div class="col-md-4">
        <StatCard title="Monthly Salary" :value="'$' + salary.toLocaleString()" icon="bi bi-wallet2"
          icon-color="text-success" />
      </div>

      <div class="col-md-4">
        <StatCard title="Hired Date" :value="hireDate" icon="bi bi-calendar-check" icon-color="text-warning" />
      </div>

      <div class="col-md-4">
        <StatCard title="Profile Status" :value="status" icon="bi bi-person-check" icon-color="text-primary" />
      </div>

    </div>

  

  </div>
</template>

<script setup>
import { ref } from 'vue'

// Base Component
import StatCard from '@/components/ui/base/StatCard.vue'

// Dashboard Data
const salary = ref(6250)
const status = ref('ACTIVATED')
const hireDate = ref('01/01/2023')




</script>
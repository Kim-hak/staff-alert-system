<template>
  <div class="space-y-8">
    
    <!-- Header -->
    <div class="mb-8">
      <h1 class="text-3xl font-normal text-gray-900 mb-2">Dashboard</h1>
      <p class="text-gray-500 font-normal">
        Welcome back, Manager!
      </p>
    </div>

    <!-- Stats -->
    <div class="row g-4">

      <div class="col-md-6 col-xl-3">
        <StatCard
          title="My Staff"
          :value="24"
          icon="bi bi-people"
          iconColor="text-primary"
          bgColor="bg-light-blue"
        />
      </div>

      <div class="col-md-6 col-xl-3">
        <StatCard
          title="My Groups"
          :value="3"
          icon="bi bi-diagram-3"
          iconColor="text-success"
          bgColor="bg-light-green"
        />
      </div>

      <div class="col-md-6 col-xl-3">
        <StatCard
          title="Reports"
          :value="12"
          icon="bi bi-file-earmark-text"
          iconColor="text-warning"
          bgColor="bg-light-orange"
        />
      </div>

      <div class="col-md-6 col-xl-3">
        <StatCard
          title="Notifications"
          :value="5"
          icon="bi bi-bell"
          iconColor="text-danger"
          bgColor="bg-light-danger"
        />
      </div>

    </div>
  </div>
</template>

<script setup>
import StatCard from '@/components/ui/base/StatCard.vue';
</script>
<template>
  <div class="container-fluid p-4">
    <div class="mb-4 text-start">
      <h3 class="fw-bold text-dark mb-1">User Management</h3>
      <p class="text-muted small">Manage all system users, managers, and staff.</p>
    </div>
    <div class="card border-0 shadow-sm rounded-4 p-4 text-center">
      <p class="text-muted">ទំព័រគ្រប់គ្រងអ្នកប្រើប្រាស់កំពុងរៀបចំ...</p>
    </div>
    <BaseTable></BaseTable>
  </div>
</template>
<script setup>
import BaseTable from '@/components/ui/base/BaseTable.vue';

</script>
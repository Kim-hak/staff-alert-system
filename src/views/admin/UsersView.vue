<template>
  <div class="container-fluid p-4">
    <div class="d-flex justify-content-between align-items-center">
      <div class="mb-4 text-start">
        <h3 class="fw-bold text-dark mb-1">User Management</h3>
        <p class="text-muted small">Manage all system users, managers, and staff.</p>
      </div>
      <BaseButton>
        <template #icon>
          <span>+</span>
        </template>
        បង្កើអ្នកប្រើប្រាស់
      </BaseButton>
    </div>

    <BaseTable :columns="myCols" :data="myData">
      <template #status="{ item }">
        <span :class="item.status === 'Active' ? 'text-success' : 'text-danger'">
          {{ item.status }}
        </span>
      </template>
    </BaseTable>
  </div>
</template>
<script setup>
import BaseButton from '@/components/ui/base/BaseButton.vue';
import BaseTable from '@/components/ui/base/BaseTable.vue';

const myCols = [
    {key: 'title', label: 'Title'},
    {key: 'content', label: 'Content'},
    {key: 'thumbnail', label: 'Thumbnail'},
    {key: 'category', label: 'Category'},
]

</script>
<style>
.role-badge {
  background: #f1f5f9;
  padding: 4px 8px;
  border-radius: 6px;
  font-size: 11px;
  color: #475569;
}

.status-pill {
  padding: 4px 12px;
  border-radius: 999px;
  font-size: 11px;
  font-weight: bold;
}

.status-pill.active {
  background: #e6fcf5;
  color: #0ca678;
}

.status-pill.inactive {
  background: #fff5f5;
  color: #fa5252;
}
</style>
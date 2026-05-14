<template>
  <div class="container-fluid p-4">
    <div class="d-flex justify-content-between align-items-center">
      <div class="mb-4 text-start">
        <h3 class="fw-bold text-dark mb-1">User Management</h3>
        <p class="text-muted small">Manage all system users, managers, and staff.</p>
      </div>
      <BaseButton @click="ishow">
        <template #icon>
          <span>+</span>
        </template>
        បង្កើតអ្នកប្រើប្រាស់
      </BaseButton>
    </div>
    <!-- <BasePagination :totalPages = "arcticleStore.pagination.totalPages"></BasePagination> -->

    <BaseTable :columns="col" :data="arcticleStore.allArcticles" :loading="arcticleStore.loading">
      <template #id="{ item }">
        <span class="text-success">{{ item.id }}</span>
      </template>

      <template #email="{ item }">
        <span class="text-primary">{{ item.email }}</span>
      </template>

      <template #role_name="{ item }">
        <span class="badge  active-color">{{
          item.role?.name }}</span>
      </template>
      <template #status="{ item }">
        <span :class="item.status === 'Active' ? 'non-active-color' : 'active-color'" class="badge">
          {{ item.status }}
        </span>
      </template>
    </BaseTable>
    <!-- Modal create user -->
    <BaseModal v-if="showModal=true">
      <template #header>
        <h4 class="modal-title">Create User</h4>
      </template>
      <template #body>
        <!-- Modal body content -->
      </template>
    </BaseModal>

  </div>
</template>
<script setup>
import BaseButton from '@/components/ui/base/BaseButton.vue';
import BaseModal from '@/components/ui/base/BaseModal.vue';
// import BasePagination from '@/components/ui/base/BasePagination.vue';
import BaseTable from '@/components/ui/base/BaseTable.vue';
import { useArcticleStore } from '@/stores/useArcticleStore';

import { onMounted, ref} from 'vue';

const arcticleStore = useArcticleStore();
const ishow = ref(false);
const showModal= ref(false);

onMounted(() => {
  arcticleStore.fectchAllArcticles();
})
const col = [
  { key: 'id', label: 'ID' },
  { key: 'fullname', label: 'Full Name' },
  { key: 'email', label: 'Email' },
  { key: 'phone', label: 'Phone Number' },
  { key: 'role_name', label: 'Role' },
  { key: 'salary', label: 'Salary' },
  { key: 'status', label: 'Status' },
]
</script>
<style>
.role-badge {
  background: #d5eee7;
  padding: 4px 8px;
  border-radius: 6px;
  font-size: 11px;
  color: #475569;
}

.active-color {
  background: #dee9e5;
  border: 1px solid #bcd3cb;
  color: #667d75;
  border-radius: 6px;
}

.non-active-color {
  background: #fff5f5;
  color: #fa5252;
  border: 1px solid #f5c2c7;
  border-radius: 6px;

}



</style>
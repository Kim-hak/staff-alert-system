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
        បង្កើតអ្នកប្រើប្រាស់
      </BaseButton>
    </div>
    <BaseTable 
      :columns="col" 
      :data="arcticleStore.allArcticles" 
      :loading="arcticleStore.loading"
    >
        <template  #id="{ item }">
            <span class="text-success">{{ item.id }}</span>
        </template>
        
        <template #email="{ item }">
            <span class="text-primary">{{ item.email }}</span>
        </template>

        <template #role_name="{ item }">
            <span class="badge bg-light text-dark">{{ item.role?.name }}</span>
        </template>
        <template #status="{ item }">
            <span class="badge bg-light text-dark">{{ item.status }}</span>
        </template>
    </BaseTable>
    
  </div>
</template>
<script setup>
import BaseButton from '@/components/ui/base/BaseButton.vue';
import BaseTable from '@/components/ui/base/BaseTable.vue';
import { useArcticleStore } from '@/stores/useArcticleStore';

import { onMounted } from 'vue';


const arcticleStore=useArcticleStore();
onMounted(()=>{
  arcticleStore.fectchAllArcticles();
})
const col = [
    {key: 'id', label: 'ID'},
    {key: 'fullname', label: 'Full Name'},
    {key: 'email', label: 'Email'},
    {key: 'phone', label: 'Phone Number'},
    {key: 'role_name', label: 'Role'},
    {key: 'salary',label:'Salary'},
    {key: 'status',label:'Status'},
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
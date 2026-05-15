
<template>
  <div class="container-fluid p-4">
    <div class="d-flex justify-content-between align-items-center">
      <div class="mb-4 text-start">
        <h3 class="fw-bold text-dark mb-1">User Management</h3>
        <p class="text-muted small">Manage all system users, managers, and staff.</p>
      </div>
      <!-- // Create User Button -->
      <BaseButton @click="ishow = true">
        <template #icon>
          <span>+</span>
        </template>
        បង្កើតអ្នកប្រើប្រាស់
      </BaseButton>
    </div>
    <!-- search bar -->
    <BaseSearchBar class="mb-4" v-model="search" :items="arcticleStore.allArcticles" labelKey="fullname"
      @select="onSelectUser">
    </BaseSearchBar>
    <!-- table -->
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
    <!-- Pagination  -->
    <BasePagination class="mt-3" :currentPage="pagination.currentPage" :totalPages="pagination.totalPages"
      @change-page="changePage">
    </BasePagination>
    <!-- Modal create user -->
    <BaseModal :show="ishow" title="បង្កើតអ្នកប្រើប្រាស់" @close="ishow = false">
      <form>
        <div class="row g-3">
          <div class="col-md-6">

            <label class="form-label text-dark">ឈ្មោះពេញ *</label>
            <input type="text" class="form-control" placeholder="Enter full name">
          </div>
          <div class="col-md-6">
            <label class="form-label text-dark">អ៊ីម៉ែល *</label>
            <input type="email" class="form-control" placeholder="Enter email address">
          </div>

          <div class="col-md-6">
            <label class="form-label text-dark">លេខទូរស័ព្ទ *</label>
            <input type="text" class="form-control" placeholder="+1234567890">
          </div>
          <div class="col-md-6">
            <label class="form-label text-dark">ភេទ *</label>
            <select class="form-select">
              <option selected></option>
            </select>
          </div>

          <div class="col-md-6">
            <label class="form-label text-dark">ថ្ងៃ​​ ខែ​ ឆ្នាំកំណើត​ *</label>
            <input type="date" class="form-control">
          </div>
          <div class="col-md-6">
            <label class="form-label text-dark">កាលបរិច្ឆេទចូលធ្វើការ *</label>
            <input type="date" class="form-control">
          </div>

          <div class="col-md-6">
            <label class="form-label text-dark">ប្រាក់ខែ *</label>
            <input type="text" class="form-control" placeholder="Enter salary">
          </div>
          <div class="col-md-6">
            <label class="form-label text-dark">Role *</label>
            <select class="form-select">
              <option selected></option>
            </select>
          </div>

          <div class="col-12">
            <label class="form-label text-dark">លេខកូដសម្ងាត់ *</label>
            <input type="password" class="form-control" placeholder="Min. 8 characters">
          </div>
        </div>
      </form>

      <template #footer>
        <BaseButton><template #default>
            រក្សាទុក
          </template></BaseButton>
        <button class="btn btn-secondary" @click="ishow = false">
          បោះបង់
        </button>
      </template>
    </BaseModal>

  </div>
</template>
<script setup>
import BaseButton from '@/components/ui/base/BaseButton.vue';
import BaseModal from '@/components/ui/base/BaseModal.vue';
import BasePagination from '@/components/ui/base/BasePagination.vue';
import BaseSearchBar from '@/components/ui/base/BaseSearchBar.vue';
import BaseTable from '@/components/ui/base/BaseTable.vue';
import { useArcticleStore } from '@/stores/useArcticleStore';
import { storeToRefs } from 'pinia';

import { onMounted, ref } from 'vue';

const arcticleStore = useArcticleStore()
const { pagination } = storeToRefs(arcticleStore)
const ishow = ref(false)
const search = ref("");

const changePage = (page) => {
  arcticleStore.fectchAllArcticles(page)
}

const onSelectUser = (item) => {
  console.log("Selected:", item);
};
onMounted(() => {
  arcticleStore.fectchAllArcticles(1)
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
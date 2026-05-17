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
    <BaseSearchBar class="mb-4" v-model="search" :items="searchResults" labelKey="fullname"
      placeholder="Search by name or email" @select="onSelectUser" />
    <!-- table -->
    <BaseTable :columns="col" :data="arcticleStore.allArcticles" :loading="arcticleStore.loading" @row-click="goToUserDetail">
      <template #id="{ item }">
        <span class="text-success">{{ item.id }}</span>
      </template>
      <template #fullname="{ item }">
        <span class="fw-semibold">{{ item.fullname }}</span>
      </template>
 
      <template #email="{ item }">
        <span class="text-success">{{ item.email }}</span>
      </template>
      <template #phone="{ item }">
        <span class="fw-semibold">{{ item.phone }}</span></template>
      <template #role_name="{ item }">
        <span class="badge  active-color">{{
          item.role?.name }}</span>
      </template>
      <template #salary="{ item }">
        <span class="text-dark fw-semibold">$ {{ item.salary || currency }}</span>

      </template>
      <template #status="{ item }">
        <span :class="item.status === 'Active' ? 'non-active-color' : 'active-color'" class="badge">
          {{ item.status }}
        </span>
      </template>
    </BaseTable>
    <!-- Pagination  -->
    <BasePagination :currentPage="pagination.currentPage" :totalPages="pagination.totalPages"
      @change-page="changePage" />
    <!-- Modal create user -->
    <BaseModal :show="ishow" title="បង្កើតអ្នកប្រើប្រាស់" @close="ishow = false">
      <form @submit.prevent="saveUser">
        <div class="row g-3">

          <div class="col-md-6">
            <label class="form-label">ឈ្មោះពេញ *</label>
            <input v-model="newUser.fullname" type="text" class="form-control">
          </div>

          <div class="col-md-6">
            <label class="form-label">អ៊ីម៉ែល *</label>
            <input v-model="newUser.email" type="email" class="form-control">
          </div>

          <div class="col-md-6">
            <label class="form-label">លេខទូរស័ព្ទ *</label>
            <input v-model="newUser.phone" type="text" class="form-control">
          </div>

          <div class="col-md-6">
            <label class="form-label">ភេទ *</label>
            <select v-model="newUser.gender" class="form-select">
              <option value="">Select</option>
              <option value="MALE">MALE</option>
              <option value="FEMALE">FEMALE</option>
            </select>
          </div>

          <div class="col-md-6">
            <label class="form-label">ថ្ងៃកំណើត *</label>
            <input v-model="newUser.birthday" type="date" class="form-control">
          </div>

          <div class="col-md-6">
            <label class="form-label">ថ្ងៃចូលធ្វើការ *</label>
            <input v-model="newUser.hireDate" type="date" class="form-control">
          </div>

          <div class="col-md-6">
            <label class="form-label">ប្រាក់ខែ *</label>
            <input v-model="newUser.salary" type="number" class="form-control">
          </div>

          <div class="col-md-6">
            <label class="form-label">Role *</label>
            <select v-model="newUser.roleId" class="form-select" @change="handleRoleChange">
              <option value="">Select</option>
              <option :value="2">Manager</option>
              <option :value="3">Staff</option>
            </select>
          </div>
          <div class="col-md-6" v-if="newUser.roleId === 3">
            <label class="form-label">Manager ID *</label>
            <input v-model="newUser.managerId" type="number" class="form-control" placeholder="Enter manager ID">
          </div>

          <div class="col-12">
            <label class="form-label">លេខកូដសម្ងាត់ *</label>

            <div class="position-relative">
              <input v-model="newUser.password" :type="showPassword ? 'text' : 'password'" class="form-control pe-5" />

              <button type="button"
                class="btn position-absolute top-50 end-0 translate-middle-y border-0 bg-transparent"
                @click="showPassword = !showPassword" style="z-index: 10;">
                <i :class="showPassword ? 'bi bi-eye-slash' : 'bi bi-eye'"></i>
              </button>
            </div>
          </div>
        </div>
      </form>

      <template #footer>
        <BaseButton @click="saveUser">រក្សាទុក</BaseButton>

        <button class="btn btn-secondary" @click="ishow = false">
          បោះបង់
        </button>
      </template>
    </BaseModal>
   
  </div>
</template>
<script setup>
import { onMounted, ref } from 'vue';
import { storeToRefs } from 'pinia';

import BaseButton from '@/components/ui/base/BaseButton.vue';
import BaseModal from '@/components/ui/base/BaseModal.vue';

import BaseSearchBar from '@/components/ui/base/BaseSearchBar.vue';
import BaseTable from '@/components/ui/base/BaseTable.vue';

import { useArcticleStore } from '@/stores/useArcticleStore';
import BasePagination from '@/components/ui/base/BasePagination.vue';

import { useRouter } from 'vue-router';

const arcticleStore = useArcticleStore();
const router = useRouter();

const { pagination, search, searchResults } = storeToRefs(arcticleStore);
const ishow = ref(false);
const showPassword = ref(false);
const newUser = ref({
  fullname: "",
  email: "",
  password: "",
  roleId: null,
  phone: "",
  gender: "",
  birthday: "",
  hireDate: "",
  salary: null,
  managerId: null
});

const saveUser = async () => {
  try {
    // If role is Manager, don't send managerId
    if (newUser.value.roleId !== 3) {
      newUser.value.managerId = null;
    }

    await arcticleStore.createUser(newUser.value);

    ishow.value = false;

    // reset form
    Object.assign(newUser.value, {
      fullname: "",
      email: "",
      password: "",
      roleId: null,
      phone: "",
      gender: "",
      birthday: "",
      hireDate: "",
      salary: null,
      managerId: null
    });

    arcticleStore.fectchAllArcticles(1);

  } catch (error) {
    console.log("SAVE USER ERROR:", error.response?.data || error);
  }
};
const changePage = (page) => {
  arcticleStore.fectchAllArcticles(page);
};

const onSelectUser = (item) => {
  console.log("Selected:", item);
};


const goToUserDetail = (user) => {
  router.push({
    name: "adminUserDetail",
    params: { id: user.id }
  });
};

onMounted(() => {
  arcticleStore.fectchAllArcticles(1);
});

const col = [
  { key: 'id', label: 'ID' },
  { key: 'fullname', label: 'Full Name' },
  { key: 'email', label: 'Email' },
  { key: 'phone', label: 'Phone Number' },
  { key: 'role_name', label: 'Role' },
  { key: 'salary', label: 'Salary' },
  { key: 'status', label: 'Status' }
];
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
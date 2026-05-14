<script setup>
import { ref, onMounted, computed } from 'vue';
import { useGroupStore } from '@/stores/useGroupStore';
import GroupCard from '@/components/ui/base/GroupCard.vue';
import BasePagination from '@/components/ui/base/BasePagination.vue';
import Swal from 'sweetalert2';

const groupStore = useGroupStore();
const searchQuery = ref('');
const currentPage = ref(1);
const itemsPerPage = 6;

// ទាញទិន្នន័យពី API ពេល Component បើក
onMounted(async () => {
  await groupStore.fetchGroups();
});

// --- ដំណោះស្រាយសម្រាប់ Error: filter is not a function ---
const filteredGroups = computed(() => {
  // ការពារដោយប្រើ Array.isArray() បើមិនមែន Array ទេ ឱ្យវាប្រើ [] ជំនួស
  const allGroups = Array.isArray(groupStore.groups) ? groupStore.groups : [];
  
  return allGroups.filter(group => {
    // ឆែកមើលថាឈ្មោះក្រុមមានអក្សរដែលយើង Search ឬអត់
    const name = group.name ? String(group.name).toLowerCase() : '';
    return name.includes(searchQuery.value.toLowerCase());
  });
});

// គណនាចំនួនទំព័រសរុប
const totalPages = computed(() => {
  return Math.ceil(filteredGroups.value.length / itemsPerPage) || 1;
});

// កាត់យកតែ ៦ Card សម្រាប់បង្ហាញក្នុងទំព័រនីមួយៗ
const paginatedGroups = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage;
  const end = start + itemsPerPage;
  return filteredGroups.value.slice(start, end);
});

const handlePageChange = (page) => {
  currentPage.value = page;
  window.scrollTo({ top: 0, behavior: 'smooth' });
};

const handleDelete = async (id) => {
  const result = await Swal.fire({
    title: 'តើអ្នកប្រាកដទេ?',
    text: "ទិន្នន័យក្រុមនឹងត្រូវលុបចេញពីប្រព័ន្ធ!",
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#2D6A4F',
    confirmButtonText: 'បាទ លុបវា!',
    cancelButtonText: 'បោះបង់',
    reverseButtons: true
  });

  if (result.isConfirmed) {
    const success = await groupStore.deleteGroup(id);
    if (success) {
      Swal.fire({ title: 'លុបជោគជ័យ!', icon: 'success', timer: 1500, showConfirmButton: false });
    }
  }
};
</script>

<template>
  <div class="container-fluid p-4">
    <!-- Header -->
    <div class="d-flex justify-content-between align-items-center mb-4">
      <div>
        <h2 class="fw-bold">Group Management</h2>
        <p class="text-muted">Manage all groups in the system</p>
      </div>
      <button class="btn btn-success shadow-sm" style="background-color: #2D6A4F; border: none;">
        <i class="bi bi-plus-lg"></i> Create Group
      </button>
    </div>

    <!-- Search Bar -->
    <div class="row mb-4">
      <div class="col-12">
        <div class="input-group bg-white shadow-sm rounded">
          <span class="input-group-text bg-white border-0 ps-3">
            <i class="bi bi-search text-muted"></i>
          </span>
          <input 
            v-model="searchQuery" 
            type="text" 
            class="form-control border-0 py-2" 
            placeholder="Search groups by name..."
            @input="currentPage = 1"
          >
        </div>
      </div>
    </div>

    <!-- Display Cards -->
    <div class="row">
      <!-- បង្ហាញ Loading ពេលកំពុងទាញទិន្នន័យ -->
      <div v-if="groupStore.loading" class="text-center py-5">
        <div class="spinner-border text-success" role="status"></div>
        <p class="mt-2 text-muted">កំពុងទាញទិន្នន័យ...</p>
      </div>

      <template v-else>
        <!-- បង្ហាញ Card តាមរយៈ pagination -->
        <div 
          v-for="group in paginatedGroups" 
          :key="group.id" 
          class="col-md-6 col-lg-4 mb-4"
        >
          <GroupCard 
            :group="group" 
            @delete="handleDelete(group.id)" 
          />
        </div>

        <!-- បង្ហាញសារបើ Search រកមិនឃើញ -->
        <div v-if="filteredGroups.length === 0" class="col-12 text-center py-5">
          <p class="text-muted">មិនមានទិន្នន័យក្រុមបង្ហាញទេ</p>
        </div>
      </template>
    </div>

    <!-- Pagination (បង្ហាញតែពេលមាន Card លើសពី ៦) -->
    <div v-if="totalPages > 1" class="d-flex justify-content-center mt-3">
      <BasePagination 
        :total-pages="totalPages" 
        :current-page="currentPage" 
        @change-page="handlePageChange" 
      />
    </div>
  </div>
</template>
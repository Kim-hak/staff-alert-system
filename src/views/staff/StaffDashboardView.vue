<template>
  <div class="container-fluid p-4">
    <div class="mb-4 text-start">
      <h3 class="fw-bold text-dark mb-1">Dashboard</h3>
      <p class="text-muted small">Welcome back, {{ profile.fullname }}!</p>
    </div>

    <div class="row g-4 mb-4">
      <div class="col-12 col-md-4">
        <StatCard title="Monthly Salary" :value="'$' + salary.toLocaleString()" icon="bi bi-wallet2"
          icon-color="text-success" bg-color="bg-light-green" />
      </div>

      <div class="col-12 col-md-4">
        <StatCard title="Profile Status" :value="status" :value-color="status === 'ACTIVATED' ? '#2e7d32' : '#c62828'"
          icon="bi bi-person-check" icon-color="text-primary" bg-color="bg-light-blue" />
      </div>
    </div>

   
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
// Import Base Components
import StatCard from '@/components/ui/base/StatCard.vue';


// *ចំណាំ: អ្នកត្រូវដូរ Path Axios ទៅតាមរបស់ពិតរបស់អ្នក*
// import apiClient from '@/api/axios'; 

const router = useRouter();

// --- ១. State សម្រាប់ Stat Cards ---
const salary = ref(6250);
const status = ref('ACTIVATED');
const notiCount = ref(5);

// --- ២. State សម្រាប់ Quick Profile ---
const profile = ref({
  fullname: 'Staff User',
  email: 'staff@example.com',
  phone: '+1234567890',
  hireDate: '2023-01-15',
  avatar: '' // ដាក់ URL រូបភាពបើមាន
});

// --- ៣. State សម្រាប់ Recent Reports Table ---
const isLoadingReports = ref(false);

// កំណត់ Column សម្រាប់តារាង
const reportColumns = [
  { key: 'title', label: 'Report Title' },
  { key: 'period', label: 'Period' },
  { key: 'status', label: 'Status' }
];

// ទិន្នន័យគំរូ (Dummy Data) - អ្នកត្រូវហៅ API មកជំនួសនៅពេលក្រោយ
const recentReports = ref([
  { id: 1, title: 'Q1 2026 Performance', period: '2026 Q1', status: 'REVIEWED' },
  { id: 2, title: 'March Monthly Review', period: 'Mar 2026', status: 'SUBMITTED' },
  { id: 3, title: 'Annual Appraisal 2025', period: '2025 Full', status: 'REVIEWED' }
]);

// --- ៤. Functions ---
const viewReport = (item) => {
  // ចុចលើ View ដើម្បីបើកមើល Detail (អាច Route ទៅទំព័រ Detail ឬបើក Modal)
  console.log("Viewing report ID:", item.id);
  // router.push(`/staff/feedback/${item.id}`);
};

const fetchDashboardData = async () => {
  // នៅទីនេះ អ្នកអាចសរសេរកូដហៅ API ដូចដែលខ្ញុំបង្ហាញនៅខាងលើ (apiClient.get...)
  // ឧទាហរណ៍៖
  // isLoadingReports.value = true;
  // try { ... } catch (e) { ... } finally { isLoadingReports.value = false; }
};

onMounted(() => {
  fetchDashboardData();
});
</script>

<style scoped>
.tracking-wider {
  letter-spacing: 1px;
}
</style>

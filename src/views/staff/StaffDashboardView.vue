<template>
  <div class="container-fluid p-4">
    <div class="mb-4 text-start">
      <h3 class="fw-bold text-dark mb-1">Dashboard</h3>
      <p class="text-muted small">Welcome back, {{ profile.fullname }}!</p>
    </div>

    <div class="row g-4 mb-4">
      <div class="col-12 col-md-4">
        <StatCard 
          title="Monthly Salary" 
          :value="'$' + salary.toLocaleString()" 
          icon="bi bi-wallet2" 
          icon-color="text-success"
          bg-color="bg-light-green" 
        />
      </div>
      
      <div class="col-12 col-md-4">
        <StatCard 
          title="Profile Status" 
          :value="status" 
          :value-color="status === 'ACTIVATED' ? '#2e7d32' : '#c62828'"
          icon="bi bi-person-check" 
          icon-color="text-primary"
          bg-color="bg-light-blue" 
        />
      </div>

      <div class="col-12 col-md-4">
        <StatCard 
          title="Notifications" 
          :value="notiCount" 
          value-color="#f57f17"
          icon="bi bi-bell" 
          icon-color="text-warning"
          bg-color="bg-light-orange" 
        />
      </div>
    </div>

    <div class="row g-4">
      
      <div class="col-12 col-lg-8">
        <BaseCard title="Recent Feedback & Reports">
          <BaseTable 
            :columns="reportColumns" 
            :data="recentReports" 
            :loading="isLoadingReports"
          >
            <template #status="{ item }">
              <BaseBadge :type="item.status === 'REVIEWED' ? 'success' : 'warning'">
                {{ item.status }}
              </BaseBadge>
            </template>
            
            <template #actions="{ item }">
              <button class="btn btn-sm btn-light text-primary" @click="viewReport(item)" title="View Details">
                <i class="bi bi-eye"></i> View
              </button>
            </template>
          </BaseTable>
          
          <div class="text-end mt-3">
            <router-link to="/staff/feedback" class="text-decoration-none text-success small fw-medium">
              View All Reports <i class="bi bi-arrow-right"></i>
            </router-link>
          </div>
        </BaseCard>
      </div>

      <div class="col-12 col-lg-4">
  <BaseCard title="Recent Notifications">
    <template #headerAction>
      <span class="badge bg-danger rounded-pill px-2 py-1" style="font-size: 0.75rem;">{{ notiCount }} New</span>
    </template>
    
    <div class="notification-list mt-2">
      <div class="d-flex align-items-start border-bottom pb-3 mb-3">
        <div class="bg-light-orange p-2 rounded-circle me-3 d-flex align-items-center justify-content-center" style="width: 40px; height: 40px;">
          <i class="bi bi-gift text-warning fs-5"></i>
        </div>
        <div>
          <p class="mb-1 fw-bold text-dark" style="font-size: 0.9rem;">Happy Work Anniversary!</p>
          <p class="text-muted small mb-0">2 hours ago</p>
        </div>
      </div>
      
      <div class="d-flex align-items-start border-bottom pb-3 mb-3">
        <div class="bg-light-green p-2 rounded-circle me-3 d-flex align-items-center justify-content-center" style="width: 40px; height: 40px;">
          <i class="bi bi-file-earmark-text text-success fs-5"></i>
        </div>
        <div>
          <p class="mb-1 fw-bold text-dark" style="font-size: 0.9rem;">New Feedback Submitted</p>
          <p class="text-muted small mb-0">Yesterday at 10:30 AM</p>
        </div>
      </div>

      </div>

    <router-link to="/staff/notifications" class="w-100 text-decoration-none mt-2 d-block">
      <BaseButton variant="outline" fullWidth>
        View All <i class="bi bi-arrow-right ms-1"></i>
      </BaseButton>
    </router-link>
  </BaseCard>
</div>

    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
// Import Base Components
import StatCard from '@/components/ui/base/StatCard.vue';
import BaseCard from '@/components/ui/base/BaseCard.vue';
import BaseTable from '@/components/ui/base/BaseTable.vue';
import BaseBadge from '@/components/ui/base/BaseBadge.vue';
import BaseButton from '@/components/ui/base/BaseButton.vue';

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
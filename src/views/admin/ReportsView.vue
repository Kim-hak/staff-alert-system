<script setup>
import { ref, onMounted, computed } from 'vue';
import { useReportStore } from '@/stores/useReportManagerStore';
import BasePagination from '@/components/ui/base/BasePagination.vue';
import Swal from 'sweetalert2';

const reportStore = useReportStore();
const searchQuery = ref('');
const currentPage = ref(1);
const itemsPerPage = 6;
const authStore = useAuthStore();

onMounted(() => {
  reportStore.fetchReports(); // វានឹងឆែក Role ដោយស្វ័យប្រវត្តក្នុង Store
});

// ទាញទិន្នន័យពេល Component បើកដំបូង
onMounted(async () => {
  await reportStore.fetchAllReports();
});

// ប្រើ Getter ពី Store ដើម្បីបង្ហាញលេខលើ Stat Cards
const stats = computed(() => reportStore.reportStats);

// Logic សម្រាប់ស្វែងរក
const filteredReports = computed(() => {
  const all = Array.isArray(reportStore.reports) ? reportStore.reports : [];
  return all.filter(r => 
    r.title?.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
    r.staff?.fullname?.toLowerCase().includes(searchQuery.value.toLowerCase())
  );
});

// កាត់ទិន្នន័យបង្ហាញតាមទំព័រ
const paginatedReports = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage;
  return filteredReports.value.slice(start, start + itemsPerPage);
});

const totalPages = computed(() => Math.ceil(filteredReports.value.length / itemsPerPage) || 1);

const handlePageChange = (page) => {
  currentPage.value = page;
  window.scrollTo({ top: 0, behavior: 'smooth' });
};

// មុខងារមើលលម្អិត
const handleView = (report) => {
  Swal.fire({
    title: `<span class="text-success">${report.title}</span>`,
    html: `
      <div class="text-start border-top pt-3">
        <p><strong>បុគ្គលិក:</strong> ${report.staff?.fullname}</p>
        <p><strong>អ្នកគ្រប់គ្រង:</strong> ${report.manager?.fullname || 'មិនទាន់មាន'}</p>
        <p><strong>ពិន្ទុវាយតម្លៃ:</strong> ${report.rating}/5</p>
        <p><strong>មតិយោបល់:</strong> ${report.comment || 'គ្មាន'}</p>
      </div>
    `,
    confirmButtonText: 'យល់ព្រម',
    confirmButtonColor: '#2D6A4F'
  });
};

// មុខងារលុប
const handleDelete = async (id) => {
  const result = await Swal.fire({
    title: 'តើអ្នកប្រាកដទេ?',
    text: "របាយការណ៍នេះនឹងត្រូវលុបចេញពីប្រព័ន្ធ!",
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#2D6A4F',
    cancelButtonColor: '#d33',
    confirmButtonText: 'បាទ លុបវា!',
    cancelButtonText: 'បោះបង់',
    reverseButtons: true
  });

  if (result.isConfirmed) {
    const success = await reportStore.deleteReport(id);
    if (success) {
      Swal.fire({
        title: 'លុបជោគជ័យ!',
        icon: 'success',
        timer: 1500,
        showConfirmButton: false
      });
    }
  }
};
</script>

<template>
  <div class="reports-container p-4">
    <!-- ចំណងជើងផ្នែកខាងលើ -->
    <div class="mb-4">
      <h2 class="fw-bold text-dark">របាយការណ៍ការងារ</h2>
      <p class="text-muted">ពិនិត្យ និងគ្រប់គ្រងរាល់របាយការណ៍ការងារទាំងអស់ក្នុងប្រព័ន្ធ</p>
    </div>

    <!-- ប្រអប់ស្វែងរក -->
    <div class="row mb-4">
      <div class="col-12 col-md-8">
        <div class="input-group bg-white shadow-sm rounded-3">
          <span class="input-group-text bg-white border-0 ps-3">
            <i class="bi bi-search text-muted"></i>
          </span>
          <input 
            v-model="searchQuery" 
            type="text" 
            class="form-control border-0 py-2" 
            placeholder="ស្វែងរករបាយការណ៍តាមចំណងជើង ឬឈ្មោះបុគ្គលិក..."
            @input="currentPage = 1"
          >
        </div>
      </div>
    </div>

    <!-- ផ្នែក Stat Cards (ដូចក្នុង image_551820.png) -->
    <div class="row g-4 mb-4">
      <div class="col-md-4">
        <div class="stat-card card-pending shadow-sm p-4">
          <div class="stat-label">រង់ចាំការពិនិត្យ </div>
          <div class="stat-value text-warning">{{ stats.pending }}</div>
        </div>
      </div>
      <div class="col-md-4">
        <div class="stat-card card-reviewed shadow-sm p-4">
          <div class="stat-label">បានពិនិត្យរួចរាល់</div>
          <div class="stat-value text-success">{{ stats.reviewed }}</div>
        </div>
      </div>
      <div class="col-md-4">
        <div class="stat-card card-total shadow-sm p-4">
          <div class="stat-label">របាយការណ៍សរុប</div>
          <div class="stat-value text-teal">{{ stats.total }}</div>
        </div>
      </div>
    </div>

    <!-- តារាងរបាយការណ៍ -->
    <div class="card border-0 shadow-sm rounded-4 overflow-hidden">
      <div class="table-responsive">
        <table class="table align-middle mb-0">
          <thead class="table-light-custom text-uppercase small fw-bold">
            <tr>
              <th class="ps-4">ល.រ </th>
              <th>ចំណងជើង </th>
              <th>បុគ្គលិក </th>
              <th>អ្នកគ្រប់គ្រង </th>
              <th>រយៈពេល</th>
              <th>ស្ថានភាព </th>
              <th>ថ្ងៃបញ្ជូន </th>
              <th class="text-center pe-4">សកម្មភាព </th>
            </tr>
          </thead>
          <tbody>
            <tr v-if="reportStore.isLoading">
              <td colspan="8" class="text-center py-5">
                <div class="spinner-border text-success" role="status"></div>
                <p class="mt-2 text-muted">កំពុងទាញទិន្នន័យ...</p>
              </td>
            </tr>
            <template v-else>
              <tr v-for="r in paginatedReports" :key="r.id" class="border-bottom">
                <td class="ps-4 text-muted">{{ r.id }}</td>
                <td class="fw-bold text-dark">{{ r.title }}</td>
                <td>{{ r.staff?.fullname }}</td>
                <td>{{ r.manager?.fullname || '—' }}</td>
                <td>{{ r.reportPeriodStart ? new Date(r.reportPeriodStart).getFullYear() : '—' }}</td>
                <td>
                  <span :class="['status-badge', r.status === 'REVIEWED' ? 'bg-success-light' : 'bg-pending-light']">
                    {{ r.status === 'REVIEWED' ? 'បានពិនិត្យ' : 'រង់ចាំពិនិត្យ' }}
                  </span>
                </td>
                <td class="text-muted small">{{ new Date(r.createdAt).toLocaleDateString('km-KH') }}</td>
                <td class="text-center pe-4">
                  <div class="d-flex justify-content-center gap-2">
                    <button @click="handleView(r)" class="btn-icon view-btn" title="មើលលម្អិត">
                      <i class="bi bi-eye"></i>
                    </button>
                    <button @click="handleDelete(r.id)" class="btn-icon delete-btn" title="លុប">
                      <i class="bi bi-trash"></i>
                    </button>
                  </div>
                </td>
              </tr>
              <tr v-if="filteredReports.length === 0">
                <td colspan="8" class="text-center py-5 text-muted">មិនមានទិន្នន័យរបាយការណ៍បង្ហាញទេ</td>
              </tr>
            </template>
          </tbody>
        </table>
      </div>
    </div>

    <!-- ការបែងចែកទំព័រ -->
    <div v-if="totalPages > 1" class="d-flex justify-content-center mt-4">
      <BasePagination 
        :total-pages="totalPages" 
        :current-page="currentPage" 
        @change-page="handlePageChange" 
      />
    </div>
  </div>
</template>

<style scoped>
.reports-container { background-color: #f8fbfc; min-height: 100vh; }

/* Stat Cards Styling */
.stat-card { background: white; border-radius: 15px; border-left: 6px solid #2D6A4F; transition: transform 0.2s; }
.stat-card:hover { transform: translateY(-5px); }
.stat-label { font-size: 0.85rem; font-weight: 600; color: #6c757d; }
.stat-value { font-size: 2.5rem; font-weight: 800; margin-top: 5px; }

.text-teal { color: #20c997; }

/* Table Styling */
.table-light-custom { background-color: #f1f4f6; color: #495057; }
.table-light-custom th { padding: 15px 10px; border: none; }

.status-badge {
  padding: 6px 12px;
  border-radius: 50px;
  font-size: 0.7rem;
  font-weight: 700;
  text-transform: uppercase;
}
.bg-success-light { background-color: #d1f2eb; color: #16a085; }
.bg-pending-light { background-color: #fef5e7; color: #f39c12; }

/* Action Buttons */
.btn-icon { background: none; border: none; font-size: 1.2rem; transition: 0.2s; }
.view-btn { color: #2D6A4F; }
.delete-btn { color: #e74c3c; }
.btn-icon:hover { transform: scale(1.2); }
</style>
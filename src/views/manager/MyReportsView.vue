<template>
  <div class="page-container">
    <!-- Header Section -->
    <header class="d-flex justify-content-between align-items-center mb-4">
      <div>
        <h2 class="fw-bold text-dark mb-1">របាយការណ៍របស់ខ្ញុំ</h2>
        <p class="text-muted small mb-0">
          បង្កើត និងគ្រប់គ្រងរបាយការណ៍លទ្ធផលការងារសម្រាប់បុគ្គលិករបស់អ្នក
        </p>
      </div>
      <button class="btn btn-primary-custom d-flex align-items-center gap-2 px-3 py-2 rounded-3 shadow-sm"
        @click="openCreateReportModal">
        <i class="bi bi-plus-lg"></i>
        <span>បង្កើតរបាយការណ៍ថ្មី</span>
      </button>
    </header>

    <!-- Create Report Modal -->
    <BaseModal :show="showCreateReportModal" title="បង្កើតរបាយការណ៍ថ្មី" @close="closeCreateReportModal">
      <form @submit.prevent="handleCreateReport">
        <div class="mb-3">
          <label class="form-label fw-medium text-dark">ចំណងជើងរបាយការណ៍ <span class="text-danger">*</span></label>
          <input v-model="newReport.title" type="text" class="form-control rounded-3" required />
        </div>

        <div class="row mb-3">
          <div class="col-md-6">
            <label class="form-label fw-medium text-dark">បុគ្គលិក <span class="text-danger">*</span></label>
            <select v-model="newReport.staffId" class="form-select rounded-3" required>
              <option value="" disabled>ជ្រើសរើសបុគ្គលិក</option>
              <option v-for="staff in userStore.myStaff" :key="staff.id" :value="staff.id">
                {{ staff.fullname }}
              </option>
            </select>
          </div>
          <div class="col-md-6">
            <label class="form-label fw-medium text-dark">Rating (1-5) <span class="text-danger">*</span></label>
            <select v-model="newReport.rating" class="form-select rounded-3" required>
              <option value="" disabled>ជ្រើសរើស Rating</option>
              <option v-for="n in 5" :key="n" :value="n">
                {{ n }} - {{ getRatingLabel(n) }}
              </option>
            </select>
          </div>
        </div>

        <div class="row mb-3">
          <div class="col-md-6">
            <label class="form-label fw-medium text-dark">ថ្ងៃចាប់ផ្តើម <span class="text-danger">*</span></label>
            <input v-model="newReport.reportPeriodStart" type="date" class="form-control rounded-3" required />
          </div>
          <div class="col-md-6">
            <label class="form-label fw-medium text-dark">ថ្ងៃបញ្ចប់ <span class="text-danger">*</span></label>
            <input v-model="newReport.reportPeriodEnd" type="date" class="form-control rounded-3" required />
          </div>
        </div>

        <div class="mb-3">
          <label class="form-label fw-medium text-dark">សង្ខេបការងារ</label>
          <textarea v-model="newReport.performanceSummary" class="form-control rounded-3" rows="2"></textarea>
        </div>
        <div class="mb-3">
          <label class="form-label fw-medium text-dark">សមិទ្ធផល</label>
          <textarea v-model="newReport.achievement" class="form-control rounded-3" rows="2"></textarea>
        </div>
        <div class="mb-3">
          <label class="form-label fw-medium text-dark">ចំណុចត្រូវកែលម្អ</label>
          <textarea v-model="newReport.areaForImprove" class="form-control rounded-3" rows="2"></textarea>
        </div>
        <div class="mb-4">
          <label class="form-label fw-medium text-dark">មតិយោបល់</label>
          <textarea v-model="newReport.comment" class="form-control rounded-3" rows="2"></textarea>
        </div>

        <div class="d-flex justify-content-end gap-2">
          <button type="button" class="btn btn-light rounded-pill px-4" @click="closeCreateReportModal">
            បោះបង់
          </button>
          <button type="submit" class="btn btn-primary-custom rounded-pill px-4" :disabled="isSubmitting">
            <span v-if="isSubmitting" class="spinner-border spinner-border-sm me-1"></span>
            បង្កើតរបាយការណ៍
          </button>
        </div>
      </form>
    </BaseModal>

    <!-- Edit Report Modal -->
    <BaseModal :show="showEditReportModal" title="កែសម្រួលរបាយការណ៍" @close="closeEditReportModal">
      <form @submit.prevent="handleUpdateReport">
        <div class="mb-3">
          <label class="form-label fw-medium text-dark">ចំណងជើងរបាយការណ៍</label>
          <input v-model="editReport.title" type="text" class="form-control rounded-3" />
        </div>

        <div class="row mb-3">
          <div class="col-md-6">
            <label class="form-label fw-medium text-dark">បុគ្គលិក</label>
            <select v-model="editReport.staffId" class="form-select rounded-3">
              <option value="" disabled>ជ្រើសរើសបុគ្គលិក</option>
              <option v-for="staff in userStore.myStaff" :key="staff.id" :value="staff.id">
                {{ staff.fullname }}
              </option>
            </select>
          </div>
          <div class="col-md-6">
            <label class="form-label fw-medium text-dark">Rating (1-5)</label>
            <select v-model="editReport.rating" class="form-select rounded-3">
              <option value="" disabled>ជ្រើសរើស Rating</option>
              <option v-for="n in 5" :key="n" :value="n">
                {{ n }} - {{ getRatingLabel(n) }}
              </option>
            </select>
          </div>
        </div>

        <div class="row mb-3">
          <div class="col-md-6">
            <label class="form-label fw-medium text-dark">ថ្ងៃចាប់ផ្តើម</label>
            <input v-model="editReport.reportPeriodStart" type="date" class="form-control rounded-3" />
          </div>
          <div class="col-md-6">
            <label class="form-label fw-medium text-dark">ថ្ងៃបញ្ចប់</label>
            <input v-model="editReport.reportPeriodEnd" type="date" class="form-control rounded-3" />
          </div>
        </div>

        <div class="mb-3">
          <label class="form-label fw-medium text-dark">សង្ខេបការងារ</label>
          <textarea v-model="editReport.performanceSummary" class="form-control rounded-3" rows="2"></textarea>
        </div>
        <div class="mb-3">
          <label class="form-label fw-medium text-dark">សមិទ្ធផល</label>
          <textarea v-model="editReport.achievement" class="form-control rounded-3" rows="2"></textarea>
        </div>
        <div class="mb-3">
          <label class="form-label fw-medium text-dark">ចំណុចត្រូវកែលម្អ</label>
          <textarea v-model="editReport.areaForImprove" class="form-control rounded-3" rows="2"></textarea>
        </div>
        <div class="mb-4">
          <label class="form-label fw-medium text-dark">មតិយោបល់</label>
          <textarea v-model="editReport.comment" class="form-control rounded-3" rows="2"></textarea>
        </div>

        <div class="d-flex justify-content-end gap-2">
          <button type="button" class="btn btn-light rounded-pill px-4" @click="closeEditReportModal">
            បោះបង់
          </button>
          <button type="submit" class="btn btn-primary-custom rounded-pill px-4" :disabled="isSubmitting">
            <span v-if="isSubmitting" class="spinner-border spinner-border-sm me-1"></span>
            រក្សាទុកការកែប្រែ
          </button>
        </div>
      </form>
    </BaseModal>

    <!-- Reports Table Card -->
    <div class="card border-0 shadow-sm rounded-4 overflow-hidden">
      <div class="table-responsive">
        <table class="table table-hover align-middle mb-0">
          <thead class="bg-light-subtle">
            <tr>
              <th class="ps-4 py-3 text-secondary fw-semibold small">
                ចំណងជើង
              </th>
              <th class="py-3 text-secondary fw-semibold small">បុគ្គលិក</th>
              <th class="py-3 text-secondary fw-semibold small">រយៈពេល</th>
              <th class="py-3 text-secondary fw-semibold small">ស្ថានភាព</th>
              <th class="pe-4 py-3 text-secondary fw-semibold small text-center">
                សកម្មភាព
              </th>
            </tr>
          </thead>
          <tbody>
            <tr v-if="reportStore.isLoading">
              <td colspan="5" class="text-center py-5">
                <div class="spinner-border text-primary-custom" role="status">
                  <span class="visually-hidden">Loading...</span>
                </div>
              </td>
            </tr>
            <tr v-else-if="reportStore.error">
              <td colspan="5" class="text-center py-5 text-danger">
                <i class="bi bi-exclamation-triangle me-2"></i>
                {{ reportStore.error }}
                <button class="btn btn-sm btn-outline-danger ms-3" @click="fetchReports">
                  ព្យាយាមម្តងទៀត
                </button>
              </td>
            </tr>
            <tr v-else-if="reportStore.reports.length === 0">
              <td colspan="5" class="text-center py-5 text-muted">
                មិនមានរបាយការណ៍ទេ
              </td>
            </tr>
            <tr v-for="report in reportStore.reports" :key="report.id">
              <td class="ps-4 py-3 fw-medium text-dark">{{ report.title }}</td>
              <td class="py-3 text-muted">{{ report.staff?.fullname }}</td>
              <td class="py-3 text-muted">
                {{ formatDate(report.reportPeriodStart) }} -
                {{ formatDate(report.reportPeriodEnd) }}
              </td>
              <td class="py-3">
                <span :class="['status-badge', getStatusClass(report.status)]">
                  {{ getStatusLabel(report.status) }}
                </span>
              </td>
              <td class="pe-4 py-3 text-center">
                <div class="d-flex justify-content-center gap-2">
                  <template v-if="report.status === 'DRAFT'">
                    <button class="btn btn-icon text-primary" title="Edit" @click="openEditReportModal(report)">
                      <i class="bi bi-pencil-square"></i>
                    </button>
                    <button class="btn btn-icon text-success" title="Submit" @click="confirmSubmit(report.id)">
                      <i class="bi bi-send"></i>
                    </button>
                  </template>
                  <button class="btn btn-icon text-secondary" title="View" @click="viewReportDetails(report.id)">
                    <i class="bi bi-eye"></i>
                  </button>
                  <button v-if="report.status === 'DRAFT'" class="btn btn-icon text-danger" title="Delete"
                    @click="confirmDelete(report.id)">
                    <i class="bi bi-trash"></i>
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Delete Confirmation Modal -->
    <BaseModal :show="showDeleteConfirmModal" title="បញ្ជាក់ការលុប" @close="showDeleteConfirmModal = false">
      <p class="text-center mb-4">តើអ្នកប្រាកដជាចង់លុបរបាយការណ៍នេះមែនទេ?</p>
      <div class="d-flex justify-content-center gap-3">
        <button class="btn btn-light rounded-pill px-4" @click="showDeleteConfirmModal = false">
          បោះបង់
        </button>
        <button class="btn btn-danger rounded-pill px-4" @click="executeDelete">
          លុប
        </button>
      </div>
    </BaseModal>

    <!-- Submit Confirmation Modal -->
    <BaseModal :show="showSubmitConfirmModal" title="បញ្ជាក់ការដាក់ជូន" @close="showSubmitConfirmModal = false">
      <p class="text-center mb-4">
        តើអ្នកប្រាកដជាចង់ដាក់ជូនរបាយការណ៍នេះមែនទេ? បន្ទាប់ពីដាក់ជូន
        អ្នកមិនអាចកែប្រែបានទេ។
      </p>
      <div class="d-flex justify-content-center gap-3">
        <button class="btn btn-light rounded-pill px-4" @click="showSubmitConfirmModal = false">
          បោះបង់
        </button>
        <button class="btn btn-primary-custom rounded-pill px-4" @click="executeSubmit">
          ដាក់ជូន
        </button>
      </div>
    </BaseModal>

    <!-- Report Detail Modal -->
    <BaseModal :show="showReportDetailModal" title="ការមើលលទ្ធផលការងារបុគ្គលិក" @close="showReportDetailModal = false">
      <div v-if="selectedReport">
        <div class="d-flex justify-content-between align-items-center mb-3">
          <h4 class="fw-bold text-dark mb-0">{{ selectedReport.title }}</h4>
          <span :class="['status-badge', getStatusClass(selectedReport.status)]">
            {{ getStatusLabel(selectedReport.status) }}
          </span>
        </div>

        <div class="row g-3 mb-4">
          <div class="col-md-6">
            <div class="info-box p-3 rounded-3 bg-light">
              <label class="small text-muted mb-1 d-block">បុគ្គលិក</label>
              <span class="fw-medium text-dark">{{
                selectedReport.staff?.fullname
              }}</span>
            </div>
          </div>
          <div class="col-md-6">
            <div class="info-box p-3 rounded-3 bg-light">
              <label class="small text-muted mb-1 d-block">រយៈពេល</label>
              <span class="fw-medium text-dark">
                {{ formatDate(selectedReport.reportPeriodStart) }} -
                {{ formatDate(selectedReport.reportPeriodEnd) }}
              </span>
            </div>
          </div>
        </div>

        <div class="mb-4">
          <label class="small text-muted mb-1 d-block">Rating</label>
          <div class="d-flex align-items-center gap-1">
            <i v-for="n in 5" :key="n" :class="[
              'bi',
              n <= selectedReport.rating
                ? 'bi-star-fill text-warning'
                : 'bi-star text-muted',
            ]"></i>
            <span class="ms-2 text-muted small">({{ getRatingLabel(selectedReport.rating) }})</span>
          </div>
        </div>

        <div class="mb-3">
          <label class="small text-muted mb-1 d-block">សង្ខេបការងារ</label>
          <p class="fw-medium text-dark">
            {{ selectedReport.performanceSummary || "N/A" }}
          </p>
        </div>
        <div class="mb-3">
          <label class="small text-muted mb-1 d-block">សមិទ្ធផល</label>
          <p class="fw-medium text-dark">
            {{ selectedReport.achievement || "N/A" }}
          </p>
        </div>
        <div class="mb-3">
          <label class="small text-muted mb-1 d-block">ចំណុចត្រូវកែលម្អ</label>
          <p class="fw-medium text-dark">
            {{ selectedReport.areaForImprove || "N/A" }}
          </p>
        </div>
        <div class="mb-4">
          <label class="small text-muted mb-1 d-block">មតិយោបល់</label>
          <p class="fw-medium text-dark">
            {{ selectedReport.comment || "N/A" }}
          </p>
        </div>
      </div>
      <div v-else class="text-center py-4 text-muted">
        <div class="spinner-border text-primary-custom" role="status">
          <span class="visually-hidden">Loading...</span>
        </div>
        <p class="mt-2">កំពុងទាញយកព័ត៌មានលម្អិត...</p>
      </div>
      <template #footer>
        <button class="btn btn-light rounded-pill px-4" @click="showReportDetailModal = false">
          បិទ
        </button>
      </template>
    </BaseModal>
  </div>
</template>

<script setup>
import { ref, onMounted, reactive } from "vue";
import { useReportStore } from "@/stores/useReportManagerStore";
import { useUserStore } from "@/stores/userStore";
import BaseModal from "@/components/ui/base/BaseModal.vue";
import { useToast } from "vue-toastification";
import { useNotificationStore } from "@/stores/useNotificationStore";


const reportStore = useReportStore();
const userStore = useUserStore();
const toast = useToast();
const notificationStore = useNotificationStore()


const showCreateReportModal = ref(false);
const isSubmitting = ref(false);
const showDeleteConfirmModal = ref(false);
const reportToDeleteId = ref(null);
const showSubmitConfirmModal = ref(false);
const reportToSubmitId = ref(null);
const showReportDetailModal = ref(false);
const showEditReportModal = ref(false);
const selectedReport = ref(null);


const newReport = reactive({
  title: "",
  performanceSummary: "",
  achievement: "",
  areaForImprove: "",
  comment: "",
  rating: "",
  staffId: "",
  reportPeriodStart: "",
  reportPeriodEnd: "",
});

const editReport = reactive({
  id: null,
  title: "",
  performanceSummary: "",
  achievement: "",
  areaForImprove: "",
  comment: "",
  rating: "",
  staffId: "",
  reportPeriodStart: "",
  reportPeriodEnd: "",
});

const openCreateReportModal = () => {
  showCreateReportModal.value = true;
};

const closeCreateReportModal = () => {
  showCreateReportModal.value = false;
  // Reset form
  Object.assign(newReport, {
    title: "",
    performanceSummary: "",
    achievement: "",
    areaForImprove: "",
    comment: "",
    rating: "",
    staffId: "",
    reportPeriodStart: "",
    reportPeriodEnd: "",
  });
};

const openEditReportModal = (report) => {
  Object.assign(editReport, {
    id: report.id,
    title: report.title || "",
    performanceSummary: report.performanceSummary || "",
    achievement: report.achievement || "",
    areaForImprove: report.areaForImprove || "",
    comment: report.comment || "",
    rating: report.rating || "",
    staffId: report.staffId || report.staff?.id || "",
    reportPeriodStart: report.reportPeriodStart
      ? report.reportPeriodStart.split("T")[0]
      : "",
    reportPeriodEnd: report.reportPeriodEnd
      ? report.reportPeriodEnd.split("T")[0]
      : "",
  });
  showEditReportModal.value = true;
};

const closeEditReportModal = () => {
  showEditReportModal.value = false;
};

const handleUpdateReport = async () => {
  isSubmitting.value = true;
  try {
    const { id, ...rawPayload } = editReport;

    // Clean payload: Convert types and remove empty fields
    const payload = {};
    Object.keys(rawPayload).forEach((key) => {
      const value = rawPayload[key];
      // API Update usually doesn't allow changing staffId
      if (key === "staffId") return;

      if (value !== "" && value !== null && value !== undefined) {
        if (key === "rating") {
          payload[key] = Number(value);
        } else {
          payload[key] = value;
        }
      }
    });

    await reportStore.updateReport(id, payload);
    toast.success("បានកែសម្រួលរបាយការណ៍ដោយជោគជ័យ!");
    closeEditReportModal();
    fetchReports();
  } catch (error) {
    console.error("Update error details:", error);
    const errorMessage =
      error.response?.data?.message ||
      error.message ||
      "បរាជ័យក្នុងការកែសម្រួលរបាយការណ៍";
    toast.error(errorMessage);
  } finally {
    isSubmitting.value = false;
  }
};

const handleCreateReport = async () => {
  if (
    !newReport.title ||
    !newReport.staffId ||
    !newReport.rating ||
    !newReport.reportPeriodStart ||
    !newReport.reportPeriodEnd
  ) {
    toast.error("សូមបំពេញព័ត៌មានដែលតម្រូវឱ្យបញ្ចូល។");
    return;
  }

  isSubmitting.value = true;
  try {
    await reportStore.createReport(newReport);
    toast.success("បានបង្កើតរបាយការណ៍ដោយជោគជ័យ!");
    closeCreateReportModal();
    fetchReports(); // Refresh the list
  } catch (error) {
    toast.error(error.message || "បរាជ័យក្នុងការបង្កើតរបាយការណ៍");
  } finally {
    isSubmitting.value = false;
  }
};

const getRatingLabel = (rating) => {
  switch (rating) {
    case 1:
      return "អន់ណាស់";
    case 2:
      return "មិនល្អ";
    case 3:
      return "មធ្យម";
    case 4:
      return "ល្អ";
    case 5:
      return "ល្អឥតខ្ចោះ";
    default:
      return "";
  }
};

const getStatusLabel = (status) => {
  switch (status) {
    case "REVIEWED":
      return "បានពិនិត្យ";
    case "DRAFT":
      return "ព្រាង";
    case "SUBMITTED":
      return "បានដាក់ជូន";
    default:
      return status;
  }
};

const handleDelete = async () => {
  if (reportToDeleteId.value) {
    try {
      await reportStore.deleteReport(reportToDeleteId.value);
      toast.success("បានលុបរបាយការណ៍ដោយជោគជ័យ!");
      await fetchReports();
    } catch (error) {
      toast.error(error.message || "បរាជ័យក្នុងការលុបរបាយការណ៍");
    } finally {
      showDeleteConfirmModal.value = false;
      reportToDeleteId.value = null;
    }
  }
};

const confirmDelete = (id) => {
  reportToDeleteId.value = id;
  showDeleteConfirmModal.value = true;
};

const executeDelete = () => {
  handleDelete();
};

const confirmSubmit = (id) => {
  reportToSubmitId.value = id;
  showSubmitConfirmModal.value = true;
};

const executeSubmit = async () => {
  if (reportToSubmitId.value) {
    try {
      await reportStore.submitReport(reportToSubmitId.value)

      const report = reportStore.reports.find(r => r.id === reportToSubmitId.value)

      notificationStore.addLocalNotification({
        id: Date.now(),
        title: "New Report Submitted",
        message: `Manager submitted: ${report?.title || ''}`,
        isRead: false,
        time: new Date().toLocaleString(),
        icon: "bi bi-file-earmark-text",
        typeClass: "bg-info bg-opacity-10 text-info"
      })

      toast.success("បានដាក់ជូនរបាយការណ៍ដោយជោគជ័យ!")
      await fetchReports()
    } catch (error) {
      toast.error(error.message || "បរាជ័យ")
    } finally {
      showSubmitConfirmModal.value = false
      reportToSubmitId.value = null
    }
  }
}

const viewReportDetails = async (id) => {
  showReportDetailModal.value = true;
  selectedReport.value = null; // Clear previous data
  try {
    selectedReport.value = await reportStore.fetchReportById(id);
  } catch (error) {
    toast.error(error.message || "បរាជ័យក្នុងការទាញយកព័ត៌មានលម្អិតរបាយការណ៍");
    showReportDetailModal.value = false;
  }
};

const fetchReports = async () => {
  const params = {
    _page: 1,
    _per_page: 10,
    sortBy: "status",
    sortDir: "DESC",
    periodStart: "",
    periodEnd: "",
  };
  await reportStore.fetchMyReports(params);
};

const formatDate = (dateString) => {
  if (!dateString) return "N/A";
  const date = new Date(dateString);
  return new Intl.DateTimeFormat("en-US").format(date);
};

const getStatusClass = (status) => {
  switch (status) {
    case "REVIEWED":
      return "bg-success-subtle text-success";
    case "DRAFT":
      return "bg-warning-subtle text-warning";
    case "SUBMITTED":
      return "bg-info-subtle text-info";
    default:
      return "bg-light text-secondary";
  }
};

onMounted(() => {
  fetchReports();
  userStore.fetchMyStaff(); // Fetch staff for the dropdown
});
</script>

<style scoped>
.page-container {
  max-width: 1200px;
  margin: 0 auto;
}

.text-primary-custom {
  color: #52796f;
}

.btn-primary-custom {
  background-color: #84a98c;
  color: white;
  border: none;
  transition: all 0.2s;
}

.btn-primary-custom:hover {
  background-color: #52796f;
  transform: translateY(-1px);
}

.status-badge {
  padding: 4px 12px;
  border-radius: 99px;
  font-size: 0.85rem;
  font-weight: 500;
}

.bg-success-subtle {
  background-color: #e6fcf5;
}

.bg-warning-subtle {
  background-color: #fff9db;
}

.bg-info-subtle {
  background-color: #e7f5ff;
}

.btn-icon {
  background: none;
  border: none;
  padding: 4px;
  transition: opacity 0.2s;
}

.btn-icon:hover {
  opacity: 0.7;
}
</style>

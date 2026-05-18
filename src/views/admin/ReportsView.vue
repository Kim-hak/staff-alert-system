<script setup>
import { computed, onMounted, reactive, ref, watch } from 'vue'
import BasePagination from '@/components/ui/base/BasePagination.vue'
import { useReportStore } from '@/stores/useReportStore'
import Swal from 'sweetalert2'

const reportStore = useReportStore()

const searchQuery = ref('')
const statusFilter = ref('')
const currentPage = ref(1)
const isDetailLoading = ref(false)
const isSaving = ref(false)
const isReviewing = ref(false)
const showDetailModal = ref(false)
const showEditModal = ref(false)
const selectedReport = ref(null)
const editingReport = ref(null)
const itemsPerPage = 10

const editForm = reactive({
  title: '',
  rating: '',
  reportPeriodStart: '',
  reportPeriodEnd: '',
  performanceSummary: '',
  achievement: '',
  areaForImprove: '',
  comment: ''
})

const loadReports = async () => {
  const params = {
    _page: currentPage.value,
    _per_page: itemsPerPage,
    sortBy: 'status',
    sortDir: 'DESC'
  }

  if (statusFilter.value) {
    params.status = statusFilter.value
  }

  await reportStore.fetchReports(params)
}

onMounted(loadReports)

watch(statusFilter, async () => {
  currentPage.value = 1
  await loadReports()
})

const stats = computed(() => reportStore.reportStats)

const filteredReports = computed(() => {
  const query = searchQuery.value.trim().toLowerCase()
  const reports = Array.isArray(reportStore.reports) ? reportStore.reports : []

  if (!query) {
    return reports
  }

  return reports.filter((report) => {
    return [
      report.title,
      getStaffName(report),
      getManagerName(report),
      report.status
    ].some((value) => String(value || '').toLowerCase().includes(query))
  })
})

const totalPages = computed(() => {
  if (searchQuery.value.trim()) {
    return Math.ceil(filteredReports.value.length / itemsPerPage) || 1
  }

  const meta = reportStore.meta || {}
  const total = Number(meta.totalPages ?? meta.pageCount ?? meta.lastPage)

  if (Number.isFinite(total) && total > 0) {
    return total
  }

  const totalItems = Number(meta.totalItems ?? meta.total ?? meta.itemCount)
  const perPage = Number(meta.perPage ?? meta.per_page ?? meta.limit ?? itemsPerPage)

  if (Number.isFinite(totalItems) && totalItems > 0 && Number.isFinite(perPage) && perPage > 0) {
    return Math.ceil(totalItems / perPage)
  }

  return 1
})

const paginatedReports = computed(() => {
  if (!searchQuery.value.trim()) {
    return filteredReports.value
  }

  const start = (currentPage.value - 1) * itemsPerPage
  return filteredReports.value.slice(start, start + itemsPerPage)
})

watch(searchQuery, () => {
  currentPage.value = 1
})

watch(totalPages, (pages) => {
  if (currentPage.value > pages) {
    currentPage.value = pages
    loadReports()
  }
})

const handlePageChange = async (page) => {
  currentPage.value = Math.min(Math.max(page, 1), totalPages.value)

  if (!searchQuery.value.trim()) {
    await loadReports()
  }

  window.scrollTo({ top: 0, behavior: 'smooth' })
}

const resetEditForm = () => {
  Object.assign(editForm, {
    title: '',
    rating: '',
    reportPeriodStart: '',
    reportPeriodEnd: '',
    performanceSummary: '',
    achievement: '',
    areaForImprove: '',
    comment: ''
  })
}

const openDetailModal = async (report) => {
  selectedReport.value = report
  showDetailModal.value = true
  isDetailLoading.value = true

  try {
    selectedReport.value = await reportStore.fetchReportById(report.id)
  } catch (error) {
    Swal.fire({
      title: 'Could not load report',
      text: reportStore.error || 'Please try again.',
      icon: 'error',
      confirmButtonColor: '#4d7c6e'
    })
    showDetailModal.value = false
  } finally {
    isDetailLoading.value = false
  }
}

const closeDetailModal = () => {
  if (isDetailLoading.value) return
  showDetailModal.value = false
  selectedReport.value = null
}

const openEditModal = async (report) => {
  editingReport.value = report
  resetEditForm()
  Object.assign(editForm, {
    title: report.title || '',
    rating: report.rating || '',
    reportPeriodStart: formatInputDate(report.reportPeriodStart),
    reportPeriodEnd: formatInputDate(report.reportPeriodEnd),
    performanceSummary: report.performanceSummary || '',
    achievement: report.achievement || '',
    areaForImprove: report.areaForImprove || '',
    comment: report.comment || ''
  })
  showEditModal.value = true

  try {
    const details = await reportStore.fetchReportById(report.id)
    editingReport.value = details
    Object.assign(editForm, {
      title: details.title || '',
      rating: details.rating || '',
      reportPeriodStart: formatInputDate(details.reportPeriodStart),
      reportPeriodEnd: formatInputDate(details.reportPeriodEnd),
      performanceSummary: details.performanceSummary || '',
      achievement: details.achievement || '',
      areaForImprove: details.areaForImprove || '',
      comment: details.comment || ''
    })
  } catch (error) {
    Swal.fire({
      title: 'Could not load report details',
      text: reportStore.error || 'You can still edit the values already loaded in the table.',
      icon: 'warning',
      confirmButtonColor: '#4d7c6e'
    })
  }
}

const closeEditModal = () => {
  if (isSaving.value) return
  showEditModal.value = false
  editingReport.value = null
  resetEditForm()
}

const handleUpdateReport = async () => {
  if (!editingReport.value) return

  if (!editForm.title.trim()) {
    Swal.fire({
      title: 'Title is required',
      icon: 'warning',
      confirmButtonColor: '#4d7c6e'
    })
    return
  }

  isSaving.value = true

  const payload = {
    title: editForm.title.trim(),
    performanceSummary: editForm.performanceSummary.trim(),
    achievement: editForm.achievement.trim(),
    areaForImprove: editForm.areaForImprove.trim(),
    comment: editForm.comment.trim(),
    reportPeriodStart: editForm.reportPeriodStart || undefined,
    reportPeriodEnd: editForm.reportPeriodEnd || undefined
  }

  if (editForm.rating !== '') {
    payload.rating = Number(editForm.rating)
  }

  try {
    await reportStore.updateReport(editingReport.value.id, payload)
    await loadReports()
    isSaving.value = false
    closeEditModal()
    Swal.fire({
      title: 'Report updated',
      icon: 'success',
      timer: 1400,
      showConfirmButton: false
    })
  } catch (error) {
    Swal.fire({
      title: 'Update failed',
      text: reportStore.error || 'Could not update this report.',
      icon: 'error',
      confirmButtonColor: '#4d7c6e'
    })
  } finally {
    isSaving.value = false
  }
}

const handleReviewReport = async (report) => {
  if (!report || report.status !== 'SUBMITTED' || isReviewing.value) return

  const result = await Swal.fire({
    title: 'Mark as reviewed?',
    text: 'Admin will mark this report as checked.',
    icon: 'question',
    showCancelButton: true,
    confirmButtonColor: '#4d7c6e',
    cancelButtonColor: '#6b7280',
    confirmButtonText: 'បានពិនិត្យ',
    cancelButtonText: 'Cancel',
    reverseButtons: true
  })

  if (!result.isConfirmed) return

  isReviewing.value = true

  try {
    const reviewedReport = await reportStore.reviewReport(report.id)

    if (String(selectedReport.value?.id) === String(report.id)) {
      selectedReport.value = reviewedReport && typeof reviewedReport === 'object'
        ? reviewedReport
        : {
            ...selectedReport.value,
            status: 'REVIEWED',
            reviewedAt: new Date().toISOString()
          }
    }

    await loadReports()
    Swal.fire({
      title: 'បានពិនិត្យរួច',
      icon: 'success',
      timer: 1400,
      showConfirmButton: false
    })
  } catch (error) {
    Swal.fire({
      title: 'Review failed',
      text: reportStore.error || 'Could not review this report.',
      icon: 'error',
      confirmButtonColor: '#4d7c6e'
    })
  } finally {
    isReviewing.value = false
  }
}

const handleDeleteReport = async (report) => {
  const result = await Swal.fire({
    title: 'Delete this report?',
    text: 'This report will be removed from the system.',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#dc3545',
    cancelButtonColor: '#6b7280',
    confirmButtonText: 'Delete',
    cancelButtonText: 'Cancel',
    reverseButtons: true
  })

  if (!result.isConfirmed) return

  try {
    await reportStore.deleteReport(report.id)

    if (reportStore.reports.length === 0 && currentPage.value > 1) {
      currentPage.value -= 1
    }

    await loadReports()
    Swal.fire({
      title: 'Report deleted',
      icon: 'success',
      timer: 1400,
      showConfirmButton: false
    })
  } catch (error) {
    Swal.fire({
      title: 'Delete failed',
      text: reportStore.error || 'Could not delete this report.',
      icon: 'error',
      confirmButtonColor: '#4d7c6e'
    })
  }
}

const retryLoad = () => {
  loadReports()
}

function getStaffName(report) {
  return report.staff?.fullname
    || report.staff?.name
    || report.staffName
    || report.staff?.email
    || 'Unassigned'
}

function getManagerName(report) {
  return report.manager?.fullname
    || report.manager?.name
    || report.managerName
    || report.createdBy?.fullname
    || report.author?.fullname
    || 'Unassigned'
}

function formatInputDate(value) {
  if (!value) return ''
  return String(value).split('T')[0]
}

function formatDate(value) {
  if (!value) return '-'

  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return '-'

  return date.toLocaleDateString('en-US')
}

function getPeriodLabel(report) {
  const start = parseDate(report.reportPeriodStart)
  const end = parseDate(report.reportPeriodEnd)

  if (!start && !end) return '-'
  if (start && !end) return formatDate(report.reportPeriodStart)
  if (!start && end) return formatDate(report.reportPeriodEnd)

  const quarter = getQuarterLabel(start, end)
  if (quarter) return quarter

  const sameMonth = start.getFullYear() === end.getFullYear() && start.getMonth() === end.getMonth()
  if (sameMonth) {
    return start.toLocaleDateString('en-US', { month: 'short', year: 'numeric' })
  }

  return `${formatDate(report.reportPeriodStart)} - ${formatDate(report.reportPeriodEnd)}`
}

function parseDate(value) {
  if (!value) return null

  const date = new Date(value)
  return Number.isNaN(date.getTime()) ? null : date
}

function getQuarterLabel(start, end) {
  if (start.getFullYear() !== end.getFullYear()) return ''

  const quarterRanges = [
    [0, 2, 'Q1'],
    [3, 5, 'Q2'],
    [6, 8, 'Q3'],
    [9, 11, 'Q4']
  ]

  const match = quarterRanges.find(([startMonth, endMonth]) => (
    start.getMonth() === startMonth && end.getMonth() === endMonth
  ))

  return match ? `${start.getFullYear()} ${match[2]}` : ''
}

function getStatusLabel(status) {
  switch (status) {
    case 'REVIEWED':
      return 'Reviewed'
    case 'SUBMITTED':
      return 'Submitted'
    case 'DRAFT':
      return 'Draft'
    default:
      return status || 'Unknown'
  }
}

function getStatusClass(status) {
  switch (status) {
    case 'REVIEWED':
      return 'status-reviewed'
    case 'SUBMITTED':
      return 'status-submitted'
    case 'DRAFT':
      return 'status-draft'
    default:
      return 'status-default'
  }
}
</script>

<template>
  <div class="reports-page">
    <section class="reports-heading">
      <div>
        <h2>Performance Reports</h2>
        <p>Review and manage all performance reports</p>
      </div>
    </section>

    <section class="report-toolbar" aria-label="Report filters">
      <label class="search-control">
        <i class="bi bi-search" aria-hidden="true"></i>
        <input
          v-model="searchQuery"
          type="search"
          placeholder="Search reports by title or staff name..."
        >
      </label>

      <select v-model="statusFilter" class="status-filter" aria-label="Filter reports by status">
        <option value="">All statuses</option>
        <option value="SUBMITTED">Submitted</option>
        <option value="REVIEWED">Reviewed</option>
        <option value="DRAFT">Draft</option>
      </select>
    </section>

    <section class="stats-grid" aria-label="Report summary">
      <article class="stat-card">
        <span>Pending Review</span>
        <strong class="text-warning">{{ stats.pending }}</strong>
      </article>
      <article class="stat-card">
        <span>Reviewed</span>
        <strong class="text-success">{{ stats.reviewed }}</strong>
      </article>
      <article class="stat-card">
        <span>Total Reports</span>
        <strong class="text-total">{{ stats.total }}</strong>
      </article>
    </section>

    <section class="reports-table-shell">
      <div class="table-responsive">
        <table class="reports-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Title</th>
              <th>Staff Member</th>
              <th>Manager</th>
              <th>Period</th>
              <th>Status</th>
              <th>Submitted</th>
              <th class="text-end">Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr v-if="reportStore.isLoading">
              <td colspan="8" class="table-state">
                <span class="spinner-border spinner-border-sm text-success me-2" role="status"></span>
                Loading reports...
              </td>
            </tr>

            <tr v-else-if="reportStore.error">
              <td colspan="8" class="table-state text-danger">
                {{ reportStore.error }}
                <button type="button" class="btn btn-sm btn-outline-danger ms-2" @click="retryLoad">
                  Retry
                </button>
              </td>
            </tr>

            <template v-else>
              <tr v-for="report in paginatedReports" :key="report.id">
                <td class="text-muted">{{ report.id }}</td>
                <td class="report-title">{{ report.title || 'Untitled report' }}</td>
                <td>{{ getStaffName(report) }}</td>
                <td>{{ getManagerName(report) }}</td>
                <td>{{ getPeriodLabel(report) }}</td>
                <td>
                  <span :class="['status-pill', getStatusClass(report.status)]">
                    {{ getStatusLabel(report.status) }}
                  </span>
                </td>
                <td>{{ formatDate(report.submittedAt || report.createdAt) }}</td>
                <td>
                  <div class="report-actions">
                    <button
                      type="button"
                      class="icon-button"
                      title="View report"
                      aria-label="View report"
                      @click="openDetailModal(report)"
                    >
                      <i class="bi bi-eye" aria-hidden="true"></i>
                    </button>
                    <button
                      type="button"
                      class="icon-button"
                      title="Edit report"
                      aria-label="Edit report"
                      @click="openEditModal(report)"
                    >
                      <i class="bi bi-pencil-square" aria-hidden="true"></i>
                    </button>
                    <button
                      v-if="report.status === 'SUBMITTED'"
                      type="button"
                      class="icon-button review-action"
                      title="Mark reviewed"
                      aria-label="Mark report reviewed"
                      @click="handleReviewReport(report)"
                    >
                      <i class="bi bi-check2-circle" aria-hidden="true"></i>
                    </button>
                    <button
                      type="button"
                      class="icon-button delete-action"
                      title="Delete report"
                      aria-label="Delete report"
                      @click="handleDeleteReport(report)"
                    >
                      <i class="bi bi-trash3" aria-hidden="true"></i>
                    </button>
                  </div>
                </td>
              </tr>

              <tr v-if="paginatedReports.length === 0">
                <td colspan="8" class="table-state">
                  No performance reports found.
                </td>
              </tr>
            </template>
          </tbody>
        </table>
      </div>
    </section>

    <div v-if="totalPages > 1" class="pagination-row">
      <BasePagination
        :total-pages="totalPages"
        :current-page="currentPage"
        @change-page="handlePageChange"
      />
    </div>

    <div v-if="showDetailModal" class="modal-backdrop-custom" @click.self="closeDetailModal">
      <div class="report-modal detail-modal">
        <header class="modal-header-panel">
          <div>
            <p class="modal-kicker">Report details</p>
            <h3>{{ selectedReport?.title || 'Performance Report' }}</h3>
          </div>
          <button type="button" class="modal-close" aria-label="Close details" @click="closeDetailModal">
            <i class="bi bi-x-lg" aria-hidden="true"></i>
          </button>
        </header>

        <div class="modal-body-panel">
          <div v-if="isDetailLoading" class="modal-loading">
            <span class="spinner-border text-success" role="status"></span>
          </div>

          <template v-else-if="selectedReport">
            <div class="detail-summary">
              <div>
                <span>Staff Member</span>
                <strong>{{ getStaffName(selectedReport) }}</strong>
              </div>
              <div>
                <span>Manager</span>
                <strong>{{ getManagerName(selectedReport) }}</strong>
              </div>
              <div>
                <span>Period</span>
                <strong>{{ getPeriodLabel(selectedReport) }}</strong>
              </div>
              <div>
                <span>Status</span>
                <strong>
                  <span :class="['status-pill', getStatusClass(selectedReport.status)]">
                    {{ getStatusLabel(selectedReport.status) }}
                  </span>
                </strong>
              </div>
            </div>

            <div class="rating-row">
              <span>Rating</span>
              <div>
                <i
                  v-for="star in 5"
                  :key="star"
                  :class="[
                    'bi',
                    star <= Number(selectedReport.rating || 0) ? 'bi-star-fill' : 'bi-star'
                  ]"
                  aria-hidden="true"
                ></i>
                <strong>{{ selectedReport.rating || '-' }}/5</strong>
              </div>
            </div>

            <div class="detail-section">
              <h4>Performance Summary</h4>
              <p>{{ selectedReport.performanceSummary || 'No summary provided.' }}</p>
            </div>
            <div class="detail-section">
              <h4>Achievements</h4>
              <p>{{ selectedReport.achievement || 'No achievements provided.' }}</p>
            </div>
            <div class="detail-section">
              <h4>Areas for Improvement</h4>
              <p>{{ selectedReport.areaForImprove || 'No improvement areas provided.' }}</p>
            </div>
            <div class="detail-section">
              <h4>Comment</h4>
              <p>{{ selectedReport.comment || 'No comment provided.' }}</p>
            </div>

            <div class="detail-review-panel">
              <div>
                <span class="detail-review-label">Admin review</span>
                <strong>
                  {{ selectedReport.status === 'REVIEWED' ? 'បានពិនិត្យរួច' : 'រង់ចាំពិនិត្យ' }}
                </strong>
                <small v-if="selectedReport.reviewedAt">
                  {{ formatDate(selectedReport.reviewedAt) }}
                </small>
              </div>
              <button
                v-if="selectedReport.status === 'SUBMITTED'"
                type="button"
                class="btn btn-review-detail"
                :disabled="isReviewing"
                @click="handleReviewReport(selectedReport)"
              >
                <span v-if="isReviewing" class="spinner-border spinner-border-sm me-2" role="status"></span>
                <i v-else class="bi bi-check2-circle me-2" aria-hidden="true"></i>
                បានពិនិត្យ
              </button>
            </div>
          </template>
        </div>
      </div>
    </div>

    <div v-if="showEditModal" class="modal-backdrop-custom" @click.self="closeEditModal">
      <div class="report-modal edit-modal">
        <header class="modal-header-panel">
          <div>
            <p class="modal-kicker">Edit report</p>
            <h3>{{ editingReport?.title || 'Performance Report' }}</h3>
          </div>
          <button type="button" class="modal-close" aria-label="Close edit form" @click="closeEditModal">
            <i class="bi bi-x-lg" aria-hidden="true"></i>
          </button>
        </header>

        <form class="modal-body-panel" @submit.prevent="handleUpdateReport">
          <div class="form-grid">
            <label class="form-field span-2">
              <span>Title</span>
              <input v-model="editForm.title" type="text" required :disabled="isSaving">
            </label>

            <label class="form-field">
              <span>Rating</span>
              <select v-model="editForm.rating" :disabled="isSaving">
                <option value="">No rating</option>
                <option v-for="rating in 5" :key="rating" :value="rating">{{ rating }}</option>
              </select>
            </label>

            <label class="form-field">
              <span>Period Start</span>
              <input v-model="editForm.reportPeriodStart" type="date" :disabled="isSaving">
            </label>

            <label class="form-field">
              <span>Period End</span>
              <input v-model="editForm.reportPeriodEnd" type="date" :disabled="isSaving">
            </label>

            <label class="form-field span-2">
              <span>Performance Summary</span>
              <textarea v-model="editForm.performanceSummary" rows="3" :disabled="isSaving"></textarea>
            </label>

            <label class="form-field span-2">
              <span>Achievements</span>
              <textarea v-model="editForm.achievement" rows="3" :disabled="isSaving"></textarea>
            </label>

            <label class="form-field span-2">
              <span>Areas for Improvement</span>
              <textarea v-model="editForm.areaForImprove" rows="3" :disabled="isSaving"></textarea>
            </label>

            <label class="form-field span-2">
              <span>Comment</span>
              <textarea v-model="editForm.comment" rows="3" :disabled="isSaving"></textarea>
            </label>
          </div>

          <div class="modal-actions">
            <button type="button" class="btn btn-light" :disabled="isSaving" @click="closeEditModal">
              Cancel
            </button>
            <button type="submit" class="btn btn-save" :disabled="isSaving">
              <span v-if="isSaving" class="spinner-border spinner-border-sm me-2" role="status"></span>
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<style scoped>
.reports-page {
  min-height: calc(100vh - 112px);
  color: #1f2937;
}

.reports-heading {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  margin-bottom: 22px;
}

.reports-heading h2 {
  margin: 0 0 4px;
  color: #1f2937;
  font-size: 1.55rem;
  font-weight: 800;
}

.reports-heading p {
  margin: 0;
  color: #718096;
  font-size: 0.96rem;
}

.report-toolbar {
  display: grid;
  grid-template-columns: minmax(0, 1fr) 160px;
  gap: 14px;
  margin-bottom: 22px;
}

.search-control,
.status-filter {
  min-height: 44px;
  border: 1px solid #dfe7ec;
  border-radius: 7px;
  background: #ffffff;
  box-shadow: 0 1px 2px rgba(15, 23, 42, 0.03);
}

.search-control {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 0 14px;
  color: #8a98aa;
}

.search-control input,
.status-filter {
  width: 100%;
  color: #1f2937;
  border: 0;
  outline: 0;
}

.search-control input::placeholder {
  color: #9aa5b1;
}

.status-filter {
  padding: 0 12px;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 16px;
  margin-bottom: 22px;
}

.stat-card {
  min-height: 82px;
  display: grid;
  align-content: center;
  gap: 7px;
  padding: 16px;
  border: 1px solid #e1e8ee;
  border-radius: 7px;
  background: #ffffff;
}

.stat-card span {
  color: #7a889b;
  font-size: 0.85rem;
  font-weight: 700;
}

.stat-card strong {
  font-size: 1.25rem;
  line-height: 1;
}

.text-total {
  color: #7fb08a;
}

.reports-table-shell {
  overflow: hidden;
  border: 1px solid #e1e8ee;
  border-radius: 7px;
  background: #ffffff;
}

.reports-table {
  width: 100%;
  min-width: 880px;
  border-collapse: collapse;
}

.reports-table thead {
  background: #eef3f7;
}

.reports-table th {
  padding: 15px 22px;
  color: #6f7f95;
  font-size: 0.73rem;
  font-weight: 800;
  text-transform: uppercase;
}

.reports-table td {
  padding: 17px 22px;
  color: #374151;
  border-top: 1px solid #edf1f4;
  font-size: 0.92rem;
  vertical-align: middle;
}

.report-title {
  max-width: 210px;
  color: #293241;
  font-weight: 700;
}

.status-pill {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-height: 26px;
  padding: 4px 11px;
  border-radius: 999px;
  font-size: 0.72rem;
  font-weight: 800;
  text-transform: uppercase;
  white-space: nowrap;
}

.status-reviewed {
  color: #25c46b;
  background: #e1f8eb;
  border: 1px solid #c7efd8;
}

.status-submitted {
  color: #7ca88a;
  background: #f1f7f3;
  border: 1px solid #e0ebe4;
}

.status-draft {
  color: #d98a09;
  background: #fff7e7;
  border: 1px solid #fae5bd;
}

.status-default {
  color: #64748b;
  background: #f1f5f9;
  border: 1px solid #e2e8f0;
}

.report-actions {
  display: flex;
  justify-content: flex-end;
  gap: 9px;
}

.icon-button {
  width: 32px;
  height: 32px;
  display: inline-grid;
  place-items: center;
  padding: 0;
  border: 0;
  border-radius: 6px;
  color: #4d7c6e;
  background: transparent;
  line-height: 1;
  transition: background-color 0.2s, color 0.2s;
}

.icon-button .bi {
  display: block;
  line-height: 1;
}

.icon-button:hover,
.icon-button:focus {
  color: #2d6a4f;
  background: #eef7f2;
}

.review-action {
  color: #22c55e;
}

.delete-action {
  color: #dc3545;
}

.delete-action:hover,
.delete-action:focus {
  color: #b02a37;
  background: #fff1f2;
}

.table-state {
  height: 120px;
  color: #7a889b;
  text-align: center;
}

.pagination-row {
  display: flex;
  justify-content: center;
  margin-top: 20px;
}

.modal-backdrop-custom {
  position: fixed;
  inset: 0;
  z-index: 1050;
  display: flex;
  align-items: flex-start;
  justify-content: center;
  padding: 48px 16px 24px;
  overflow-y: auto;
  background: rgba(15, 23, 42, 0.42);
}

.report-modal {
  width: min(760px, 100%);
  overflow: hidden;
  border-radius: 8px;
  background: #ffffff;
  box-shadow: 0 24px 70px rgba(15, 23, 42, 0.25);
}

.detail-modal {
  width: min(720px, 100%);
}

.modal-header-panel {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  padding: 22px 24px;
  color: #ffffff;
  background: #4d7c6e;
}

.modal-kicker {
  margin: 0 0 4px;
  color: rgba(255, 255, 255, 0.74);
  font-size: 0.78rem;
  font-weight: 700;
  text-transform: uppercase;
}

.modal-header-panel h3 {
  margin: 0;
  font-size: 1.2rem;
  font-weight: 800;
}

.modal-close {
  width: 34px;
  height: 34px;
  display: inline-grid;
  place-items: center;
  flex: 0 0 auto;
  border: 0;
  border-radius: 50%;
  color: #ffffff;
  background: rgba(255, 255, 255, 0.16);
}

.modal-close:hover,
.modal-close:focus {
  background: rgba(255, 255, 255, 0.27);
}

.modal-body-panel {
  padding: 24px;
}

.modal-loading {
  display: grid;
  min-height: 220px;
  place-items: center;
}

.detail-summary {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 12px;
  margin-bottom: 20px;
}

.detail-summary > div,
.rating-row {
  padding: 14px;
  border: 1px solid #e1e8ee;
  border-radius: 7px;
  background: #f9fbfc;
}

.detail-summary span,
.rating-row > span {
  display: block;
  margin-bottom: 5px;
  color: #7a889b;
  font-size: 0.78rem;
  font-weight: 700;
}

.detail-summary strong {
  color: #1f2937;
}

.rating-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 20px;
}

.rating-row > div {
  display: flex;
  align-items: center;
  gap: 5px;
  color: #f5a524;
}

.rating-row strong {
  margin-left: 8px;
  color: #1f2937;
}

.detail-section {
  margin-top: 18px;
}

.detail-section h4 {
  margin: 0 0 6px;
  color: #4b5563;
  font-size: 0.84rem;
  font-weight: 800;
}

.detail-section p {
  margin: 0;
  color: #1f2937;
  line-height: 1.55;
}

.detail-review-panel {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 14px;
  margin-top: 22px;
  padding: 14px;
  border: 1px solid #d8e8df;
  border-radius: 7px;
  background: #f4faf7;
}

.detail-review-panel > div {
  display: grid;
  gap: 3px;
}

.detail-review-label {
  color: #6b7f76;
  font-size: 0.78rem;
  font-weight: 800;
  text-transform: uppercase;
}

.detail-review-panel strong {
  color: #2d6a4f;
  font-size: 0.98rem;
}

.detail-review-panel small {
  color: #718096;
}

.btn-review-detail {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-height: 38px;
  padding: 0 16px;
  color: #ffffff;
  background: #4d7c6e;
  border: 0;
  border-radius: 6px;
  font-weight: 800;
  white-space: nowrap;
}

.btn-review-detail:hover,
.btn-review-detail:focus {
  color: #ffffff;
  background: #3f665b;
}

.form-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 16px;
}

.form-field {
  display: grid;
  gap: 7px;
}

.form-field.span-2 {
  grid-column: 1 / -1;
}

.form-field span {
  color: #1f2937;
  font-size: 0.88rem;
  font-weight: 700;
}

.form-field input,
.form-field select,
.form-field textarea {
  width: 100%;
  border: 1px solid #cfdbe3;
  border-radius: 6px;
  padding: 10px 12px;
  color: #1f2937;
  outline: 0;
}

.form-field textarea {
  resize: vertical;
}

.form-field input:focus,
.form-field select:focus,
.form-field textarea:focus {
  border-color: #4d7c6e;
  box-shadow: 0 0 0 0.18rem rgba(77, 124, 110, 0.16);
}

.modal-actions {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  margin-top: 22px;
}

.btn-save {
  color: #ffffff;
  background: #4d7c6e;
  border: 0;
  font-weight: 700;
}

.btn-save:hover,
.btn-save:focus {
  color: #ffffff;
  background: #3f665b;
}

@media (max-width: 767.98px) {
  .report-toolbar,
  .stats-grid,
  .detail-summary,
  .form-grid {
    grid-template-columns: 1fr;
  }

  .reports-heading {
    align-items: flex-start;
    flex-direction: column;
  }

  .modal-backdrop-custom {
    align-items: center;
    padding-top: 20px;
  }

  .rating-row {
    align-items: flex-start;
    flex-direction: column;
  }
}
</style>

<script setup>
import { computed, onMounted, ref, watch } from 'vue'
import BasePagination from '@/components/ui/base/BasePagination.vue'
import { useReportStore } from '@/stores/useReportStore'
import Swal from 'sweetalert2'

const reportStore = useReportStore()

const searchQuery = ref('')
const statusFilter = ref('')
const currentPage = ref(1)
const isDetailLoading = ref(false)
const isReviewing = ref(false)
const showDetailModal = ref(false)
const selectedReport = ref(null)
const itemsPerPage = 10

const statusOptions = [
  { value: '', label: 'ស្ថានភាពទាំងអស់' },
  { value: 'SUBMITTED', label: 'បានបញ្ជូន' },
  { value: 'REVIEWED', label: 'បានពិនិត្យ' },
  { value: 'DRAFT', label: 'សេចក្ដីព្រាង' }
]

const statusMeta = {
  REVIEWED: {
    label: 'បានពិនិត្យ',
    className: 'status-reviewed',
    icon: 'bi-check-circle-fill'
  },
  SUBMITTED: {
    label: 'បានបញ្ជូន',
    className: 'status-submitted',
    icon: 'bi-clock'
  },
  DRAFT: {
    label: 'សេចក្ដីព្រាង',
    className: 'status-draft',
    icon: 'bi-pencil'
  }
}

const detailSections = [
  {
    key: 'performanceSummary',
    title: 'សេចក្ដីសង្ខេបការអនុវត្តការងារ',
    fallback: 'មិនមានសេចក្ដីសង្ខេប។'
  },
  {
    key: 'achievement',
    title: 'សមិទ្ធផល',
    fallback: 'មិនមានសមិទ្ធផល។'
  },
  {
    key: 'areaForImprove',
    title: 'ចំណុចត្រូវកែលម្អ',
    fallback: 'មិនមានចំណុចត្រូវកែលម្អ។'
  },
  {
    key: 'comment',
    title: 'មតិយោបល់',
    fallback: 'មិនមានមតិយោបល់។'
  }
]

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

const statCards = computed(() => [
  {
    key: 'submitted',
    label: 'របាយការណ៍បានបញ្ជូន',
    value: reportStore.reportStats.pending,
    icon: 'bi-file-earmark-text',
    tone: 'submitted'
  },
  {
    key: 'reviewed',
    label: 'របាយការណ៍បានពិនិត្យ',
    value: reportStore.reportStats.reviewed,
    icon: 'bi-check-circle',
    tone: 'reviewed'
  },
  {
    key: 'total',
    label: 'របាយការណ៍សរុប',
    value: reportStore.reportStats.total,
    icon: 'bi-files',
    tone: 'total'
  }
])

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

const openDetailModal = async (report) => {
  selectedReport.value = report
  showDetailModal.value = true
  isDetailLoading.value = true

  try {
    selectedReport.value = await reportStore.fetchReportById(report.id)
  } catch (error) {
    Swal.fire({
      title: 'មិនអាចបើករបាយការណ៍បាន',
      text: reportStore.error || 'សូមព្យាយាមម្ដងទៀត។',
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

const handleReviewReport = async (report) => {
  if (!report || report.status !== 'SUBMITTED' || isReviewing.value) return

  const result = await Swal.fire({
    title: 'ពិនិត្យរបាយការណ៍នេះ?',
    text: 'អ្នកគ្រប់គ្រងប្រព័ន្ធនឹងកំណត់របាយការណ៍នេះថាបានពិនិត្យ។',
    icon: 'question',
    showCancelButton: true,
    confirmButtonColor: '#4d7c6e',
    cancelButtonColor: '#6b7280',
    confirmButtonText: 'បានពិនិត្យ',
    cancelButtonText: 'បោះបង់',
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
      title: 'ការពិនិត្យបរាជ័យ',
      text: reportStore.error || 'មិនអាចពិនិត្យរបាយការណ៍នេះបាន។',
      icon: 'error',
      confirmButtonColor: '#4d7c6e'
    })
  } finally {
    isReviewing.value = false
  }
}

const handleDeleteReport = async (report) => {
  const result = await Swal.fire({
    title: 'លុបរបាយការណ៍នេះ?',
    text: 'របាយការណ៍នេះនឹងត្រូវបានដកចេញពីប្រព័ន្ធ។',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#dc3545',
    cancelButtonColor: '#6b7280',
    confirmButtonText: 'លុប',
    cancelButtonText: 'បោះបង់',
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
      title: 'បានលុបរបាយការណ៍',
      icon: 'success',
      timer: 1400,
      showConfirmButton: false
    })
  } catch (error) {
    Swal.fire({
      title: 'ការលុបបរាជ័យ',
      text: reportStore.error || 'មិនអាចលុបរបាយការណ៍នេះបាន។',
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
    || 'មិនទាន់កំណត់'
}

function getManagerName(report) {
  return report.manager?.fullname
    || report.manager?.name
    || report.managerName
    || report.createdBy?.fullname
    || report.author?.fullname
    || 'មិនទាន់កំណត់'
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
  return statusMeta[status]?.label || status || 'មិនស្គាល់'
}

function getStatusClass(status) {
  return statusMeta[status]?.className || 'status-default'
}

function getStatusIcon(status) {
  return statusMeta[status]?.icon || ''
}
</script>

<template>
  <div class="reports-page">
    <section class="reports-heading">
      <div>
        <h2>របាយការណ៍វាយតម្លៃការងារ</h2>
        <p>ពិនិត្យ និងតាមដានរបាយការណ៍ទាំងអស់</p>
      </div>
    </section>

    <section class="report-toolbar" aria-label="តម្រងរបាយការណ៍">
      <label class="search-control">
        <i class="bi bi-search" aria-hidden="true"></i>
        <input
          v-model="searchQuery"
          type="search"
          placeholder="ស្វែងរកតាមចំណងជើង ឬឈ្មោះបុគ្គលិក..."
        >
      </label>

      <label class="status-filter-card">
        <span>ស្ថានភាព</span>
        <span class="select-wrap">
          <select v-model="statusFilter" class="status-filter" aria-label="តម្រងរបាយការណ៍តាមស្ថានភាព">
            <option
              v-for="option in statusOptions"
              :key="option.value || 'all'"
              :value="option.value"
            >
              {{ option.label }}
            </option>
          </select>
          <i class="bi bi-chevron-down" aria-hidden="true"></i>
        </span>
      </label>
    </section>

    <section class="stats-grid" aria-label="សង្ខេបរបាយការណ៍">
      <article
        v-for="card in statCards"
        :key="card.key"
        :class="['stat-card', `stat-card-${card.tone}`]"
      >
        <div>
          <span>{{ card.label }}</span>
          <strong>{{ card.value }}</strong>
        </div>
        <span class="stat-card-icon" aria-hidden="true">
          <i :class="['bi', card.icon]"></i>
        </span>
      </article>
    </section>

    <section class="reports-table-shell">
      <div class="table-responsive">
        <table class="reports-table">
          <thead>
            <tr>
              <th>ល.រ</th>
              <th>ចំណងជើង</th>
              <th>បុគ្គលិក</th>
              <th>អ្នកគ្រប់គ្រង</th>
              <th>រយៈពេល</th>
              <th>ស្ថានភាព</th>
              <th>ថ្ងៃបញ្ជូន</th>
              <th class="text-end">សកម្មភាព</th>
            </tr>
          </thead>
          <tbody>
            <tr v-if="reportStore.isLoading">
              <td colspan="8" class="table-state">
                <span class="spinner-border spinner-border-sm text-success me-2" role="status"></span>
                កំពុងផ្ទុករបាយការណ៍...
              </td>
            </tr>

            <tr v-else-if="reportStore.error">
              <td colspan="8" class="table-state text-danger">
                {{ reportStore.error }}
                <button type="button" class="btn btn-sm btn-outline-danger ms-2" @click="retryLoad">
                  ព្យាយាមម្ដងទៀត
                </button>
              </td>
            </tr>

            <template v-else>
              <tr v-for="report in paginatedReports" :key="report.id">
                <td class="text-muted">{{ report.id }}</td>
                <td class="report-title">{{ report.title || 'របាយការណ៍គ្មានចំណងជើង' }}</td>
                <td>{{ getStaffName(report) }}</td>
                <td>{{ getManagerName(report) }}</td>
                <td>{{ getPeriodLabel(report) }}</td>
                <td>
                  <span :class="['status-pill', getStatusClass(report.status)]">
                    <i
                      v-if="getStatusIcon(report.status)"
                      :class="['bi', getStatusIcon(report.status)]"
                      aria-hidden="true"
                    ></i>
                    {{ getStatusLabel(report.status) }}
                  </span>
                </td>
                <td>{{ formatDate(report.submittedAt || report.createdAt) }}</td>
                <td>
                  <div class="report-actions">
                    <button
                      type="button"
                      class="icon-button"
                      title="មើលរបាយការណ៍"
                      aria-label="មើលរបាយការណ៍"
                      @click="openDetailModal(report)"
                    >
                      <i class="bi bi-eye" aria-hidden="true"></i>
                    </button>
                    <button
                      v-if="report.status === 'SUBMITTED'"
                      type="button"
                      class="icon-button review-action"
                      title="កំណត់ថាបានពិនិត្យ"
                      aria-label="កំណត់របាយការណ៍ថាបានពិនិត្យ"
                      @click="handleReviewReport(report)"
                    >
                      <i class="bi bi-check2-circle" aria-hidden="true"></i>
                    </button>
                    <span
                      v-else-if="report.status === 'REVIEWED'"
                      class="icon-button reviewed-action"
                      title="បានពិនិត្យ"
                      aria-label="បានពិនិត្យ"
                    >
                      <i class="bi bi-check-circle-fill" aria-hidden="true"></i>
                    </span>
                    <button
                      type="button"
                      class="icon-button delete-action"
                      title="លុបរបាយការណ៍"
                      aria-label="លុបរបាយការណ៍"
                      @click="handleDeleteReport(report)"
                    >
                      <i class="bi bi-trash3" aria-hidden="true"></i>
                    </button>
                  </div>
                </td>
              </tr>

              <tr v-if="paginatedReports.length === 0">
                <td colspan="8" class="table-state">
                  មិនមានរបាយការណ៍វាយតម្លៃការងារ។
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
            <p class="modal-kicker">ព័ត៌មានលម្អិតរបាយការណ៍</p>
            <h3>{{ selectedReport?.title || 'របាយការណ៍វាយតម្លៃការងារ' }}</h3>
          </div>
          <button type="button" class="modal-close" aria-label="បិទព័ត៌មានលម្អិត" @click="closeDetailModal">
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
                <span>បុគ្គលិក</span>
                <strong>{{ getStaffName(selectedReport) }}</strong>
              </div>
              <div>
                <span>អ្នកគ្រប់គ្រង</span>
                <strong>{{ getManagerName(selectedReport) }}</strong>
              </div>
              <div>
                <span>រយៈពេល</span>
                <strong>{{ getPeriodLabel(selectedReport) }}</strong>
              </div>
              <div>
                <span>ស្ថានភាព</span>
                <strong>
                  <span :class="['status-pill', getStatusClass(selectedReport.status)]">
                    <i
                      v-if="getStatusIcon(selectedReport.status)"
                      :class="['bi', getStatusIcon(selectedReport.status)]"
                      aria-hidden="true"
                    ></i>
                    {{ getStatusLabel(selectedReport.status) }}
                  </span>
                </strong>
              </div>
            </div>

            <div class="rating-row">
              <span>ពិន្ទុវាយតម្លៃ</span>
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

            <div
              v-for="section in detailSections"
              :key="section.key"
              class="detail-section"
            >
              <h4>{{ section.title }}</h4>
              <p>{{ selectedReport[section.key] || section.fallback }}</p>
            </div>

            <div class="detail-review-panel">
              <div>
                <span class="detail-review-label">ការពិនិត្យរបស់អ្នកគ្រប់គ្រងប្រព័ន្ធ</span>
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
              <span v-else-if="selectedReport.status === 'REVIEWED'" class="review-complete-badge">
                <i class="bi bi-check-circle-fill" aria-hidden="true"></i>
                បានពិនិត្យ
              </span>
            </div>
          </template>
        </div>
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
  grid-template-columns: minmax(0, 1fr) 220px;
  align-items: stretch;
  gap: 18px;
  margin-bottom: 24px;
}

.search-control,
.status-filter-card {
  min-height: 68px;
  border: 1px solid #edf1f3;
  border-radius: 8px;
  background: #ffffff;
  box-shadow: 0 4px 14px rgba(15, 23, 42, 0.07);
}

.search-control {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 0 22px;
  color: #8a98aa;
}

.search-control input {
  width: 100%;
  color: #1f2937;
  border: 0;
  outline: 0;
}

.search-control input::placeholder {
  color: #9aa5b1;
}

.status-filter-card {
  display: grid;
  align-content: center;
  gap: 6px;
  padding: 10px 16px;
}

.status-filter-card > span:first-child {
  color: #64748b;
  font-size: 0.78rem;
  font-weight: 800;
  line-height: 1;
}

.select-wrap {
  position: relative;
  display: flex;
  align-items: center;
}

.select-wrap .bi {
  position: absolute;
  right: 0;
  color: #4d7c6e;
  pointer-events: none;
}

.status-filter {
  width: 100%;
  min-height: 28px;
  padding: 0 24px 0 0;
  color: #1f2937;
  border: 0;
  outline: 0;
  appearance: none;
  background: transparent;
  font-weight: 700;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 28px;
  margin-bottom: 28px;
}

.stat-card {
  min-height: 132px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 18px;
  padding: 24px;
  border: 0;
  border-radius: 8px;
  background: #ffffff;
  box-shadow:
    0 4px 6px -1px rgba(15, 23, 42, 0.1),
    0 2px 4px -2px rgba(15, 23, 42, 0.08);
}

.stat-card > div {
  display: grid;
  min-width: 0;
  gap: 8px;
}

.stat-card div > span {
  color: #6b7280;
  font-size: 1rem;
  font-weight: 500;
}

.stat-card strong {
  color: #111827;
  font-size: 1.9rem;
  font-weight: 800;
  line-height: 1;
}

.stat-card-icon {
  width: 68px;
  height: 68px;
  display: inline-grid;
  flex: 0 0 68px;
  place-items: center;
  border-radius: 8px;
  font-size: 1.55rem;
}

.stat-card-submitted .stat-card-icon {
  color: #2563eb;
  background: #eaf3ff;
}

.stat-card-reviewed .stat-card-icon {
  color: #059669;
  background: #e8f8ef;
}

.stat-card-total .stat-card-icon {
  color: #7c3aed;
  background: #f3eefe;
}

.reports-table-shell {
  overflow: hidden;
  border: 1px solid #dbe5e0;
  border-radius: 8px;
  background: #ffffff;
  box-shadow: 0 14px 32px rgba(15, 23, 42, 0.07);
}

.reports-table {
  width: 100%;
  min-width: 880px;
  border-collapse: collapse;
}

.reports-table thead {
  background: #f2f6f4;
}

.reports-table th {
  padding: 16px 22px;
  color: #6f7f95;
  font-size: 0.73rem;
  font-weight: 800;
  text-transform: uppercase;
}

.reports-table td {
  padding: 18px 22px;
  color: #374151;
  border-top: 1px solid #edf1f4;
  font-size: 0.92rem;
  vertical-align: middle;
}

.reports-table th:last-child,
.reports-table td:last-child {
  width: 150px;
}

.report-title {
  max-width: 210px;
  color: #293241;
  font-weight: 700;
  overflow-wrap: anywhere;
}

.status-pill {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  min-height: 26px;
  padding: 4px 11px;
  border-radius: 999px;
  font-size: 0.72rem;
  font-weight: 800;
  text-transform: uppercase;
  white-space: nowrap;
}

.status-pill .bi {
  font-size: 0.78rem;
}

.status-reviewed {
  color: #059669;
  background: #e8f8ef;
  border: 1px solid #c7f0d8;
}

.status-submitted {
  color: #2563eb;
  background: #eaf3ff;
  border: 1px solid #cfe1ff;
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
  gap: 8px;
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

.reviewed-action {
  color: #0f8f68;
  background: #e8f6ef;
  cursor: default;
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
  align-items: center;
  justify-content: center;
  padding: 24px 16px;
  overflow-y: auto;
  background: rgba(15, 23, 42, 0.36);
  backdrop-filter: blur(7px);
}

.report-modal {
  width: min(760px, 100%);
  max-height: calc(100vh - 48px);
  display: flex;
  flex-direction: column;
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
  overflow-y: auto;
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

.review-complete-badge {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  min-height: 38px;
  padding: 0 16px;
  color: #0f8f68;
  background: #e8f6ef;
  border: 1px solid #cbead9;
  border-radius: 6px;
  font-weight: 800;
  white-space: nowrap;
}

@media (max-width: 767.98px) {
  .report-toolbar,
  .stats-grid,
  .detail-summary {
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

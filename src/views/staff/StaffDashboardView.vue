<template>
  <div class="staff-dashboard fade-in">
    <div class="row g-4 mb-4">
      <div class="col-sm-6 col-xl-4">
        <StatCard
          title="ប្រាក់បៀវត្សរ៍"
          :value="currentSalary"
          icon="bi bi-wallet2"
          icon-color="text-success"
          bg-color="bg-light-blue"
        />
      </div>

      <div class="col-sm-6 col-xl-4">
        <StatCard
          title="កាលបរិច្ឆេទចូលធ្វើការ"
          :value="hireDate"
          icon="bi bi-calendar-check"
          icon-color="text-success"
          bg-color="bg-light-blue"
        />
      </div>

      <div class="col-sm-6 col-xl-4">
        <StatCard
          title="ស្ថានភាព"
          :value="profileStatus"
          icon="bi bi-person-check"
          icon-color="text-success"
          bg-color="bg-light-blue"
        />
      </div>

    </div>

    <div v-if="errorMessage" class="alert alert-danger border-0 shadow-sm" role="alert">
      {{ errorMessage }}
    </div>

    <div class="row g-4 mb-4">
      <div class="col-xl-5">
       <section class="dashboard-panel h-100">
  <div class="section-title">
    <i class="bi bi-person-lines-fill"></i>
    <span>សេចក្តីសង្ខេបព័ត៌មានផ្ទាល់ខ្លួន</span>
  </div>

  <div class="profile-head">
    <div class="avatar">
      <img v-if="profile?.avatar" :src="profile.avatar" alt="រូបថតផ្ទាល់ខ្លួន">
      <span v-else>{{ userInitial }}</span>
    </div>
    <div class="min-width-0">
      <h5 class="mb-1 text-truncate">{{ userName }}</h5>
      <p class="mb-0 text-muted text-truncate">{{ profile?.email || 'មិនមានអ៊ីមែល' }}</p>
    </div>
  </div>

  <div class="summary-list">
    <!-- Reverted back to profileSummary to match your existing data logic -->
    <div v-for="item in profileSummary" :key="item.label" class="summary-row">
      <span class="summary-label">
        <i :class="['bi', item.icon]"></i>
        {{ item.label }}
      </span>
      <strong>{{ item.value }}</strong>
    </div>
  </div>
</section>
      </div>

      <div class="col-xl-7">
        <section class="dashboard-panel h-100">
          <div class="section-title">
            <i class="bi bi-clock-history"></i>
            <span>ប្រវត្តិនៃការផ្លាស់ប្តូរប្រាក់បៀវត្សរ៍</span>
          </div>

          <div v-if="loading && !salaryHistory.length" class="empty-state">
            <div class="spinner-border spinner-border-sm text-primary me-2" role="status"></div>
            កំពុងផ្ទុកប្រវត្តិប្រាក់បៀវត្សរ៍...
          </div>

          <div v-else-if="!salaryHistory.length" class="empty-state">
            <i class="bi bi-wallet2"></i>
            <span>មិនទាន់មានប្រវត្តិប្រាក់បៀវត្សរ៍នៅឡើយទេ។</span>
          </div>

          <div v-else class="table-responsive">
            <table class="table align-middle mb-0 dashboard-table">
              <thead>
                <tr>
                  <th>ថ្ងៃមានប្រសិទ្ធភាព</th>
                  <th>ប្រាក់បៀវត្សរ៍មុន</th>
                  <th>ប្រាក់បៀវត្សរ៍ថ្មី</th>
                  <th>ការផ្លាស់ប្តូរ</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="salary in recentSalaryHistory" :key="salary.id">
                  <td>{{ formatDate(salary.effectiveDate) }}</td>
                  <td>{{ formatCurrency(salary.previousSalary) }}</td>
                  <td class="fw-semibold">{{ formatCurrency(salary.newSalary) }}</td>
                  <td :class="getChangeClass(salary)">
                    {{ formatSalaryChange(salary) }}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </div>

    <section class="dashboard-panel">
      <div class="section-title">
        <i class="bi bi-cash-coin"></i>
        <span>បច្ចុប្បន្នភាពប្រាក់បៀវត្សរ៍ចុងក្រោយ</span>
      </div>

      <div v-if="latestSalary" class="latest-grid">
        <div class="latest-item">
          <span>ប្រាក់បៀវត្សរ៍មុន</span>
          <strong>{{ formatCurrency(latestSalary.previousSalary) }}</strong>
        </div>
        <div class="latest-item">
          <span>ប្រាក់បៀវត្សរ៍ថ្មី</span>
          <strong>{{ formatCurrency(latestSalary.newSalary) }}</strong>
        </div>
        <div class="latest-item">
          <span>ថ្ងៃមានប្រសិទ្ធភាព</span>
          <strong>{{ formatDate(latestSalary.effectiveDate) }}</strong>
        </div>
        <div class="latest-item">
          <span>មូលហេតុ</span>
          <strong>{{ latestSalary.changeReason || 'មិនមានការបញ្ជាក់មូលហេតុ' }}</strong>
        </div>
      </div>

      <div v-else class="empty-state">
        <i class="bi bi-info-circle"></i>
        <span>មិនមានព័ត៌មានបច្ចុប្បន្នភាពចុងក្រោយទេ។</span>
      </div>
    </section>
  </div>
</template>

<script setup>
import { computed, onMounted, ref } from 'vue'
import api from '@/api/api'
import { useAuthStore } from '@/stores/useAuth'
import StatCard from '@/components/ui/base/StatCard.vue'

const authStore = useAuthStore()
const salaryHistory = ref([])
const loading = ref(false)
const errorMessage = ref('')

const profile = computed(() => authStore.profile || {})
const latestSalary = computed(() => salaryHistory.value[0] || null)
const recentSalaryHistory = computed(() => salaryHistory.value.slice(0, 5))

const userName = computed(() => {
  const p = profile.value
  return (p.fullname || `${p.firstName || ''} ${p.lastName || ''}`).trim() || 'Staff Member'
})

const userInitial = computed(() => userName.value.charAt(0).toUpperCase())

const currentSalary = computed(() => {
  const amount = latestSalary.value?.newSalary ?? profile.value.salary
  return amount ? formatCurrency(amount) : 'No data'
})

const hireDate = computed(() => {
  return formatDate(profile.value.hireDate || profile.value.hiredDate || profile.value.joinedAt || profile.value.createdAt)
})

const profileStatus = computed(() => {
  return profile.value.status || (profile.value.isActive === false ? 'INACTIVE' : 'ACTIVATED')
})

const salaryChange = computed(() => {
  if (!latestSalary.value) return 0
  return Number(latestSalary.value.newSalary || 0) - Number(latestSalary.value.previousSalary || 0)
})

const changeClass = computed(() => {
  if (salaryChange.value > 0) return 'text-success'
  if (salaryChange.value < 0) return 'text-danger'
  return 'text-secondary'
})

const salaryChangeTextColor = computed(() => {
  if (salaryChange.value > 0) return '#198754'
  if (salaryChange.value < 0) return '#dc3545'
  return '#6c757d'
})

const salaryChangeIconColor = computed(() => changeClass.value)

const formattedSalaryChange = computed(() => {
  if (!latestSalary.value) return 'No data'
  const sign = salaryChange.value > 0 ? '+' : ''
  return `${sign}${formatCurrency(salaryChange.value)}`
})

const changeLabel = computed(() => {
  if (!latestSalary.value) return 'No update'
  if (salaryChange.value > 0) return 'Increased'
  if (salaryChange.value < 0) return 'Decreased'
  return 'No change'
})

const profileSummary = computed(() => [
  { label: 'Full Name', value: userName.value, icon: 'bi-person' },
  { label: 'Email', value: profile.value.email || 'No data', icon: 'bi-envelope' },
  { label: 'Phone', value: profile.value.phone || profile.value.phoneNumber || 'No data', icon: 'bi-telephone' },
  { label: 'Role', value: profile.value.role?.name || 'Staff', icon: 'bi-shield-check' },
  { label: 'Hire Date', value: hireDate.value, icon: 'bi-calendar-check' },
  { label: 'Account Status', value: profileStatus.value, icon: 'bi-check-circle' },
])

const fetchSalaryHistory = async () => {
  loading.value = true
  errorMessage.value = ''

  try {
    const response = await api.get('/salary-history/me?sortBy=createdAt')
    const records = response.data?.data || []

    salaryHistory.value = [...records].sort((a, b) => {
      return new Date(b.createdAt || b.effectiveDate) - new Date(a.createdAt || a.effectiveDate)
    })
  } catch (error) {
    errorMessage.value = error.response?.data?.message || 'Unable to load salary history.'
  } finally {
    loading.value = false
  }
}

function formatCurrency(value) {
  const amount = Number(value || 0)

  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
  }).format(amount)
}

function formatDate(value) {
  if (!value) return 'No data'

  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return 'No data'

  return new Intl.DateTimeFormat('en-CA', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).format(date)
}

function formatSalaryChange(salary) {
  const change = Number(salary.newSalary || 0) - Number(salary.previousSalary || 0)
  const sign = change > 0 ? '+' : ''
  return `${sign}${formatCurrency(change)}`
}

function getChangeClass(salary) {
  const change = Number(salary.newSalary || 0) - Number(salary.previousSalary || 0)

  if (change > 0) return 'text-success fw-semibold'
  if (change < 0) return 'text-danger fw-semibold'
  return 'text-secondary fw-semibold'
}

onMounted(async () => {
  if (!authStore.profile) {
    await authStore.fetchProfile()
  }

  fetchSalaryHistory()
})
</script>

<style scoped>
.staff-dashboard {
  padding: 1.5rem;
}

.dashboard-panel {
  background: #fff;
  border-radius: 12px;
  box-shadow: 0 0.125rem 0.75rem rgba(15, 23, 42, 0.08);
  padding: 1.25rem;
}

.section-title {
  display: flex;
  align-items: center;
  gap: 0.6rem;
  color: #1f2937;
  font-size: 1rem;
  font-weight: 700;
  margin-bottom: 1rem;
}

.section-title i {
  color: var(--primary-color, #0d6efd);
}

.profile-head {
  display: flex;
  align-items: center;
  gap: 0.9rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid #edf2f7;
  margin-bottom: 1rem;
}

.avatar {
  width: 56px;
  height: 56px;
  border-radius: 14px;
  background: #e8f0fe;
  color: #1a73e8;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.25rem;
  font-weight: 800;
  overflow: hidden;
  flex-shrink: 0;
}

.avatar img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.summary-list {
  display: grid;
  gap: 0.85rem;
}

.summary-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  color: #374151;
}

.summary-label {
  color: #6b7280;
  display: inline-flex;
  align-items: center;
  gap: 0.45rem;
}

.summary-row strong {
  text-align: right;
  min-width: 0;
  overflow-wrap: anywhere;
}

.dashboard-table th {
  background: #f8fafc;
  color: #64748b;
  font-size: 0.82rem;
  font-weight: 700;
  border-bottom: 1px solid #e5e7eb;
}

.dashboard-table td {
  color: #334155;
  border-color: #eef2f7;
}

.latest-grid {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 1rem;
}

.latest-item {
  background: #f8fafc;
  border: 1px solid #edf2f7;
  border-radius: 10px;
  padding: 1rem;
  min-width: 0;
}

.latest-item span {
  display: block;
  color: #64748b;
  font-size: 0.82rem;
  margin-bottom: 0.35rem;
}

.latest-item strong {
  color: #1f2937;
  overflow-wrap: anywhere;
}

.empty-state {
  min-height: 145px;
  color: #64748b;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  text-align: center;
}

.empty-state i {
  font-size: 1.35rem;
}

.bg-light-purple {
  background-color: #f3e8ff !important;
}

.min-width-0 {
  min-width: 0;
}

@media (max-width: 991.98px) {
  .latest-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

@media (max-width: 575.98px) {
  .staff-dashboard {
    padding: 1rem;
  }

  .latest-grid {
    grid-template-columns: 1fr;
  }

  .summary-row {
    align-items: flex-start;
    flex-direction: column;
    gap: 0.25rem;
  }

  .summary-row strong {
    text-align: left;
  }
}
</style>

<template>
  <div class="fade-in">
    <div class="d-flex flex-column flex-md-row justify-content-between align-items-md-center mb-4">

    </div>

    <div v-if="errorMessage" class="alert alert-danger border-0 shadow-sm" role="alert">
      {{ errorMessage }}
    </div>

    <div v-if="loading && !salaryHistory.length" class="card border-0 shadow-sm">
      <div class="card-body py-5 text-center text-muted">
        <div class="spinner-border spinner-border-sm text-primary me-2" role="status"></div>
        កំពុងទាញយកប្រវត្តិប្រាក់បៀវត្សរ៍...
      </div>
    </div>

    <div v-else-if="!latestSalary" class="card border-0 shadow-sm">
      <div class="card-body py-5 text-center">
        <i class="bi bi-wallet2 fs-2 text-muted"></i>
        <p class="text-muted mb-0 mt-2">មិនទាន់មានប្រវត្តិប្រាក់បៀវត្សរ៍នៅឡើយទេ។</p>
      </div>
    </div>

    <template v-else>
      <div class="row g-4 mb-4">
        <div class="col-md-4">
          <StatCard
            title="ប្រាក់បៀវត្សរ៍មុន"
            :value="formatCurrency(latestSalary.previousSalary)"
            icon="bi bi-cash-stack"
            iconColor="text-warning"
            bgColor="bg-light-orange"
          />
        </div>

        <div class="col-md-4">
          <StatCard
            title="ប្រាក់បៀវត្សរ៍បច្ចុប្បន្ន"
            subtitle="ប្រាក់បៀវត្សរ៍ចុងក្រោយ"
            :value="formatCurrency(latestSalary.newSalary)"
            icon="bi bi-currency-dollar"
            iconColor="text-success"
            bgColor="bg-light-green"
            :subtitleClass="changeClass"
          />
        </div>

        <div class="col-md-4">
          <StatCard
            title="ការផ្លាស់ប្តូរប្រាក់បៀវត្សរ៍"
            :value="formattedSalaryChange"
            :valueColor="salaryChangeTextColor"
            :subtitle="changeLabel"
            :subtitleClass="changeClass"
            icon="bi bi-graph-up-arrow"
            :iconColor="salaryChangeIconColor"
            bgColor="bg-light-blue"
          />
        </div>
      </div>

      <div class="row g-4 mb-4">
        <div class="col-lg-6">
          <div class="card border-0 shadow-sm h-100">
            <div class="card-header text-white" style="background-color: var(--primary-color)">ប្រាក់បៀវត្សរ៍មុន</div>
            <div class="card-body">
              <div class="d-flex justify-content-between border-bottom py-2">
                <span class="text-muted">ចំនួនទឹកប្រាក់</span>
                <strong>{{ formatCurrency(latestSalary.previousSalary) }}</strong>
              </div>

              <div class="d-flex justify-content-between py-2">
                <span class="text-muted">ការផ្លាស់ប្តូរ</span>
                <strong :class="changeClass">{{ formattedSalaryChange }}</strong>
              </div>
            </div>
          </div>
        </div>

        <div class="col-lg-6">
          <div class="card border-0 shadow-sm h-100">
            <div class="card-header text-white" style="background-color: var(--primary-color)">
              ប្រាក់បៀវត្សរ៍បច្ចុប្បន្ន
            </div>

            <div class="card-body">
              <div class="d-flex justify-content-between border-bottom py-2">
                <span class="text-muted">ចំនួនទឹកប្រាក់</span>
                <strong>{{ formatCurrency(latestSalary.newSalary) }}</strong>
              </div>

              <div class="d-flex justify-content-between border-bottom py-2">
                <span class="text-muted">កាលបរិច្ឆេទអនុវត្ត</span>
                <strong>{{ formatDate(latestSalary.effectiveDate) }}</strong>
              </div>

              <div class="d-flex justify-content-between py-2 gap-3">
                <span class="text-muted">មូលហេតុ</span>
                <strong class="text-end">{{ latestSalary.changeReason || 'មិនមាន' }}</strong>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="card border-0 shadow-sm">
        <div class="card-header bg-white fw-semibold">ប្រវត្តិការផ្លាស់ប្តូរ</div>
        <div class="table-responsive">
          <table class="table align-middle mb-0">
            <thead class="table-light">
              <tr>
                <th>កាលបរិច្ឆេទអនុវត្ត</th>
                <th>ប្រាក់បៀវត្សរ៍មុន</th>
                <th>ប្រាក់បៀវត្សរ៍ថ្មី</th>
                <th>ការផ្លាស់ប្តូរ</th>
                <th>មូលហេតុ</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="salary in salaryHistory" :key="salary.id">
                <td>{{ formatDate(salary.effectiveDate) }}</td>
                <td>{{ formatCurrency(salary.previousSalary) }}</td>
                <td>{{ formatCurrency(salary.newSalary) }}</td>
                <td :class="getChangeClass(salary)">
                  {{ formatSalaryChange(salary) }}
                </td>
                <td class="text-muted">{{ salary.changeReason || 'មិនមាន' }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

    </template>
  </div>
</template>

<script setup>
import StatCard from '@/components/ui/base/StatCard.vue'
import { computed, onMounted, ref } from 'vue'
import api from '@/api/api'

const salaryHistory = ref([])
const loading = ref(false)
const errorMessage = ref('')



const latestSalary = computed(() => salaryHistory.value[0] || null)

const salaryChange = computed(() => {
  if (!latestSalary.value) return 0
  return Number(latestSalary.value.newSalary) - Number(latestSalary.value.previousSalary)
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
  const sign = salaryChange.value > 0 ? '+' : ''
  return `${sign}${formatCurrency(salaryChange.value)}`
})

const changeLabel = computed(() => {
  if (salaryChange.value > 0) return 'ប្រាក់បៀវត្សរ៍បានកើនឡើង'
  if (salaryChange.value < 0) return 'ប្រាក់បៀវត្សរ៍បានថយចុះ'
  return 'ប្រាក់បៀវត្សរ៍មិនមានការផ្លាស់ប្តូរ'
})

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
    errorMessage.value = error.response?.data?.message || 'មិនអាចទាញយកប្រវត្តិប្រាក់បៀវត្សរ៍បានទេ។'
  } finally {
    loading.value = false
  }
}

const formatCurrency = (value) => {
  const amount = Number(value || 0)

  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
  }).format(amount)
}

const formatDate = (value) => {
  if (!value) return 'មិនមាន'

  return new Intl.DateTimeFormat('en-CA', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).format(new Date(value))
}

const formatSalaryChange = (salary) => {
  const change = Number(salary.newSalary) - Number(salary.previousSalary)
  const sign = change > 0 ? '+' : ''

  return `${sign}${formatCurrency(change)}`
}

const getChangeClass = (salary) => {
  const change = Number(salary.newSalary) - Number(salary.previousSalary)

  if (change > 0) return 'text-success fw-semibold'
  if (change < 0) return 'text-danger fw-semibold'
  return 'text-secondary fw-semibold'
}

onMounted(fetchSalaryHistory)
</script>

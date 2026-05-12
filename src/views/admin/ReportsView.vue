<template>
  <div class="dashboard-container">
    <!-- Header -->
    <div class="mb-4">
      <h3 class="fw-bold text-dark mb-1">Dashboard</h3>
      <p class="text-muted small">Welcome back, <strong>{{ authStore.profile?.fullname || 'Admin' }}</strong>!</p>
    </div>

    <div v-if="store.isLoading" class="text-center py-5">
      <div class="spinner-border text-success" role="status"></div>
      <p class="text-muted mt-3 small">Loading dashboard data...</p>
    </div>

    <div v-else>
      <!-- Stat Cards -->
      <div class="row g-3 mb-4">
        <div class="col-6 col-md-4 col-lg-2">
          <div class="stat-card stat-teal">
            <div class="stat-icon"><i class="bi bi-people-fill"></i></div>
            <div class="stat-num">{{ store.stats.totalUsers }}</div>
            <div class="stat-label">Total Users</div>
          </div>
        </div>
        <div class="col-6 col-md-4 col-lg-2">
          <div class="stat-card stat-blue">
            <div class="stat-icon"><i class="bi bi-person-badge-fill"></i></div>
            <div class="stat-num">{{ store.stats.totalManagers }}</div>
            <div class="stat-label">Managers</div>
          </div>
        </div>
        <div class="col-6 col-md-4 col-lg-2">
          <div class="stat-card stat-green">
            <div class="stat-icon"><i class="bi bi-person-fill"></i></div>
            <div class="stat-num">{{ store.stats.totalStaff }}</div>
            <div class="stat-label">Staff</div>
          </div>
        </div>
        <div class="col-6 col-md-4 col-lg-2">
          <div class="stat-card stat-orange">
            <div class="stat-icon"><i class="bi bi-collection-fill"></i></div>
            <div class="stat-num">{{ store.stats.totalGroups }}</div>
            <div class="stat-label">Groups</div>
          </div>
        </div>
        <div class="col-6 col-md-4 col-lg-2">
          <div class="stat-card stat-yellow">
            <div class="stat-icon"><i class="bi bi-file-earmark-text-fill"></i></div>
            <div class="stat-num">{{ store.stats.submittedReports }}</div>
            <div class="stat-label">Submitted</div>
          </div>
        </div>
        <div class="col-6 col-md-4 col-lg-2">
          <div class="stat-card stat-purple">
            <div class="stat-icon"><i class="bi bi-check-circle-fill"></i></div>
            <div class="stat-num">{{ store.stats.reviewedReports }}</div>
            <div class="stat-label">Reviewed</div>
          </div>
        </div>
      </div>

      <!-- Charts row -->
      <div class="row g-3 mb-4">
        <div class="col-lg-8">
          <div class="card border-0 shadow-sm rounded-4 p-4 h-100">
            <div class="d-flex justify-content-between align-items-center mb-3">
              <h6 class="fw-bold mb-0">Recent Users</h6>
              <router-link :to="{ name: 'adminUsers' }" class="btn-link-custom">View All →</router-link>
            </div>
            <div v-if="store.recentUsers.length === 0" class="text-center text-muted py-3">
              <i class="bi bi-inbox fs-3 d-block mb-2"></i> No users yet
            </div>
            <div v-else class="recent-list">
              <div v-for="user in store.recentUsers" :key="user.id" class="recent-item">
                <div class="d-flex align-items-center gap-3">
                  <div class="mini-avatar">{{ getInitials(user.fullname) }}</div>
                  <div>
                    <div class="fw-semibold text-dark" style="font-size:0.88rem">{{ user.fullname }}</div>
                    <div class="text-muted" style="font-size:0.78rem">{{ user.email }}</div>
                  </div>
                </div>
                <span :class="`badge-mini ${getRoleBadge(user.role?.name)}`">
                  {{ user.role?.name || 'STAFF' }}
                </span>
              </div>
            </div>
          </div>
        </div>

        <div class="col-lg-4">
          <div class="card border-0 shadow-sm rounded-4 p-4 h-100">
            <h6 class="fw-bold mb-4">System Overview</h6>
            <div class="mb-4">
              <div class="d-flex justify-content-between mb-1">
                <span class="text-muted small">Active Users</span>
                <span class="fw-bold small">{{ store.quickStats.activeUsers }}%</span>
              </div>
              <div class="progress prog-thin">
                <div class="progress-bar bg-success" :style="`width:${store.quickStats.activeUsers}%`"></div>
              </div>
            </div>
            <div class="mb-4">
              <div class="d-flex justify-content-between mb-1">
                <span class="text-muted small">Reports Reviewed</span>
                <span class="fw-bold small">{{ store.quickStats.reportCompletion }}%</span>
              </div>
              <div class="progress prog-thin">
                <div class="progress-bar bg-primary" :style="`width:${store.quickStats.reportCompletion}%`"></div>
              </div>
            </div>
            <div class="mb-2">
              <div class="d-flex justify-content-between mb-1">
                <span class="text-muted small">Group Coverage</span>
                <span class="fw-bold small">{{ store.quickStats.groupCoverage }}%</span>
              </div>
              <div class="progress prog-thin">
                <div class="progress-bar bg-warning" :style="`width:${store.quickStats.groupCoverage}%`"></div>
              </div>
            </div>

            <!-- Summary -->
            <div class="mt-4 pt-3 border-top">
              <div class="d-flex justify-content-between mb-2">
                <span class="text-muted small">Total Reports</span>
                <strong class="small">{{ store.stats.submittedReports + store.stats.reviewedReports }}</strong>
              </div>
              <div class="d-flex justify-content-between">
                <span class="text-muted small">Pending Review</span>
                <strong class="small text-warning">{{ store.stats.submittedReports }}</strong>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Recent Reports -->
      <div class="card border-0 shadow-sm rounded-4 p-4">
        <div class="d-flex justify-content-between align-items-center mb-3">
          <h6 class="fw-bold mb-0">Recent Performance Reports</h6>
          <router-link :to="{ name: 'adminReports' }" class="btn-link-custom">View All →</router-link>
        </div>
        <div v-if="store.recentReports.length === 0" class="text-center text-muted py-3">
          <i class="bi bi-file-earmark fs-3 d-block mb-2"></i> No reports yet
        </div>
        <div v-else class="table-responsive">
          <table class="table table-sm align-middle mb-0">
            <thead style="background:#f8fbfc;">
              <tr>
                <th class="text-muted small fw-semibold border-0 px-3">Title</th>
                <th class="text-muted small fw-semibold border-0">Rating</th>
                <th class="text-muted small fw-semibold border-0">Status</th>
                <th class="text-muted small fw-semibold border-0">Period</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="r in store.recentReports" :key="r.id">
                <td class="px-3">
                  <span class="fw-semibold text-dark" style="font-size:0.875rem">{{ r.title }}</span>
                </td>
                <td>
                  <div class="d-flex gap-1">
                    <i v-for="s in 5" :key="s" :class="`bi ${s <= r.rating ? 'bi-star-fill text-warning' : 'bi-star text-muted'}`" style="font-size:0.7rem"></i>
                  </div>
                </td>
                <td>
                  <span :class="`badge-mini ${getStatusBadge(r.status)}`">{{ r.status }}</span>
                </td>
                <td class="text-muted small">{{ formatDate(r.reportPeriodStart) }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted } from 'vue'
import { useReportStore } from '@/stores/useReportStore'
import { useAuthStore } from '@/stores/useAuth'



const authStore = useAuthStore()

onMounted(() => store.fetchDashboardData())

const getInitials = (name) => {
  if (!name) return '?'
  return name.split(' ').map(n => n[0]).slice(0, 2).join('').toUpperCase()
}
const getRoleBadge = (role) => {
  const r = String(role).toUpperCase()
  if (r === 'ADMIN') return 'badge-warn'
  if (r === 'MANAGER') return 'badge-blue'
  return 'badge-gray'
}
const getStatusBadge = (s) => {
  if (s === 'REVIEWED') return 'badge-green'
  if (s === 'SUBMITTED') return 'badge-warn'
  return 'badge-gray'
}
const formatDate = (d) => d ? new Date(d).toLocaleDateString('en-GB') : '—'
</script>

<style scoped>
.dashboard-container { padding: 1.5rem; background: #f8fbfc; min-height: 100vh; }

/* Stat Cards */
.stat-card {
  border-radius: 14px;
  padding: 1.2rem 1rem;
  text-align: center;
  border: 1px solid transparent;
  transition: transform 0.18s;
}
.stat-card:hover { transform: translateY(-3px); }
.stat-icon { font-size: 1.6rem; margin-bottom: 0.4rem; }
.stat-num { font-size: 1.6rem; font-weight: 800; line-height: 1; }
.stat-label { font-size: 0.72rem; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px; margin-top: 4px; }

.stat-teal   { background: #e8f5f2; border-color: #c8e6de; color: #2e7d6e; }
.stat-blue   { background: #e8eaf6; border-color: #c5cae9; color: #303f9f; }
.stat-green  { background: #e8f5e9; border-color: #c8e6c9; color: #2e7d32; }
.stat-orange { background: #fbe9e7; border-color: #ffccbc; color: #bf360c; }
.stat-yellow { background: #fff8e1; border-color: #ffecb3; color: #e65100; }
.stat-purple { background: #f3e5f5; border-color: #e1bee7; color: #6a1b9a; }

/* Recent list */
.recent-list { display: flex; flex-direction: column; gap: 0.6rem; }
.recent-item {
  display: flex; justify-content: space-between; align-items: center;
  padding: 0.6rem 0.5rem;
  border-radius: 10px;
  transition: background 0.15s;
}
.recent-item:hover { background: #f8fafb; }

.mini-avatar {
  width: 34px; height: 34px;
  background: #e8f4f1; color: #4D7C6E;
  border-radius: 50%;
  display: flex; align-items: center; justify-content: center;
  font-weight: 700; font-size: 0.75rem;
  flex-shrink: 0;
}

/* Badges */
.badge-mini {
  padding: 0.25em 0.7em;
  font-size: 0.68rem; font-weight: 600;
  border-radius: 50rem; text-transform: uppercase;
  white-space: nowrap;
}
.badge-green { background: #e8f5e9; color: #2e7d32; }
.badge-warn  { background: #fff8e1; color: #f57f17; }
.badge-blue  { background: #e8eaf6; color: #3949ab; }
.badge-gray  { background: #f5f5f5; color: #616161; }

.prog-thin { height: 7px; border-radius: 10px; background: #f0f2f5; }
.progress-bar { border-radius: 10px; }
.btn-link-custom { color: #4D7C6E; font-size: 0.82rem; font-weight: 600; text-decoration: none; }
.btn-link-custom:hover { text-decoration: underline; }
</style>

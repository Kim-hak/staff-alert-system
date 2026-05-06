<template>
  <div class="fade-in">
    <!-- Welcome Card -->
    <div class="row mb-4">
      <div class="col-12">
        <div class="stat-card">
          <div class="d-flex align-items-center gap-3">
            <div class="avatar-placeholder" style="width: 64px; height: 64px; font-size: 1.5rem;">
              <!-- {{ authStore.userInitials }} -->

            </div>
            <div>
              <!-- <h4 class="mb-1">Welcome back, {{ authStore.user?.full_name }}!</h4> -->
              <h4 class="mb-1">Welcome back, Staff User!</h4>
              <p class="text-muted mb-0">Here&apos;s an overview of your profile and salary details.</p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Stats Cards -->
    <div class="row g-4 mb-4">
      <div class="col-12 col-sm-6 col-xl-4">
        <div class="stat-card">
          <div class="d-flex justify-content-between align-items-start">
            <div>
              <!-- <div class="stat-value">{{ formatCurrency(currentSalary) }}</div> -->
              <div class="stat-value">N/A</div>

              <div class="stat-label">Current Salary</div>
            </div>
            <div class="stat-icon primary">
              <i class="bi bi-file-earmark-text"></i>
            </div>
          </div>
        </div>
      </div>
      <div class="col-12 col-sm-6 col-xl-4">
        <div class="stat-card">
          <div class="d-flex justify-content-between align-items-start">
            <div>
              <!-- <div class="stat-value">{{ latestSalaryDate || 'N/A' }}</div> -->
              <div class="stat-value">N/A</div>
              <div class="stat-label">Last Salary Update</div>
            </div>
            <div class="stat-icon success">
              <i class="bi bi-calendar-check"></i>
            </div>
          </div>
        </div>
      </div>
      <div class="col-12 col-sm-6 col-xl-4">
        <div class="stat-card">
          <div class="d-flex justify-content-between align-items-start">
            <div>
              <!-- <div class="stat-value">{{ authStore.user?.start_date || 'N/A' }}</div> -->
              <div class="stat-value">N/A</div>
              <div class="stat-label">Start Date</div>
            </div>
            <div class="stat-icon info">
              <i class="bi bi-briefcase"></i>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Salary and Evaluation -->
    <div class="row">
      <div class="col-12 col-lg-8">
        <div class="data-table">
          <div class="table-header">
            <h3 class="table-title">Salary History</h3>
          </div>
          <div class="table-responsive">
            <table class="table table-hover mb-0">
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Salary</th>
                  <th>Note</th>
                </tr>
              </thead>
              <!-- <tbody>
                <tr v-if="loading">
                  <td colspan="3" class="text-center py-4">
                    <div class="spinner-border spinner-border-sm text-primary"></div>
                  </td>
                </tr>
                <tr v-else-if="!salaryHistory.length">
                  <td colspan="3" class="text-center py-4 text-muted">
                    No salary history available.
                  </td>
                </tr>
                <tr v-else v-for="entry in salaryHistory.slice(0, 5)" :key="entry.id || entry.created_at">
                  <td>{{ entry.created_at || entry.effective_date || 'N/A' }}</td>
                  <td>{{ formatCurrency(entry.salary || entry.amount || entry.new_salary) }}</td>
                  <td>{{ entry.note || entry.reason || entry.description || '-' }}</td>
                </tr>
              </tbody> -->
            </table>
          </div>
        </div>
      </div>

      <div class="col-12 col-lg-4">
        <div class="data-table">
          <div class="table-header">
            <h3 class="table-title">Quick Links</h3>
          </div>
          <div class="p-3">
            <div class="d-grid gap-2">
              <router-link to="/staff/reports" class="btn btn-outline-primary">
                <i class="bi bi-chat-square-text me-2"></i>Feedback & Evaluation
              </router-link>
              <router-link to="/staff/profile" class="btn btn-outline-secondary">
                <i class="bi bi-person-circle me-2"></i>Update Profile
              </router-link>
            </div>
          </div>
        </div>

        <div class="data-table mt-4">
          <div class="table-header">
            <h3 class="table-title">Feedback & Evaluation</h3>
          </div>
          <div class="p-3 text-muted">
            Evaluations can be opened when the backend provides a report link. A staff report list endpoint is not available in the current API.
          </div>
        </div>

        <div class="data-table mt-4">
          <div class="table-header">
            <h3 class="table-title">Profile Information</h3>
          </div>
          <ul class="list-group list-group-flush">
            <li class="list-group-item d-flex justify-content-between">
              <span class="text-muted">Email</span>
              <!-- <span>{{ authStore.user?.email }}</span> -->
            </li>
            <li class="list-group-item d-flex justify-content-between">
              <span class="text-muted">Phone</span>
              <!-- <span>{{ authStore.user?.phone || 'Not set' }}</span> -->
            </li>
            <li class="list-group-item d-flex justify-content-between">
              <span class="text-muted">Gender</span>
              <!-- <span class="text-capitalize">{{ authStore.user?.gender || 'Not set' }}</span> -->
            </li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>
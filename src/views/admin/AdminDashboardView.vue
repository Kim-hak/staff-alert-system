<template>
  <div class="container-fluid p-4">
    <div class="mb-4 text-start">
      <h3 class="fw-bold text-dark mb-1">Dashboard</h3>
      <p class="text-muted small">Welcome back, Admin User!</p>
    </div>

    <div class="row g-4 mb-4">
      <div class="col-12 col-md-6 col-lg-4">
        <StatCard title="Total Users" value="245" icon="bi bi-people" bg-color="bg-light-green" icon-color="text-success" />
      </div>
      <div class="col-12 col-md-6 col-lg-4">
        <StatCard title="Total Managers" value="12" icon="bi bi-person-badge" bg-color="bg-light-blue" icon-color="text-primary" />
      </div>
      <div class="col-12 col-md-6 col-lg-4">
        <StatCard title="Total Staff" value="198" icon="bi bi-person" bg-color="bg-light-green" icon-color="text-success" />
      </div>
      <div class="col-12 col-md-6 col-lg-4">
        <StatCard title="Total Groups" value="18" icon="bi bi-people-fill" bg-color="bg-light-orange" icon-color="text-warning" />
      </div>
      <div class="col-12 col-md-6 col-lg-4">
        <StatCard title="Submitted Reports" value="34" icon="bi bi-file-earmark-text" bg-color="bg-light-orange" icon-color="text-warning" />
      </div>
      <div class="col-12 col-md-6 col-lg-4">
        <StatCard title="Reviewed Reports" value="28" icon="bi bi-check-circle" bg-color="bg-light-green" icon-color="text-success" />
      </div>
    </div>

    <div class="row g-4">
      
      <div class="col-12 col-lg-7">
        <BaseCard title="Recent Activities">
          <div class="activity-list">
            <div class="d-flex justify-content-between align-items-center border-bottom py-3">
              <div>
                <h6 class="mb-1 fw-bold text-dark" style="font-size: 0.95rem;">New user registered</h6>
                <small class="text-muted">John Doe</small>
              </div>
              <small class="text-muted">5 minutes ago</small>
            </div>
            
            <div class="d-flex justify-content-between align-items-center border-bottom py-3">
              <div>
                <h6 class="mb-1 fw-bold text-dark" style="font-size: 0.95rem;">Report submitted</h6>
                <small class="text-muted">Jane Smith</small>
              </div>
              <small class="text-muted">1 hour ago</small>
            </div>
            
            <div class="d-flex justify-content-between align-items-center border-bottom py-3">
              <div>
                <h6 class="mb-1 fw-bold text-dark" style="font-size: 0.95rem;">Group created</h6>
                <small class="text-muted">Admin</small>
              </div>
              <small class="text-muted">2 hours ago</small>
            </div>
            
            <div class="d-flex justify-content-between align-items-center py-3">
              <div>
                <h6 class="mb-1 fw-bold text-dark" style="font-size: 0.95rem;">Salary updated</h6>
                <small class="text-muted">Mike Johnson</small>
              </div>
              <small class="text-muted">3 hours ago</small>
            </div>
          </div>
        </BaseCard>
      </div>

      <div class="col-12 col-lg-5">
        <BaseCard title="Quick Stats">
          <div class="mt-2">
            
            <div class="mb-4">
              <div class="d-flex justify-content-between mb-2">
                <span class="text-dark fw-medium" style="font-size: 0.9rem;">Active Users</span>
                <span class="text-dark fw-bold" style="font-size: 0.9rem;">89%</span>
              </div>
              <div class="progress" style="height: 8px;">
                <div class="progress-bar bg-success custom-progress-bar" role="progressbar" style="width: 89%" aria-valuenow="89" aria-valuemin="0" aria-valuemax="100"></div>
              </div>
            </div>

            <div class="mb-4">
              <div class="d-flex justify-content-between mb-2">
                <span class="text-dark fw-medium" style="font-size: 0.9rem;">Report Completion</span>
                <span class="text-dark fw-bold" style="font-size: 0.9rem;">76%</span>
              </div>
              <div class="progress" style="height: 8px;">
                <div class="progress-bar bg-secondary custom-progress-bar" role="progressbar" style="width: 76%" aria-valuenow="76" aria-valuemin="0" aria-valuemax="100"></div>
              </div>
            </div>

            <div class="mb-4">
              <div class="d-flex justify-content-between mb-2">
                <span class="text-dark fw-medium" style="font-size: 0.9rem;">Group Coverage</span>
                <span class="text-dark fw-bold" style="font-size: 0.9rem;">94%</span>
              </div>
              <div class="progress" style="height: 8px;">
                <div class="progress-bar bg-warning custom-progress-bar" role="progressbar" style="width: 94%" aria-valuenow="94" aria-valuemin="0" aria-valuemax="100"></div>
              </div>
            </div>

          </div>
        </BaseCard>
      </div>

    </div>
  </div>
</template>

<script setup>
// កុំភ្លេច Import Base Components មកប្រើ
import StatCard from '@/components/ui/base/StatCard.vue';
import BaseCard from '@/components/ui/base/BaseCard.vue';

// អ្នកអាចសរសេរ Logic ហៅ API នៅទីនេះនៅពេលក្រោយ ដើម្បីធ្វើឱ្យទិន្នន័យដើរជា Dynamic
</script>

<style scoped>
.custom-progress-bar {
  border-radius: 10px;
}
.progress {
  border-radius: 10px;
  background-color: #f0f2f5;
}
</style>
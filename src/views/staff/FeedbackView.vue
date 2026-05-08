<template>
  <div class="fade-in">

    <!-- Page Header -->
    <div class="mb-4">
      <h2 class="mb-1">My Feedback</h2>
      <p class="text-muted mb-0">Review and feedback from administrator</p>
    </div>

    <!-- Review Card -->
    <div class="card border rounded-3 shadow-sm">
      <div class="card-body p-4">

        <!-- Header Row -->
        <div class="d-flex align-items-start justify-content-between mb-4">
          <div>
            <h5 class="fw-semibold mb-1">Q1 2025 Performance Review</h5>
            <p class="text-muted small mb-0">Reviewed by administrator</p>
          </div>
          <span class="badge text-bg-primary px-3 py-2" style="font-size: 11px; letter-spacing: 0.05em;">
            COMPLETED
          </span>
        </div>

        <!-- Metric Cards -->
        <div class="row g-3 mb-4">

          <div class="col-md-6">
            <div class="rounded-3 p-3 bg-body-secondary">
              <p class="text-muted small mb-2">Performance rating</p>
              <div class="d-flex align-items-center gap-1">
                <span v-for="i in 5" :key="i" :style="{ color: i <= rating ? '#f59e0b' : '#d1d5db' }">★</span>
                <span class="text-muted small ms-1">{{ rating }} / 5</span>
              </div>
            </div>
          </div>

          <div class="col-md-6">
            <div class="rounded-3 p-3 bg-body-secondary">
              <p class="text-muted small mb-2">Review period</p>
              <p class="fw-semibold mb-0 small">Jan 1 – Mar 31, 2025</p>
            </div>
          </div>

        </div>

        <hr class="my-4" />

        <!-- Performance Summary -->
        <div class="mb-3">
          <div class="d-flex align-items-center gap-2 mb-2">
            <div class="section-icon bg-body-secondary text-secondary">
              <i class="bi bi-file-text"></i>
            </div>
            <span class="fw-semibold small">Performance Summary</span>
          </div>
          <p class="text-muted small mb-0 ps-1">
            {{ feedback.summary }}
          </p>
        </div>

        <!-- Achievements -->
        <div class="mb-3">
          <div class="d-flex align-items-center gap-2 mb-2">
            <div class="section-icon bg-success bg-opacity-10 text-success">
              <i class="bi bi-trophy"></i>
            </div>
            <span class="fw-semibold small text-success">Achievements</span>
          </div>
          <p class="text-muted small mb-0 ps-1">
            {{ feedback.achievements }}
          </p>
        </div>

        <!-- Areas for Improvement -->
        <div class="mb-3">
          <div class="d-flex align-items-center gap-2 mb-2">
            <div class="section-icon bg-warning bg-opacity-10 text-warning">
              <i class="bi bi-graph-up-arrow"></i>
            </div>
            <span class="fw-semibold small text-warning">Areas for Improvement</span>
          </div>
          <p class="text-muted small mb-0 ps-1">
            {{ feedback.improvement }}
          </p>
        </div>

        <hr class="my-4" />

        <!-- Admin Comment -->
        <div class="d-flex align-items-center gap-3">
          <div class="avatar-circle bg-primary bg-opacity-10 text-primary fw-semibold">
            AD
          </div>
          <div class="flex-grow-1">
            <p class="fw-semibold small mb-0">Administrator</p>
            <p class="text-muted small mb-0">{{ feedback.adminComment }}</p>
          </div>
          <i class="bi bi-chat-dots text-muted"></i>
        </div>

      </div>
    </div>

  </div>
</template>

<script setup>
import { ref } from 'vue'

const rating = ref(4)

const feedback = ref({
  summary:      'John consistently meets expectations and delivers quality work across all assigned tasks and projects.',
  achievements: 'Led 3 sprint deliveries on schedule and reduced the bug backlog by 40%, significantly improving team velocity and product stability.',
  improvement:  'Documentation quality and communication clarity in cross-team meetings are the primary focus areas for next quarter.',
  adminComment: 'Good overall progress. Keep it up!',
})
</script>

<style scoped>
.section-icon {
  width: 28px;
  height: 28px;
  border-radius: 6px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
  flex-shrink: 0;
}

.avatar-circle {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 13px;
  flex-shrink: 0;
}
</style>
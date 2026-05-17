<template>
  <div class="container-fluid py-4 bg-light min-vh-100">

    <!-- Back -->
    <div class="mb-4">
      <button class="btn btn-outline-success rounded-3 px-3" @click="$emit('back')">
        ← Back
      </button>
    </div>

    <!-- Header -->
    <div class="card border-0 shadow-sm rounded-4 p-4 mb-4 position-relative">
      <div class="d-flex flex-column flex-md-row align-items-center align-items-md-start justify-content-between gap-3">

        <div class="d-flex flex-column flex-sm-row align-items-center align-items-sm-start gap-4">
          <div class="position-relative">
            <div class="avatar-placeholder d-flex align-items-center justify-content-center bg-secondary bg-opacity-20 rounded-4">
              <i class="bi bi-person-fill text-secondary" style="font-size: 4rem;"></i>
            </div>

            <span class="position-absolute bottom-0 end-0 translate-middle p-1 bg-success border border-white border-2 rounded-circle custom-check-badge">
              <i class="bi bi-check text-white d-block" style="font-size: 0.75rem;"></i>
            </span>
          </div>

          <div class="text-center text-sm-start mt-2">
            <div class="d-flex flex-wrap align-items-center gap-2 mb-2">
              <h2 class="fw-bold m-0 text-dark">{{ employee?.fullname }}</h2>

              <span class="badge bg-success bg-opacity-10 text-success border border-success border-opacity-10">
                {{ employee?.role?.name }}
              </span>

              <span class="badge bg-success bg-opacity-10 text-success border border-success border-opacity-10">
                {{ employee?.status }}
              </span>
            </div>

            <div class="text-secondary d-flex flex-wrap gap-3 small mt-3">
              <span>
                Employee ID:
                <strong class="text-dark">{{ employee?.id }}</strong>
              </span>

              <span>
                Joined {{ employee?.hireDate }}
              </span>
            </div>
          </div>
        </div>

      </div>
    </div>

    <!-- Body -->
    <div class="row g-4">

      <!-- Personal -->
      <div class="col-md-6">
        <h5 class="fw-bold mb-3">Personal Details</h5>

        <div class="card border-0 shadow-sm rounded-4 p-4 h-100">

          <div class="mb-4">
            <small class="text-muted">Email</small>
            <div class="fw-bold">{{ employee?.email }}</div>
          </div>

          <div class="mb-4">
            <small class="text-muted">Phone</small>
            <div class="fw-bold">{{ employee?.phone }}</div>
          </div>

          <div class="mb-4">
            <small class="text-muted">Birthday</small>
            <div class="fw-bold">{{ employee?.birthday }}</div>
          </div>

          <div>
            <small class="text-muted">Gender</small>
            <div class="fw-bold">{{ employee?.gender }}</div>
          </div>

        </div>
      </div>

      <!-- Professional -->
      <div class="col-md-6">
        <h5 class="fw-bold mb-3">Professional Info</h5>

        <div class="card border-0 shadow-sm rounded-4 p-4 h-100">

          <div class="mb-4">
            <small class="text-muted">Salary</small>
            <div class="fw-bold">{{ formatSalary(employee?.salary) }}</div>
          </div>

          <div class="mb-4">
            <small class="text-muted">Role</small>
            <div class="fw-bold">{{ employee?.role?.name }}</div>
          </div>

          <div class="mb-4">
            <small class="text-muted">Manager ID</small>
            <div class="fw-bold">{{ employee?.managerId || "-" }}</div>
          </div>

          <div>
            <small class="text-muted">Status</small>
            <div class="fw-bold">{{ employee?.status }}</div>
          </div>

        </div>
      </div>

    </div>
  </div>
</template>

<script setup>
defineProps({
  employee: {
    type: Object,
    required: true
  }
});

defineEmits(["back"]);

const formatSalary = (val) => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0
  }).format(val || 0);
};
</script>

<style scoped>
.bg-light {
  background-color: #f8fafc !important;
}

.avatar-placeholder {
  width: 120px;
  height: 120px;
}

.custom-check-badge {
  background-color: #497164 !important;
  transform: translate(25%, 25%) !important;
}

.badge {
  padding: 6px 12px;
  border-radius: 10px;
}
</style>
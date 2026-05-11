<template>
  <div class="container-fluid p-0">
        <div class="px-5">
          <div class="mb-4">
            <h2 class="fw-bold text-dark">My Profile</h2>
            <p class="text-secondary">View and manage your profile information</p>
          </div>

          <div class="row g-4">
            <div class="col-lg-4">
              <div class="card border-0 shadow-sm p-4 text-center rounded-4">
                <div class="avatar-lg mx-auto mb-3">S</div>
                <h4 class="fw-bold mb-1">Admin User</h4>
                <p class="text-muted small">admin@example.com</p>
                <div class="mb-4">
                  <span class="badge-custom">Admin</span>
                </div>
                
                <div class="d-grid gap-2">
                  <button class="btn btn-sage py-2 fw-bold">Edit Profile</button>
                  <button class="btn btn-outline-light-custom py-2 fw-bold">
                    <i class="bi bi-upload me-2"></i> Upload Avatar
                  </button>
                  <button class="btn btn-danger-custom py-2 fw-bold">
                    <i class="bi bi-trash me-2"></i> Delete Account
                  </button>
                </div>
              </div>
            </div>

            <div class="col-lg-8">
              <div class="card border-0 shadow-sm p-4 rounded-4 h-100">
                <h5 class="fw-bold mb-4">Personal Information</h5>
                <div class="row g-4">
                  <div class="col-md-6" v-for="info in profileInfo" :key="info.label">
                    <label class="info-label">
                      <i :class="['bi', info.icon, 'me-2']"></i> {{ info.label }}
                    </label>
                    <div v-if="info.type !== 'status'" class="info-value">
                      {{ info.value }}
                    </div>
                    <div v-else>
                      <span class="badge-custom">{{ info.value }}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
  
    </div>
</template>

<script setup>
import { ref } from 'vue';

const profileInfo = ref([
  { label: 'Full Name', value: 'Admin User', icon: 'bi-person' },
  { label: 'Email', value: 'admin@example.com', icon: 'bi-envelope' },
  { label: 'Current Salary', value: '$75,000', icon: 'bi-currency-dollar' },
  { label: 'Account Status', value: 'Active', icon: 'bi-shield-check', type: 'status' },
]);
</script>

<style scoped>
/* Color Palette */
:root {
  --sage-primary: #5a8474;
  --sage-light: #8fb3a4;
  --sage-bg: #eef5f2;
}

/* Avatars  */
.avatar-xs { width: 30px; height: 30px; border-radius: 50%; background: #a3c2b5; display: flex; align-items: center; justify-content: center; font-size: 0.8rem; }
.avatar-sm { width: 40px; height: 40px; border-radius: 50%; background: #a3c2b5; display: flex; align-items: center; justify-content: center; font-weight: bold; }
.avatar-lg { width: 120px; height: 120px; border-radius: 50%; background: #a3c2b5; display: flex; align-items: center; justify-content: center; font-size: 3rem; color: white; font-weight: bold; }

/* Badges and Buttons */
.badge-custom {
  background-color: #eef5f2;
  color: #5a8474;
  padding: 0.4rem 1.2rem;
  border-radius: 20px;
  font-size: 0.75rem;
  font-weight: 700;
  text-transform: uppercase;
}

.btn-sage { background-color: #8fb3a4; color: white; border: none; transition: 0.2s; }
.btn-sage:hover { background-color: #5a8474; }

.btn-outline-light-custom { border: 1px solid #dee2e6; color: #6c757d; }
.btn-outline-light-custom:hover { background-color: #f8f9fa; }

.btn-danger-custom { background-color: #ff4d4d; color: white; border: none; }
.btn-danger-custom:hover { background-color: #e64444; }

/* Typography */
.info-label {
  color: #adb5bd;
  font-size: 0.7rem;
  font-weight: 700;
  text-transform: uppercase;
  display: block;
  margin-bottom: 4px;
}
.info-value {
  font-weight: 500;
  color: #212529;
}
.logo-box img { width: 25px; height: 25px; }
</style>
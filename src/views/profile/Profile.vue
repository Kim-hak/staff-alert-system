<template>
  <div class="container-fluid py-4 px-5 bg-light min-vh-100">
    <div class="mb-4 text-start">
      <h2 class="fw-bold mb-1 khmer-font">ព័ត៌មានផ្ទាល់ខ្លួន</h2>
      <p class="text-secondary small khmer-font">មើល និងគ្រប់គ្រងព័ត៌មានផ្ទាល់ខ្លួនរបស់អ្នក</p>
    </div>

    <div class="row g-4">
      <div class="col-lg-4 col-xl-3">
        <div class="card border-0 shadow-sm p-4 rounded-4 text-center">
          <div class="position-relative d-inline-block mx-auto mb-3">
            <div class="profile-avatar-container">
              <img src="https://via.placeholder.com/150" alt="Avatar" class="profile-img">
            </div>
            <button class="action-icon btn-upload shadow-sm" title="Upload">
              <i class="bi bi-upload"></i>
            </button>
            <button class="action-icon btn-delete shadow-sm" title="Delete">
              <i class="bi bi-trash"></i>
            </button>
          </div>

          <h4 class="fw-bold mb-1">{{ profileInfo[0].value }}</h4>
          <p class="text-muted small mb-3">{{ profileInfo[1].value }}</p>
          
          <div class="mb-4">
            <span class="badge-role">{{ userRole }}</span>
          </div>

          <div class="d-grid gap-2">
            <button class="btn btn-edit-profile py-2 fw-bold">កែប្រែព័ត៌មាន</button>
            <button class="btn btn-action-outline py-2 fw-bold">
              <i class="bi bi-shield-lock me-2"></i> ប្តូរពាក្យសម្ងាត់
            </button>
            <button class="btn btn-action-success py-2 fw-bold">
              <i class="bi bi-envelope me-2"></i> ប្តូរអ៊ីមែល
            </button>
            <button class="btn btn-action-danger py-2 fw-bold">
              <i class="bi bi-trash me-2"></i> លុបគណនី
            </button>
          </div>
        </div>
      </div>

      <div class="col-lg-8 col-xl-9">
        <div class="card border-0 shadow-sm p-4 rounded-4 h-100">
          <h5 class="fw-bold mb-4 khmer-font">ព័ត៌មានលម្អិត</h5>
          <div class="row g-4">
            <div class="col-md-6" v-for="info in profileInfo" :key="info.label">
              <div class="info-group">
                <label class="info-label khmer-font">
                  <i :class="['bi', info.icon, 'me-2']"></i> {{ info.label }}
                </label>
                <div v-if="info.type !== 'status'" class="info-value">
                  {{ info.value }}
                </div>
                <div v-else>
                  <span class="status-active">{{ info.value }}</span>
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
import { useAuthStore } from '@/stores/useAuth';
import { computed, ref } from 'vue';
const authStore = useAuthStore()

// Updated labels to match your screenshot icons/fields
const profileInfo = ref([
  { label: 'ឈ្មោះពេញ', value: 'Kun Vannda 3', icon: 'bi-person' },
  { label: 'អ៊ីមែល', value: 'antadmin@gmail.com', icon: 'bi-envelope' },
  { label: 'លេខទូរស័ព្ទ', value: '0123456789', icon: 'bi-telephone' },
  { label: 'ភេទ', value: 'ប្រុស', icon: 'bi-person' },
  { label: 'ថ្ងៃខែឆ្នាំកំណើត', value: 'មិនមាន', icon: 'bi-calendar-event' },
  { label: 'ថ្ងៃចូលធ្វើការ', value: 'មិនមាន', icon: 'bi-calendar-check' },
  { label: 'ប្រាក់បៀវត្សរ៍បច្ចុប្បន្ន', value: 'មិនមាន', icon: 'bi-currency-dollar' },
  { label: 'ស្ថានភាពគណនី', value: 'សកម្ម', icon: 'bi-shield-check', type: 'status' },
]);

const userRole = computed(() => {
  switch (authStore.profile?.role?.id) {
    case 1: return 'អ្នកគ្រប់គ្រងប្រព័ន្ធ'
    case 2: return 'Manager'
    case 3: return 'Staff'
    default: return 'User'
  }
})

</script>

<style scoped>
/* Profile Image & Overlays */
.profile-avatar-container {
  width: 120px;
  height: 120px;
  border-radius: 50%;
  overflow: hidden;
  border: 4px solid #fff;
  background: #f0f0f0;
}
.profile-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.action-icon {
  position: absolute;
  width: 32px;
  height: 32px;
  border-radius: 50%;
  border: none;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.9rem;
  top: 10px;
}
.btn-upload { left: -10px; background: white; color: #6c757d; }
.btn-delete { right: -10px; background: white; color: #dc3545; }

/* Custom Badge */
.badge-role {
  background-color: #e8f0fe;
  color: #1a73e8;
  padding: 0.3rem 1rem;
  border-radius: 50px;
  font-size: 0.8rem;
  font-weight: 500;
}

/* Custom Buttons matching the image style */
.btn-edit-profile { background-color: #8da399; color: white; border: none; border-radius: 8px; }
.btn-edit-profile:hover { background-color: #7a8e84; }

.btn-action-outline { background-color: #f0f2ff; color: #5c6bc0; border: none; border-radius: 8px; }
.btn-action-success { background-color: #e8f5e9; color: #2e7d32; border: none; border-radius: 8px; }
.btn-action-danger { background-color: #fff1f1; color: #d32f2f; border: none; border-radius: 8px; }

/* Typography & Info Grid */
.info-label {
  color: #a0aec0;
  font-size: 0.85rem;
  display: block;
  margin-bottom: 2px;
}
.info-value {
  font-weight: 600;
  color: #2d3748;
}
.status-active {
  background-color: #e6fffa;
  color: #38b2ac;
  padding: 2px 12px;
  border-radius: 12px;
  font-size: 0.85rem;
  font-weight: bold;
}

/* Optional: Add a Khmer font-family if you have one */
.khmer-font {
  font-family: 'Kantumruy Pro', 'Hanuman', sans-serif;
}
</style>
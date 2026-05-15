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
            <div class="profile-avatar-container shadow-sm">
              <img 
                :src="authStore.profile?.avatar || 'https://via.placeholder.com/150'" 
                alt="Avatar" 
                class="profile-img"
              >
            </div>
            
            <label class="floating-icon btn-upload-float shadow-sm" title="Upload">
              <input type="file" @change="handleFileUpload" hidden />
              <i class="bi bi-upload"></i>
            </label>

            <button @click="isShow = true" class="floating-icon btn-delete-float shadow-sm" title="Delete">
              <i class="bi bi-trash"></i>
            </button>
          </div>

          <h4 class="fw-bold mb-1">{{ authStore.profile?.lastname }} {{ authStore.profile?.fullname }}</h4>
          <p class="text-muted small mb-3">{{ authStore.profile?.email }}</p>

          <div class="mb-4">
            <span class="badge-role">{{ userRole }}</span>
          </div>

          <div class="d-grid gap-2">
            <button @click="startEdit" class="btn btn-edit-profile py-2 fw-bold">កែប្រែព័ត៌មាន</button>
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
            <div class="col-md-6">
              <div class="info-group">
                <label class="info-label khmer-font"><i class="bi bi-person me-2"></i> ឈ្មោះពេញ</label>
                <div class="info-value">{{ authStore.profile?.lastname }} {{ authStore.profile?.fullname }}</div>
              </div>
            </div>

            <div class="col-md-6">
              <div class="info-group">
                <label class="info-label khmer-font"><i class="bi bi-envelope me-2"></i> អ៊ីមែល</label>
                <div class="info-value">{{ authStore.profile?.email }}</div>
              </div>
            </div>

            <div class="col-md-6">
              <div class="info-group">
                <label class="info-label khmer-font"><i class="bi bi-telephone me-2"></i> លេខទូរស័ព្ទ</label>
                <div class="info-value">{{ authStore.profile?.phone || 'Null' }}</div>
              </div>
            </div>

            <div class="col-md-6">
              <div class="info-group">
                <label class="info-label khmer-font"><i class="bi bi-gender-ambiguous me-2"></i> ភេទ</label>
                <div class="info-value">{{ authStore.profile?.gender || 'Null' }}</div>
              </div>
            </div>

            <div class="col-md-6">
              <div class="info-group">
                <label class="info-label khmer-font"><i class="bi bi-calendar-event me-2"></i> ថ្ងៃខែឆ្នាំកំណើត</label>
                <div class="info-value">{{ authStore.profile?.birthday || 'Null' }}</div>
              </div>
            </div>

            <div class="col-md-6">
              <div class="info-group">
                <label class="info-label khmer-font"><i class="bi bi-calendar-check me-2"></i> ថ្ងៃចូលធ្វើការ</label>
                <div class="info-value">{{ authStore.profile?.hireDate || 'Null' }}</div>
              </div>
            </div>

            <div class="col-md-6">
              <div class="info-group">
                <label class="info-label khmer-font"><i class="bi bi-currency-dollar me-2"></i> ប្រាក់បៀវត្សរ៍បច្ចុប្បន្ន</label>
                <div class="info-value">{{ authStore.profile?.salary || 'Null' }}</div>
              </div>
            </div>

            <div class="col-md-6">
              <div class="info-group">
                <label class="info-label khmer-font"><i class="bi bi-shield-check me-2"></i> ស្ថានភាពគណនី</label>
                <div>
                  <span class="status-active">{{ authStore.profile?.status || 'Null' }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    
    <BaseModal :show="isShow" @close="isShow = false" title="លុបរូបភាព">
    <template #body>
      <p class="khmer-font">តើអ្នកប្រាកដជាចង់លុបរូបភាពនេះមែនទេ?</p>
    </template>
    <template #footer>
      <button type="button" class="btn btn-secondary khmer-font" @click="isShow = false">បោះបង់</button>
      <button type="button" class="btn btn-danger khmer-font" @click="handleDeleteAvatar">លុបចេញ</button>
    </template>
  </BaseModal>
  <!-- <BaseModal :show="isShow" @close="isShow = false" title="កែប្រែព័ត៌មាន">
    <template #body>
      <slot>

      </slot>
    </template>
    <template #footer>
     

    </template>
      <p class="khmer-font">តើអ្នកប្រាកដជាចង់លុបគណនីនេះមែនទេ?</p>
  </BaseModal> -->
</div>

</template>

<script setup>
import { useAuthStore } from '@/stores/useAuth';
import { computed, onMounted, reactive, ref } from 'vue';
import api from '@/api/api';
import BaseModal from '@/components/ui/base/BaseModal.vue';
import BaseButton from '@/components/ui/base/BaseButton.vue';


const authStore = useAuthStore();
let loading = ref(false)
const isShow = ref(false);


onMounted(async () => {
  await authStore.fetchProfile(); // Load profile data on mount
  syncFormData();
});

const formData = reactive({
  fullname: '',
  lastName: '',
  email: '',
  phone: '',
  gender: '',
  birthday: '',
  hireDate: '',
  salary: '',
  status: '',
});


const syncFormData = () => {
  formData.fullname = authStore.profile?.fullname || '';
  formData.lastName = authStore.profile?.lastName || '';
  formData.email = authStore.profile?.email || '';
  formData.phone = authStore.profile?.phone || '';
  formData.gender = authStore.profile?.gender || '';
  formData.birthday = authStore.profile?.birthday || '';
  formData.hireDate = authStore.profile?.hireDate || '';
  formData.salary = authStore.profile?.salary || '';
  formData.status = authStore.profile?.status || '';
};

const userRole = computed(() => {
  switch (authStore.profile?.role?.id) {
    case 1: return 'អ្នកគ្រប់គ្រងប្រព័ន្ធ';
    case 2: return 'Manager';
    case 3: return 'Staff';
    default: return 'User';
  }
});


async function handleDeleteAvatar() {
  try {
    await api.delete('/auth/profile/avatar');
    await authStore.fetchProfile();
  } catch (error) {
    console.error(error);
  } finally {
    isShow.value = false;
  }
}

async function handleFileUpload(event) {
  const file = event.target.files[0];
  if (!file) return;

  const data = new FormData();
  
  /** * IMPORTANT: If 'avatar' doesn't work, try changing it to 'file'.
   * Your Postman error "File is required" usually means the 
   * backend didn't find the key it was looking for.
   */
  data.append('avatar', file); 

  try {
    loading.value = true;
    
    // Ensure the path matches your Postman: /auth/profile/avatar
    await api.post('/auth/profile/avatar', data, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });

    await authStore.fetchProfile();
    alert("ជោគជ័យ!");
  } catch (error) {
    console.error("Upload Error Details:", error.response?.data);
    alert("បរាជ័យ: " + (error.response?.data?.message || "Error"));
  } finally {
    loading.value = false;
  }
}
</script>

<style scoped>
/* Profile Image Container */
.profile-avatar-container {
  width: 130px;
  height: 130px;
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

/* Base style for floating icons positioned at the bottom */
.floating-icon {
  position: absolute;
  width: 36px;
  height: 36px;
  border-radius: 50%;
  border: 2px solid #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.2s ease;
  z-index: 5;
  bottom: 2px; /* Pins them to the bottom curve */
}

/* Position: Bottom Left */
.btn-upload-float {
  left: -5px;
  background-color: #f0fdf4;
  color: #5A9688;
}
.btn-upload-float:hover {
  background-color: #5A9688;
  color: white;
}

/* Position: Bottom Right */
.btn-delete-float {
  right: -5px;
  background-color: #fff1f1;
  color: #dc3545;
}
.btn-delete-float:hover {
  background-color: #dc3545;
  color: white;
}

/* Custom Badge */
.badge-role {
  background-color: #f0f2ff;
  color: #5A9688;
  padding: 0.4rem 1.2rem;
  border-radius: 50px;
  font-size: 0.85rem;
  font-weight: 600;
}

/* Action Buttons */
.btn-edit-profile { background-color: #8da399; color: white; border: none; border-radius: 10px; }
.btn-edit-profile:hover { background-color: #7a8e84; }

.btn-action-outline { background-color: #f0f2ff; color: #5c6bc0; border: none; border-radius: 10px; }
.btn-action-success { background-color: #e8f5e9; color: #2e7d32; border: none; border-radius: 10px; }
.btn-action-danger { background-color: #fff1f1; color: #d32f2f; border: none; border-radius: 10px; }

/* Info Grid */
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
  padding: 4px 15px;
  border-radius: 15px;
  font-size: 0.8rem;
  font-weight: bold;
}

.khmer-font {
  font-family: 'Kantumruy Pro', 'Hanuman', sans-serif;
}
</style>
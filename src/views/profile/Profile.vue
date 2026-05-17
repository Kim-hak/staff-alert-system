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

            <button @click="isShowDeleteModal = true" class="floating-icon btn-delete-float shadow-sm" title="Delete">
              <i class="bi bi-trash"></i>
            </button>
          </div>

          <h4 class="fw-bold mb-1">{{ authStore.profile?.fullname }}</h4>
          <p class="text-muted small mb-3">{{ authStore.profile?.email }}</p>

          <div class="mb-4">
            <span class="badge-role">{{ userRole }}</span>
          </div>

          <div class="d-grid gap-2">
            <button @click="openEditModal" class="btn btn-edit-profile py-2 fw-bold khmer-font">កែប្រែព័ត៌មាន</button>
            <button @click="openPasswordModal" class="btn btn-action-outline py-2 fw-bold khmer-font">
              <i class="bi bi-shield-lock me-2"></i> ប្តូរពាក្យសម្ងាត់
            </button>
            <button @click="openEmailModal" class="btn btn-action-success py-2 fw-bold khmer-font">
              <i class="bi bi-envelope me-2"></i> ប្តូរអ៊ីមែល
            </button>
            
            <button 
              @click="openDeleteAccountModal" 
              class="btn btn-action-danger py-2 fw-bold khmer-font text-danger"
              :disabled="authStore.profile?.role?.id === 1"
              :style="authStore.profile?.role?.id === 1 ? { cursor: 'not-allowed', opacity: '0.8' } : {}"
              :title="authStore.profile?.role?.id === 1 ? 'គណនីអ្នកគ្រប់គ្រងប្រព័ន្ធមិនអាចលុបបានទេ' : 'លុបគណនី'"
            >
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
                <div class="info-value">{{ authStore.profile?.fullname }}</div>
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
                <div class="info-value">{{ authStore.profile?.phone || 'មិនមាន' }}</div>
              </div>
            </div>

            <div class="col-md-6">
              <div class="info-group">
                <label class="info-label khmer-font"><i class="bi bi-gender-ambiguous me-2"></i> ភេទ</label>
                <div class="info-value">{{ authStore.profile?.gender || 'មិនមាន' }}</div>
              </div>
            </div>

            <div class="col-md-6">
              <div class="info-group">
                <label class="info-label khmer-font"><i class="bi bi-calendar-event me-2"></i> ថ្ងៃខែឆ្នាំកំណើត</label>
                <div class="info-value">{{ authStore.profile?.birthday || 'មិនមាន' }}</div>
              </div>
            </div>

            <div class="col-md-6">
              <div class="info-group">
                <label class="info-label khmer-font"><i class="bi bi-calendar-check me-2"></i> ថ្ងៃចូលធ្វើការ</label>
                <div class="info-value">{{ authStore.profile?.hireDate || 'មិនមាន' }}</div>
              </div>
            </div>

            <div class="col-md-6">
              <div class="info-group">
                <label class="info-label khmer-font"><i class="bi bi-currency-dollar me-2"></i> ប្រាក់បៀវត្សរ៍បច្ចុប្បន្ន</label>
                <div class="info-value">{{ authStore.profile?.salary || 'មិនមាន' }}</div>
              </div>
            </div>

            <div class="col-md-6">
              <div class="info-group">
                <label class="info-label khmer-font"><i class="bi bi-shield-check me-2"></i> ស្ថានភាពគណនី</label>
                <div>
                  <span class="status-active">{{ authStore.profile?.status || 'មិនមាន' }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    
    <BaseModal :show="isEditModalShow" @close="isEditModalShow = false" title="កែប្រែព័ត៌មាន">
      <template #body>
        <div class="row g-3 text-start text-dark khmer-font p-2">
          <div class="col-12">
            <label class="form-label small fw-bold">ឈ្មោះពេញ</label>
            <input type="text" class="form-control custom-input" v-model="formData.fullname" placeholder="បញ្ចូលឈ្មោះពេញរបស់អ្នក" />
          </div>
          <div class="col-12">
            <label class="form-label small fw-bold">លេខទូរស័ព្ទ</label>
            <input type="text" class="form-control custom-input" v-model="formData.phone" />
          </div>
          <div class="col-12">
            <label class="form-label small fw-bold">ភេទ</label>
            <select class="form-select custom-input" v-model="formData.gender">
              <option value="MALE">MALE</option>
              <option value="FEMALE">FEMALE</option>
            </select>
          </div>
        </div>
      </template>
      <template #footer>
        <div class="d-flex justify-content-end gap-2 w-100 p-1">
          <button type="button" class="btn btn-custom-secondary khmer-font px-4" @click="isEditModalShow = false">បោះបង់</button>
          <button type="button" class="btn btn-custom-success khmer-font px-4" @click="handleUpdateProfile" :disabled="loading">
            {{ loading ? 'កំពុងរក្សាទុក...' : 'រក្សាទុក' }}
          </button>
        </div>
      </template>
    </BaseModal>

    <BaseModal :show="isPasswordModalShow" @close="isPasswordModalShow = false" title="ប្តូរពាក្យសម្ងាត់">
      <template #body>
        <div class="row g-3 text-start text-dark khmer-font p-2">
          <div class="col-12">
            <label class="form-label small fw-bold">ពាក្យសម្ងាត់បច្ចុប្បន្ន</label>
            <input type="password" class="form-control custom-input" v-model="passwordData.currentPassword" placeholder="បញ្ចូលពាក្យសម្ងាត់បច្ចុប្បន្ន" />
          </div>
          <div class="col-12">
            <label class="form-label small fw-bold">ពាក្យសម្ងាត់ថ្មី</label>
            <input type="password" class="form-control custom-input" v-model="passwordData.newPassword" placeholder="បញ្ចូលពាក្យសម្ងាត់ថ្មី" />
          </div>
          <div class="col-12">
            <label class="form-label small fw-bold">បញ្ជាក់ពាក្យសម្ងាត់ថ្មី</label>
            <input type="password" class="form-control custom-input" v-model="passwordData.confirmPassword" placeholder="បញ្ចូលពាក្យសម្ងាត់ថ្មីម្តងទៀត" />
          </div>
        </div>
      </template>
      <template #footer>
        <div class="d-flex justify-content-end gap-2 w-100 p-1">
          <button type="button" class="btn btn-custom-secondary khmer-font px-4" @click="isPasswordModalShow = false">បោះបង់</button>
          <button type="button" class="btn btn-custom-success khmer-font px-4" @click="handleChangePassword" :disabled="loadingPassword">
            {{ loadingPassword ? 'កំពុងរក្សាទុក...' : 'រក្សាទុក' }}
          </button>
        </div>
      </template>
    </BaseModal>

    <BaseModal :show="isEmailModalShow" @close="isEmailModalShow = false" title="ប្តូរអ៊ីមែល">
      <template #body>
        <div class="row g-3 text-start text-dark khmer-font p-2">
          <template v-if="emailStep === 1">
            <div class="col-12">
              <label class="form-label small fw-bold">អ៊ីមែលថ្មី</label>
              <input type="email" class="form-control custom-input" v-model="emailData.newEmail" placeholder="បញ្ចូលអាសយដ្ឋានអ៊ីមែលថ្មី" />
            </div>
            <div class="col-12">
              <label class="form-label small fw-bold">ពាក្យសម្ងាត់បច្ចុប្បន្ន</label>
              <input type="password" class="form-control custom-input" v-model="emailData.password" placeholder="បញ្ចូលពាក្យសម្ងាត់គណនីបច្ចុប្បន្ន" />
            </div>
          </template>

          <template v-else-if="emailStep === 2">
            <div class="col-12 text-center py-2">
              <i class="bi bi-envelope-check text-success display-4"></i>
              <p class="mt-2 text-muted small">លេខកូដផ្ទៀងផ្ទាត់ត្រូវបានផ្ញើទៅកាន់អ៊ីមែលថ្មីរបស់អ្នករួចហើយ។ សូមពិនិត្យប្រអប់សារ។</p>
            </div>
            <div class="col-12">
              <label class="form-label small fw-bold text-center w-100">លេខកូដផ្ទៀងផ្ទាត់ (Verification Token)</label>
              <input type="text" class="form-control custom-input text-center fw-bold letter-spacing" v-model="emailData.token" placeholder="បញ្ចូលលេខកូដផ្ទៀងផ្ទាត់" />
            </div>
          </template>
        </div>
      </template>
      <template #footer>
        <div class="d-flex justify-content-end gap-2 w-100 p-1">
          <button type="button" class="btn btn-custom-secondary khmer-font px-4" @click="isEmailModalShow = false">បោះបង់</button>
          <button v-if="emailStep === 1" type="button" class="btn btn-custom-success khmer-font px-4" @click="handleRequestEmailChange" :disabled="loadingEmail">
            {{ loadingEmail ? 'កំពុងផ្ញើ...' : 'បន្តទៅមុខ' }}
          </button>
          <button v-else-if="emailStep === 2" type="button" class="btn btn-custom-success khmer-font px-4" @click="handleVerifyEmailChange" :disabled="loadingEmail">
            {{ loadingEmail ? 'កំពុងផ្ទៀងផ្ទាត់...' : 'ផ្ទៀងផ្ទាត់' }}
          </button>
        </div>
      </template>
    </BaseModal>

    <BaseModal :show="isDeleteAccountModalShow" @close="isDeleteAccountModalShow = false" title="លុបគណនីផ្ទាល់ខ្លួន">
      <template #body>
        <div class="row g-3 text-start text-dark khmer-font p-2">
          <div class="col-12 text-center py-2">
            <i class="bi bi-exclamation-triangle text-danger display-4"></i>
            <h5 class="fw-bold mt-3 text-danger">ព្រមាន៖ សកម្មភាពនេះមិនអាចត្រឡប់ក្រោយបានទេ!</h5>
            <p class="text-muted small px-2 mt-2">
              ទិន្នន័យ ឯកសារ និងព័ត៌មានទាំងអស់របស់អ្នកនឹងត្រូវលុបចេញពីប្រព័ន្ធជាអចិន្ត្រៃយ៍។ សូមបញ្ចូលពាក្យសម្ងាត់របស់អ្នកដើម្បីបញ្ជាក់ការលុបនេះ។
            </p>
          </div>
          <div class="col-12">
            <label class="form-label small fw-bold">ពាក្យសម្ងាត់បច្ចុប្បន្ន</label>
            <input 
              type="password" 
              class="form-control custom-input" 
              v-model="deleteAccountPassword" 
              placeholder="បញ្ចូលពាក្យសម្ងាត់របស់អ្នកដើម្បីលុបគណនី" 
            />
          </div>
        </div>
      </template>
      <template #footer>
        <div class="d-flex justify-content-end gap-2 w-100 p-1">
          <button type="button" class="btn btn-custom-secondary khmer-font px-4" @click="isDeleteAccountModalShow = false">បោះបង់</button>
          <button type="button" class="btn btn-custom-danger khmer-font px-4" @click="handleDeleteAccount" :disabled="loadingDeleteAccount">
            {{ loadingDeleteAccount ? 'កំពុងលុប...' : 'លុបគណនីចោល' }}
          </button>
        </div>
      </template>
    </BaseModal>

    <BaseModal :show="isShowDeleteModal" @close="isShowDeleteModal = false" title="លុបរូបភាព">
      <template #body>
        <div class="p-2 text-start">
          <p class="khmer-font text-dark mb-0">តើអ្នកពិតជាចង់លុបរូបភាពកម្រងព័ត៌មាននេះមែនទេ?</p>
        </div>
      </template>
      <template #footer>
        <div class="d-flex justify-content-end gap-2 w-100 p-1">
          <button type="button" class="btn btn-custom-secondary khmer-font px-4" @click="isShowDeleteModal = false">បោះបង់</button>
          <button type="button" class="btn btn-custom-danger khmer-font px-4" @click="handleDeleteAvatar">លុបចេញ</button>
        </div>
      </template>
    </BaseModal>
  </div>
</template>

<script setup>
import { useAuthStore } from '@/stores/useAuth';
import { computed, onMounted, reactive, ref } from 'vue';
import api from '@/api/api';
import BaseModal from '@/components/ui/base/BaseModal.vue';
import { useToast } from 'vue-toastification';
import { useRouter } from 'vue-router';

const authStore = useAuthStore();
const toast = useToast();
const router = useRouter();

const loading = ref(false);
const loadingPassword = ref(false);
const loadingEmail = ref(false);
const loadingDeleteAccount = ref(false);

const isShowDeleteModal = ref(false);
const isEditModalShow = ref(false);
const isPasswordModalShow = ref(false);
const isEmailModalShow = ref(false);
const isDeleteAccountModalShow = ref(false);

const emailStep = ref(1);
const deleteAccountPassword = ref('');

const formData = reactive({
  fullname: '',
  phone: '',
  gender: '',
});

const passwordData = reactive({
  currentPassword: '',
  newPassword: '',
  confirmPassword: ''
});

const emailData = reactive({
  newEmail: '',
  password: '',
  token: ''
});

const syncFormData = () => {
  formData.fullname = authStore.profile?.fullname || '';
  formData.phone = authStore.profile?.phone || '';
  formData.gender = authStore.profile?.gender || 'MALE';
};

onMounted(async () => {
  await authStore.fetchProfile();
  syncFormData();
});

const userRole = computed(() => {
  switch (authStore.profile?.role?.id) {
    case 1: return 'អ្នកគ្រប់គ្រងប្រព័ន្ធ';
    case 2: return 'Manager';
    case 3: return 'Staff';
    default: return 'User';
  }
});

const openEditModal = () => {
  syncFormData();
  isEditModalShow.value = true;
};

const openPasswordModal = () => {
  passwordData.currentPassword = '';
  passwordData.newPassword = '';
  passwordData.confirmPassword = '';
  isPasswordModalShow.value = true;
};

const openEmailModal = () => {
  emailStep.value = 1;
  emailData.newEmail = '';
  emailData.password = '';
  emailData.token = '';
  isEmailModalShow.value = true;
};

const openDeleteAccountModal = () => {
  if (authStore.profile?.role?.id === 1) {
    toast.error("គណនីអ្នកគ្រប់គ្រងប្រព័ន្ធ (Admin) មិនអាចលុបបានឡើយ");
    return;
  }
  deleteAccountPassword.value = '';
  isDeleteAccountModalShow.value = true;
};

// HANDLE ACCOUNT DELETION PIPELINE
async function handleDeleteAccount() {
  if (authStore.profile?.role?.id === 1) {
    toast.error("គណនីអ្នកគ្រប់គ្រងប្រព័ន្ធ (Admin) មិនអាចលុបបានឡើយ");
    isDeleteAccountModalShow.value = false;
    return;
  }

  if (!deleteAccountPassword.value) {
    toast.error("សូមបញ្ចូលពាក្យសម្ងាត់របស់អ្នកដើម្បីបញ្ជាក់ការលុបគណនី");
    return;
  }

  try {
    loadingDeleteAccount.value = true;

    await api.post('/auth/delete-account', {
      password: deleteAccountPassword.value
    });

    isDeleteAccountModalShow.value = false;
    toast.success("គណនីរបស់អ្នកត្រូវបានលុបដោយជោគជ័យ", { timeout: 3000 });

    if (typeof authStore.logout === 'function') {
      await authStore.logout();
    } else {
      localStorage.clear();
      sessionStorage.clear();
    }

    router.push('/login');
  } catch (error) {
    console.error("Critical failure during account deletion processing:", error);
    const serverMessage = error.response?.data?.message || "ការលុបគណនីមិនបានជោគជ័យទេ ពាក្យសម្ងាត់អាចនឹងមិនត្រឹមត្រូវ";
    toast.error(serverMessage);
  } finally {
    loadingDeleteAccount.value = false;
  }
}

// REQUEST EMAIL CHANGE
async function handleRequestEmailChange() {
  if (!emailData.newEmail || !emailData.password) {
    toast.error("សូមបំពេញអ៊ីមែលថ្មី និងពាក្យសម្ងាត់បច្ចុប្បន្នរបស់អ្នក");
    return;
  }
  try {
    loadingEmail.value = true;
    await api.post('/auth/change-email', {
      newEmail: emailData.newEmail,
      password: emailData.password
    });
    emailStep.value = 2;
    toast.info("លេខកូដផ្ទៀងផ្ទាត់ត្រូវបានផ្ញើទៅកាន់អ៊ីមែលថ្មីរបស់អ្នក");
  } catch (error) {
    console.error(error);
    toast.error(error.response?.data?.message || "ការស្នើសុំប្តូរអ៊ីមែលបានបរាជ័យ");
  } finally {
    loadingEmail.value = false;
  }
}

// VERIFY EMAIL CHANGE CODE
async function handleVerifyEmailChange() {
  if (!emailData.token) {
    toast.error("សូមបញ្ចូលលេខកូដផ្ទៀងផ្ទាត់របស់អ្នក");
    return;
  }
  try {
    loadingEmail.value = true;
    await api.post('/auth/verify-change-email', { token: emailData.token });
    await authStore.fetchProfile();
    isEmailModalShow.value = false;
    toast.success("បានផ្លាស់ប្តូរអ៊ីមែលដោយជោគជ័យ", {
      timeout: 2500,
      position: "top-right",
      toastClassName: "custom-app-toast"
    });
  } catch (error) {
    console.error(error);
    toast.error(error.response?.data?.message || "លេខកូដផ្ទៀងផ្ទាត់មិនត្រឹមត្រូវទេ");
  } finally {
    loadingEmail.value = false;
  }
}

// CHANGE PASSWORD METHOD
async function handleChangePassword() {
  if (!passwordData.currentPassword || !passwordData.newPassword) {
    toast.error("សូមបំពេញព័ត៌មានឱ្យបានគ្រប់គ្រង");
    return;
  }
  if (passwordData.newPassword !== passwordData.confirmPassword) {
    toast.error("ពាក្យសម្ងាត់ថ្មីមិនត្រូវគ្នាទេ");
    return;
  }
  try {
    loadingPassword.value = true;
    await api.put('/auth/change-password', {
      currentPassword: passwordData.currentPassword,
      newPassword: passwordData.newPassword
    });
    isPasswordModalShow.value = false;
    toast.success("បានផ្លាស់ប្តូរពាក្យសម្ងាត់ដោយជោគជ័យ", {
      timeout: 2000,
      position: "top-right",
      toastClassName: "custom-app-toast"
    });
  } catch (error) {
    console.error(error);
    toast.error(error.response?.data?.message || "ការប្តូរពាក្យសម្ងាត់បានបរាជ័យ");
  } finally {
    loadingPassword.value = false;
  }
}

// PROFILE INFORMATION CHANGE SUBMIT
async function handleUpdateProfile() {
  try {
    loading.value = true;
    await api.put('/auth/profile', formData);
    await authStore.fetchProfile();
    isEditModalShow.value = false;
    toast.success("បានកែប្រែព័ត៌មានដោយជោគជ័យ", {
      timeout: 2000,
      position: "top-right",
      toastClassName: "custom-app-toast"
    });
  } catch (error) {
    console.error(error);
    toast.error("ការកែប្រែព័ត៌មានបានបរាជ័យ");
  } finally {
    loading.value = false;
  }
}

// AVATAR FILE UPLOAD
async function handleFileUpload(event) {
  const file = event.target.files[0];
  if (!file) return;

  const data = new FormData();
  data.append('avatar', file); 

  try {
    loading.value = true;
    await api.post('/auth/profile/avatar', data, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    await authStore.fetchProfile();
    toast.success("បានផ្លាស់ប្តូររូបភាពកម្រងព័ត៌មានដោយជោគជ័យ", {
      timeout: 2000,
      position: "top-right",
      toastClassName: "custom-app-toast" 
    });
  } catch (error) {
    console.log(error);
    toast.error("ការដាក់បញ្ចូលរូបភាពបានបរាជ័យ");
  } finally {
    loading.value = false;
  }
}

// AVATAR REMOVAL Logic
async function handleDeleteAvatar() {
  try {
    loading.value = true;
    await api.delete('/auth/profile/avatar');
    await authStore.fetchProfile();
    toast.success("បានលុបរូបភាពកម្រងព័ត៌មានដោយជោគជ័យ", {
      timeout: 2000,
      position: "top-right",
      toastClassName: "custom-app-toast" 
    });
  } catch (error) {
    console.error(error);
    toast.error("ការលុបរូបភាពបានបរាជ័យ");
  } finally {
    loading.value = false;
    isShowDeleteModal.value = false;
  }
}
</script>

<style scoped>
:deep(.modal-container), :deep(.modal-content) {
  max-width: 460px !important; 
  border-radius: 16px !important;
  border: none !important;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.15) !important;
  overflow: hidden;
}

:deep(.modal-header) {
  background-color: #5A9688 !important; 
  color: white !important;
  border-bottom: none !important;
  padding: 1rem 1.25rem !important;
}

:deep(.modal-header .btn-close) {
  filter: invert(1) grayscale(1) brightness(2); 
}

.custom-input {
  border-radius: 8px;
  border: 1px solid #e2e8f0;
  padding: 0.5rem 0.75rem;
}
.custom-input:focus {
  border-color: #5A9688;
  box-shadow: 0 0 0 3px rgba(90, 150, 136, 0.15);
}

.letter-spacing {
  letter-spacing: 4px;
}

.btn-custom-success {
  background-color: #5A9688 !important;
  color: white !important;
  border-radius: 8px !important;
  border: none;
}
.btn-custom-success:hover {
  background-color: #497a6e !important;
}

.btn-custom-danger {
  background-color: #dc3545 !important;
  color: white !important;
  border-radius: 8px !important;
  border: none;
}
.btn-custom-danger:hover {
  background-color: #bb2d3b !important;
}

.btn-custom-secondary {
  background-color: #6c757d !important;
  color: white !important;
  border-radius: 8px !important;
  border: none;
}
.btn-custom-secondary:hover {
  background-color: #5a6268 !important;
}

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
  bottom: 2px;
}
.btn-upload-float {
  left: -5px;
  background-color: #f0fdf4;
  color: #5A9688;
}
.btn-upload-float:hover {
  background-color: #5A9688;
  color: white;
}
.btn-delete-float {
  right: -5px;
  background-color: #fff1f1;
  color: #dc3545;
}
.btn-delete-float:hover {
  background-color: #dc3545;
  color: white;
}
.badge-role {
  background-color: #f0f2ff;
  color: #5A9688;
  padding: 0.4rem 1.2rem;
  border-radius: 50px;
  font-size: 0.85rem;
  font-weight: 600;
}
.btn-edit-profile { background-color: #5A9688; color: white; border: none; border-radius: 10px; }
.btn-edit-profile:hover { background-color: #497a6e; }

.btn-action-outline { background-color: #f0f2ff; color: #5c6bc0; border: none; border-radius: 10px; }
.btn-action-success { background-color: #e8f5e9; color: #2e7d32; border: none; border-radius: 10px; }
.btn-action-danger { background-color: #fff1f1; color: #d32f2f; border: none; border-radius: 10px; }

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

:global(.Vue-Toastification__toast--success.custom-app-toast) {
  background-color: #5A9688 !important; 
  color: white !important;
  border-radius: 10px !important;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1) !important;
  font-family: 'Kantumruy Pro', sans-serif !important;
}
:global(.custom-app-toast .Vue-Toastification__close-button) {
  color: white !important;
}
</style>
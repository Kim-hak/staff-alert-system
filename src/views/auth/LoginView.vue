<template>
  <div class="bg-light d-flex align-items-center justify-content-center p-4 min-vh-100">
    <div class="w-100" style="max-width: 450px">
      <div class="bg-white rounded-4 shadow p-4 border">
        
        <div class="d-flex flex-column align-items-center mb-4 mt-n3">
          <div
            class="rounded-circle d-flex align-items-center justify-content-center overflow-hidden mb-3"
            style="width: 130px; height: 130px; background-color: #5A9688;"
          >
            <span class="text-white fs-1">🔐</span>
          </div>

          <h1 class="h3 fw-semibold text-dark mb-1">ចូលគណនី</h1>

          <p class="text-secondary small mb-0">
            សូមស្វាគមន៍មកកាន់ប្រព័ន្ធគ្រប់គ្រង
          </p>
        </div>

        <form @submit.prevent="handleLogin">
          <div class="mb-4">
            <label class="form-label fw-medium text-dark">អុីម៉ែល</label>
            <input
              type="email"
              autocomplete="off"
              placeholder="បញ្ចូលអ៊ីម៉ែល"
              class="form-control py-3"
              :class="{ 'is-invalid': error.email }"
              v-model="form.email"
              @input="validationEmail"
            />
            <div v-if="error.email" class="invalid-feedback">
              {{ error.email }}
            </div>
          </div>

          <div class="mb-4">
            <label class="form-label fw-medium text-dark">ពាក្យសម្ងាត់</label>
            <input
              v-model="form.password"
              @input="validationPassword"
              type="password"
              autocomplete="off"
              placeholder="បញ្ចូលពាក្យសម្ងាត់"
              class="form-control py-3"
              :class="{ 'is-invalid': error.password }"
            />
            <div v-if="error.password" class="invalid-feedback text-danger small mt-1">
              {{ error.password }}
            </div>

            <div class="d-flex justify-content-end mt-2">
              <router-link
                to="/auth/forget-password"
                class="small fw-semibold text-decoration-none"
                style="color: #5A9688;"
              >
                ភ្លេចពាក្យសម្ងាត់?
              </router-link>
            </div>
          </div>

          <button
            type="submit"
            :disabled="loading"
            class="btn w-100 py-3 fw-semibold d-flex align-items-center justify-content-center gap-2 text-white"
            style="background-color: #5A9688; border: none;"
          >
            <div
              v-if="loading"
              class="spinner-border spinner-border-sm text-light"
              role="status"
            ></div>
            <span>{{ loading ? 'កំពុងចូល...' : 'ចូលគណនី' }}</span>
          </button>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { reactive, ref } from 'vue';
import { useAuthStore } from '@/stores/useAuth';
import { useRouter } from 'vue-router';
import { validator } from '@/composables/useValitor';
import { useToast } from "vue-toastification";

const { validatField, error } = validator();
const router = useRouter();
const authStore = useAuthStore();
const toast = useToast();

const form = reactive({
  email: '',
  password: ''
});
const loading = ref(false);

// Validation Functions
function validationEmail() {
  return validatField('email', form.email, 'សូមបញ្ចូលអ៊ីមែលរបស់អ្នក');
}

function validationPassword() {
  // 1. Check if empty
  if (!form.password) {
    error.password = 'សូមបញ្ចូលពាក្យសម្ងាត់របស់អ្នក';
    return false;
  }
  // 2. Check for 8 characters
  if (form.password.length < 8) {
    error.password = 'ពាក្យសម្ងាត់ត្រូវមានយ៉ាងហោច ៨ តួអក្សរ';
    return false;
  }
  // 3. Clear error if valid
  error.password = '';
  return true;
}

function validationForm() {
  const isEmailValid = validationEmail();
  const isPasswordValid = validationPassword();
  return isEmailValid && isPasswordValid;
}

async function handleLogin() {
  if (!validationForm()) return;
  try {
    loading.value = true;
    await authStore.login(form);
    
    if (authStore.token && authStore.profile) {
      // SUCCESS TOAST
      toast.success("បានចូលគណនីដោយជោគជ័យ", {
        timeout: 2000,
        position: "top-right",
        // ADD THIS LINE TO APPLY YOUR COLOR AND SIZE:
        toastClassName: "custom-toast-success" 
      });

      // Redirect logic
      const roleId = authStore.profile.role.id;
      if (roleId === 1 || roleId === 2) router.replace({ name: 'managerDashboard' });
      else router.replace({ name: 'staffDashboard' });
    }
  } catch (error) {
    toast.error(authStore.message_error || "Login failed!");
  } finally {
    loading.value = false;
  }
}
</script>

<style scoped>
.btn:hover {
  filter: brightness(90%);
}
/* This matches your small toast request from earlier */
:deep(.custom-toast-success) {
  background-color: #5A9688 !important;
  font-size: 13px !important;
}
</style>
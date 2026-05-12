<template>
  <div class="bg-light d-flex align-items-center justify-content-center p-4 min-vh-100">
    <div class="w-100" style="max-width: 450px">
      <div class="bg-white rounded-4 shadow p-4 border">
        
        <div class="d-flex flex-column align-items-center mb-4 mt-n3">
          <div
            class="rounded-circle d-flex align-items-center justify-content-center overflow-hidden mb-3"
            style="width: 130px; height: 130px"
          >
            <img
              src=""
              alt="Logo"
              class="w-100 h-100 object-fit-cover"
            />
          </div>

          <h1 class="h3 fw-semibold text-dark mb-1">ចូលគណនី</h1>

          <p class="text-secondary small mb-0">
            សូមស្វាគមន៍មកកាន់ប្រព័ន្ធគ្រប់គ្រង
          </p>
        </div>


        <form @submit.prevent="handleLogin">

          <!-- Email -->
          <div class="mb-4">
            <label class="form-label fw-medium text-dark">
              អុីម៉ែល
            </label>

            <input
              type="email"
              autocomplete="off"
              placeholder="បញ្ចូលអ៊ីម៉ែល"
              class="form-control py-3"
              :class="{ 'is-invalid': error.email }"
              v-model="form.email"
              @input="validationEmail"
            />

            <small class="text-danger">
              {{ error.email }}
            </small>
          </div>

          <!-- Password -->
          <div class="mb-4">
            <label class="form-label fw-medium text-dark">
              ពាក្យសម្ងាត់
            </label>

            <input
              v-model="form.password"
              @input="validationPassword"
              type="password"
              autocomplete="off"
              placeholder="បញ្ចូលពាក្យសម្ងាត់"
              class="form-control py-3"
              :class="{ 'is-invalid': error.password }"
            />

            <small class="text-danger">
              {{ error.password }}
            </small>

            <div class="d-flex justify-content-end mt-2">
              <router-link
                to="/auth/forget-password"
                class="small fw-semibold text-success text-decoration-none"
              >
                ភ្លេចពាក្យសម្ងាត់?
              </router-link>
            </div>
          </div>

          <!-- Button -->
          <button
            type="submit"
            :disabled="loading"
            class="btn btn-success w-100 py-3 fw-semibold d-flex align-items-center justify-content-center gap-2"
          >
            <div
              v-if="loading"
              class="spinner-border spinner-border-sm text-light"
              role="status"
            ></div>

            <span>
              {{ loading ? 'កំពុងចូល...' : 'ចូលគណនី' }}
            </span>
          </button>
        </form>

        <!-- Footer -->
        <!-- <div class="mt-4 pt-4 border-top text-center">
          <p class="small text-secondary mb-0">
            មិនទាន់មានគណនី?
            <span
              class="text-success fw-semibold ms-1"
              style="cursor: not-allowed"
            >
              ទាក់ទងអ្នកគ្រប់គ្រង
            </span>
          </p>
        </div> -->

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
const {validatField, error} = validator();
const router = useRouter();
const authStore = useAuthStore();
const toast = useToast();

let form = reactive({
  email: '',
  password: ''
})
let loading = ref(false);

// validation ===========================
function validationEmail(){
  return (validatField('email', form.email, 'សូមបញ្ចូលអ៊ីមែលរបស់អ្នក'));
} 
// function validationPassword(){
//   return (validatField('password', form.password, 'សូមបញ្ចូលពាក្យសម្ងាត់របស់អ្នក'));
// } 
const validationPassword = () => validatField('password', form.password, 'សូមបញ្ចូលពាក្យសម្ងាត់របស់អ្នក')


function validationForm(){
  let isValide = true;
  let v_email = validationEmail();
  let v_password = validationPassword();
  if(!v_email || !v_password){
    isValide = false;
  }
  return isValide
}

async function handleLogin() {
  if (!validationForm()) return;
  try {
    loading.value = true;
    await authStore.login(form);
    
    if (authStore.token && authStore.profile) {
      // 3. Show Success Alert
      toast.success("បានចូលគណនីដោយជោគជ័យ", {
        timeout: 2000
      });

      const roleId = authStore.profile.role.id;
      
      // Use replace to clear history
      if (roleId === 1) router.replace({ name: 'adminDashboard' });
      else if (roleId === 2) router.replace({ name: 'managerDashboard' });
      else if (roleId === 3) router.replace({ name: 'staffDashboard' });
    }
  } catch (error) {
    // 4. Show Error Alert if login fails
    toast.error(authStore.message_error || "Login failed!");
  } finally {
    loading.value = false;
  }
}
</script>

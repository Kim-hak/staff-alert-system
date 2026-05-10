<template>
<<<<<<< HEAD
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

        <div
          v-if="authStore.message_error"
          class="alert alert-danger"
          role="alert"
        >
          <i class="bi bi-exclamation-triangle"></i>
          {{ authStore.message_error }}
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
const {validatField, error} = validator();
const router = useRouter();
const authStore = useAuthStore();

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
      const roleId = authStore.profile.role.id;

      if (roleId === 1) {
        router.replace({ name: 'adminDashboard' });
      } else if (roleId === 2) {
        router.push({ name: 'managerDashboard' });
      } else if (roleId === 3) {
        router.push({ name: 'staffDashboard' });
      }
    }
  } catch (error) {
    // Error is handled by authStore.message_error
  } finally {
    loading.value = false;
  }
}
</script>
=======
  <main class="login-page">
    <section class="login-panel">
      <div>
        <p class="login-eyebrow">Staff Alert System</p>
        <h1>Sign in</h1>
      </div>

      <form class="login-form" @submit.prevent>
        <label>
          Email
          <input type="email" autocomplete="email" placeholder="name@example.com" />
        </label>

        <label>
          Password
          <input type="password" autocomplete="current-password" placeholder="Password" />
        </label>

        <button type="submit">Login</button>
      </form>
    </section>
  </main>
</template>

<style scoped>
.login-page {
  min-height: 100vh;
  display: grid;
  place-items: center;
  background: #f4f6f8;
  padding: 24px;
}

.login-panel {
  width: min(100%, 420px);
  background: #ffffff;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  padding: 32px;
  box-shadow: 0 16px 40px rgba(15, 23, 42, 0.08);
}

.login-eyebrow {
  margin: 0 0 8px;
  color: #475569;
  font-size: 0.875rem;
  font-weight: 600;
}

h1 {
  margin: 0 0 24px;
  color: #0f172a;
  font-size: 2rem;
}

.login-form {
  display: grid;
  gap: 16px;
}

label {
  display: grid;
  gap: 6px;
  color: #334155;
  font-weight: 600;
}

input {
  width: 100%;
  border: 1px solid #cbd5e1;
  border-radius: 6px;
  padding: 10px 12px;
  font: inherit;
}

button {
  border: 0;
  border-radius: 6px;
  background: #2563eb;
  color: #ffffff;
  font: inherit;
  font-weight: 700;
  padding: 11px 16px;
}
</style>
>>>>>>> 3047df3811000b1ce6a0a11be996512e324e56ca

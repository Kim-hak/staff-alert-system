<template>
  <div class="min-vh-100 bg-light d-flex align-items-center justify-content-center p-3">
    <div class="w-100" style="max-width: 500px">
      <div class="card shadow-lg border-0 rounded-4 p-4">
        
        <button
          @click="router.push('/')"
          class="btn btn-link text-decoration-none text-success d-flex align-items-center gap-2 mb-4 p-0"
        >
          &larr; ត្រឡប់ក្រោយ
        </button>

        <div class="text-center mb-5">
          <div
            class="rounded-circle bg-success d-flex align-items-center justify-content-center mx-auto mb-3"
            style="width: 70px; height: 70px"
          >
            <span class="text-white fs-2">🔒</span>
          </div>

          <h1 class="h3 text-dark mb-2">បង្កើតពាក្យសម្ងាត់ថ្មី</h1>

          <p class="text-muted mb-0">
            បញ្ចូលពាក្យសម្ងាត់ថ្មីដែលអ្នកចង់ប្រើ
          </p>
        </div>

        <form @submit.prevent="handleResetPassword">

          <div
            v-if="!hasToken"
            class="alert alert-danger"
            role="alert"
          >
            សូមចុចតំណនៅក្នុងអ៊ីមែលដែលបានផ្ញើទៅអ្នក ដើម្បីបន្តការកំណត់ពាក្យសម្ងាត់ថ្មី។
          </div>

          <div v-if="authStore.message_error" class="alert alert-danger mb-3" role="alert">
            {{ authStore.message_error }}
          </div>

          <div class="mb-4">
            <label class="form-label text-dark">ពាក្យសម្ងាត់ថ្មី</label>
            <input
              v-model="newPassword"
              type="password"
              placeholder="យ៉ាងហោច ៨ តួអក្សរ"
              class="form-control"
              :class="{ 'is-invalid': passwordErrors.newPassword }"
              @input="passwordErrors.newPassword = ''; authStore.message_error = ''"
            />
            <div v-if="passwordErrors.newPassword" class="invalid-feedback">
              {{ passwordErrors.newPassword }}
            </div>
          </div>

          <div class="mb-4">
            <label class="form-label text-dark">បញ្ជាក់ពាក្យសម្ងាត់</label>
            <input
              v-model="confirmPassword"
              type="password"
              placeholder="បញ្ជាក់ពាក្យសម្ងាត់ម្តងទៀត"
              class="form-control"
              :class="{ 'is-invalid': passwordErrors.confirmPassword }"
              @input="passwordErrors.confirmPassword = ''; authStore.message_error = ''"
            />
            <div v-if="passwordErrors.confirmPassword" class="invalid-feedback">
              {{ passwordErrors.confirmPassword }}
            </div>
          </div>

          <button
            type="submit"
            :disabled="loading || !hasToken"
            class="btn btn-success w-100 py-2"
          >
            {{ loading ? "កំពុងផ្លាស់ប្តូរពាក្យសម្ងាត់..." : "ប្តូរពាក្យសម្ងាត់" }}
          </button>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed } from "vue";
import { useRouter, useRoute } from "vue-router";
import { useAuthStore } from "@/stores/useAuth";
import { useToastStore } from "@/stores/useToast";

const router = useRouter();
const route = useRoute();
const authStore = useAuthStore();
const toast = useToast(); // 2. Initialize the toast hook

const token = computed(() => route.query.token || "");
const newPassword = ref("");
const confirmPassword = ref("");
const passwordErrors = reactive({ newPassword: "", confirmPassword: "" });
const loading = ref(false);
const hasToken = computed(() => !!token.value);

const handleResetPassword = async () => {
  let hasError = false;
  
  if (newPassword.value.length < 8) {
    passwordErrors.newPassword = "ពាក្យសម្ងាត់ត្រូវមានយ៉ាងហោច ៨ តួអក្សរ";
    hasError = true;
  }
  
  if (newPassword.value !== confirmPassword.value) {
    passwordErrors.confirmPassword = "ពាក្យសម្ងាត់មិនស៊ីគ្នា";
    hasError = true;
  }

  if (!hasToken.value) {
    toast.error("មិនមាន Token សំរាប់កំណត់ពាក្យសម្ងាត់ថ្មីទេ។");
    return;
  }

  if (hasError) return;

  loading.value = true;

  try {
    await authStore.resetPassword(token.value, newPassword.value);
    
    // 1. Show your successful toast alert
    toast.success("លេខសម្ងាត់ត្រូវបានផ្លាស់ប្តូរដោយជោគជ័យ!", {
      timeout: 3000,
      position: "top-right"
    });
    newPassword.value = "";
    confirmPassword.value = "";
    // 2. USE REPLACE INSTEAD OF PUSH
    // This removes the reset page from the history stack
    router.replace("/"); 
    
  } catch (error) {
    authStore.message_error = error?.message || "មានកំហុសពេលផ្លាស់ប្តូរពាក្យសម្ងាត់។";
  } finally {
    loading.value = false;
  }
};
</script>
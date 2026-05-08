<template>
  <div class="min-vh-100 bg-light d-flex align-items-center justify-content-center p-3">
    <div class="w-100" style="max-width: 500px">
      <div class="card shadow-lg border-0 rounded-4 p-4">
        
        <!-- Back Button -->
        <button
          @click="router.push('/login')"
          class="btn btn-link text-decoration-none text-success d-flex align-items-center gap-2 mb-4 p-0"
        >
          <ArrowLeftIcon class="me-1" style="width: 16px; height: 16px" />
          ត្រឡប់ក្រោយ
        </button>

        <!-- Header -->
        <div class="text-center mb-5">
          <div
            class="rounded-circle bg-success d-flex align-items-center justify-content-center mx-auto mb-3"
            style="width: 70px; height: 70px"
          >
            <LockIcon class="text-white" style="width: 32px; height: 32px" />
          </div>

          <h1 class="h3 text-dark mb-2">បង្កើតពាក្យសម្ងាត់ថ្មី</h1>

          <p class="text-muted mb-0">
            បញ្ចូលពាក្យសម្ងាត់ថ្មីដែលអ្នកចង់ប្រើ
          </p>
        </div>

        <!-- Form -->
        <form @submit.prevent="handleResetPassword">

          <!-- No Token Alert -->
          <div
            v-if="!hasToken"
            class="alert alert-danger"
            role="alert"
          >
            សូមចុចតំណនៅក្នុងអ៊ីមែលដែលបានផ្ញើទៅអ្នក
            ដើម្បីបន្តការកំណត់ពាក្យសម្ងាត់ថ្មី។
          </div>

          <!-- New Password -->
          <div class="mb-4">
            <label class="form-label text-dark">
              ពាក្យសម្ងាត់ថ្មី
            </label>

            <input
              v-model="newPassword"
              type="password"
              placeholder="យ៉ាងហោច ៨ តួអក្សរ"
              class="form-control"
              :class="{ 'is-invalid': passwordErrors.newPassword }"
              @input="passwordErrors.newPassword = ''"
            />

            <div
              v-if="passwordErrors.newPassword"
              class="invalid-feedback"
            >
              {{ passwordErrors.newPassword }}
            </div>
          </div>

          <!-- Confirm Password -->
          <div class="mb-4">
            <label class="form-label text-dark">
              បញ្ជាក់ពាក្យសម្ងាត់
            </label>

            <input
              v-model="confirmPassword"
              type="password"
              placeholder="បញ្ជាក់ពាក្យសម្ងាត់ម្តងទៀត"
              class="form-control"
              :class="{ 'is-invalid': passwordErrors.confirmPassword }"
              @input="passwordErrors.confirmPassword = ''"
            />

            <div
              v-if="passwordErrors.confirmPassword"
              class="invalid-feedback"
            >
              {{ passwordErrors.confirmPassword }}
            </div>
          </div>

          <!-- Submit Button -->
          <button
            type="submit"
            :disabled="loading || !hasToken"
            class="btn btn-success w-100 py-2"
          >
            {{
              loading
                ? "កំពុងផ្លាស់ប្តូរពាក្យសម្ងាត់..."
                : "ប្តូរពាក្យសម្ងាត់"
            }}
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
import { useToastStore } from "@/stores/toast";

const router = useRouter();
const route = useRoute();
const authStore = useAuthStore();
const toastStore = useToastStore();

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
    toastStore.error(
      "សូមចុចតំណនៅក្នុងអ៊ីមែលដែលបានផ្ញើទៅអ្នក ដើម្បីបន្តកំណត់ពាក្យសម្ងាត់ថ្មី។"
    );
    return;
  }

  if (hasError) return;

  loading.value = true;

  try {
    await authStore.resetPassword({
      token: token.value,
      password: newPassword.value,
    });
    toastStore.success("ពាក្យសម្ងាត់ត្រូវបានផ្លាស់ប្តូរដោយជោគជ័យ។");
    router.push("/login");
  } catch (error) {
    const message =
      error?.response?.data?.message ||
      "មានកំហុសពេលផ្លាស់ប្តូរពាក្យសម្ងាត់។ សូមព្យាយាមម្ដងទៀត។";
    toastStore.error(message);
  } finally {
    loading.value = false;
  }
};
</script>

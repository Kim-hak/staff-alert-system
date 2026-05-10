<template>
  <div class="min-vh-100 bg-light d-flex align-items-center justify-content-center p-4">
    <div class="w-100" style="max-width: 450px">

      <div class="bg-white rounded shadow-lg p-4 border">

        <!-- Back Button -->
        <button
          @click="router.push('/')"
          class="btn btn-link text-success text-decoration-none d-flex align-items-center gap-2 p-0 mb-4"
        >
          ត្រឡប់ក្រោយ
        </button>

        <!-- Step 1 -->
        <div v-if="step === 'email'">

          <div class="d-flex flex-column align-items-center mb-5 text-center">

            <div
              class="rounded-circle bg-success d-flex align-items-center justify-content-center mb-3 text-white fw-bold"
              style="width: 64px; height: 64px"
            >
              @
            </div>

            <h1 class="h3 text-dark mb-2">
              ភ្លេចពាក្យសម្ងាត់
            </h1>

            <p class="text-secondary mb-0">
              បញ្ចូលអុីម៉ែលរបស់អ្នក ដើម្បីកំណត់ពាក្យសម្ងាត់ថ្មី
            </p>
          </div>

          <form @submit.prevent="handleSubmitEmail">

            <div class="mb-4">
              <label class="form-label text-dark">
                អុីម៉ែល
              </label>

              <input
                v-model="email"
                type="email"
                placeholder="បញ្ចូលអុីម៉ែល"
                class="form-control py-2"
                required
              />
            </div>

            <button
              type="submit"
              :disabled="loading"
              class="btn btn-success w-100 py-3 shadow"
            >
              {{ loading ? "កំពុងដំណើរការ..." : "បន្ត" }}
            </button>

          </form>
        </div>

        <!-- Step 2 -->
        <div v-else-if="step === 'linkSent'">

          <div class="d-flex flex-column align-items-center mb-5 text-center">

            <div
              class="rounded-circle d-flex align-items-center justify-content-center mb-3 bg-success bg-opacity-10 text-success fw-bold"
              style="width: 64px; height: 64px"
            >
              ✓
            </div>

            <h1 class="h3 text-dark mb-2">
              តំណភ្ជាប់ត្រូវបានផ្ញើ
            </h1>

            <p class="text-secondary mb-0">
              តំណភ្ជាប់សម្រាប់កំណត់ពាក្យសម្ងាត់ថ្មី
              ត្រូវបានផ្ញើទៅកាន់អុីម៉ែល
              <span class="fw-semibold text-dark">
                {{ email }}
              </span>
              រួចរាល់ហើយ។
            </p>
          </div>

          <div class="d-grid gap-3">

            <a
              href="https://mail.google.com/"
              target="_blank"
              class="btn btn-success py-3 shadow d-flex align-items-center justify-content-center gap-2"
            >
              បើក Gmail
            </a>

            <button
              @click="goToResetPassword"
              class="btn btn-outline-success py-3 shadow-sm"
            >
              បន្តទៅកំណត់ពាក្យសម្ងាត់ថ្មី
            </button>

            <button
              @click="step = 'email'"
              class="btn btn-link text-secondary text-decoration-none"
            >
              ផ្ញើតំណភ្ជាប់ម្តងទៀត
            </button>

          </div>
        </div>

      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
import { useAuthStore } from "@/stores/useAuth";
import { useToastStore } from "@/stores/toast";

const router = useRouter();
const authStore = useAuthStore();
const toastStore = useToastStore();
const step = ref("email");
const email = ref("");
const loading = ref(false);

const handleSubmitEmail = async () => {
  if (!email.value) {
    toastStore.error("សូមបញ្ចូលអុីម៉ែលរបស់អ្នក។");
    return;
  }

  loading.value = true;

  try {
    await authStore.forgotPassword(email.value);
    step.value = "linkSent";
    toastStore.success(
      "សំណើកំណត់ពាក្យសម្ងាត់បានផ្ញើទៅអ៊ីមែលរបស់អ្នក។ សូមពិនិត្យសារអ៊ីមែលនិងចុចតំណភ្ជាប់ដែលបានផ្តល់។"
    );
  } catch (error) {
    const message =
      error?.response?.data?.message ||
      "មានកំហុសពេលផ្ញើសំណើប្តូរពាក្យសម្ងាត់។ សូមព្យាយាមម្ដងទៀត។";
    toastStore.error(message);
  } finally {
    loading.value = false;
  }
};

const goToResetPassword = () => {
  router.push({
    name: "ResetPassword",
    query: { email: email.value },
  });
};
</script>

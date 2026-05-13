<template>
  <div class="min-vh-100 bg-light d-flex align-items-center justify-content-center p-4">
    <div class="w-100" style="max-width: 450px">
      <div class="bg-white rounded-4 shadow-lg p-4 border">
        
        <button
          @click="router.replace('/')"
          class="btn btn-link text-decoration-none d-flex align-items-center gap-2 p-0 mb-4 fw-semibold"
          style="color: #5A9688;"
        >
          &larr; ត្រឡប់ក្រោយ
        </button>

        <div v-if="step === 'email'">
          <div class="d-flex flex-column align-items-center mb-5 text-center">
            <div
              class="rounded-circle d-flex align-items-center justify-content-center mb-3 text-white fw-bold shadow-sm"
              style="width: 70px; height: 70px; background-color: #5A9688;"
            >
              <span class="fs-2">@</span>
            </div>
            <h1 class="h3 text-dark mb-2 fw-bold">ភ្លេចពាក្យសម្ងាត់</h1>
            <p class="text-secondary mb-0">បញ្ចូលអុីម៉ែលរបស់អ្នក ដើម្បីកំណត់ពាក្យសម្ងាត់ថ្មី</p>
          </div>

          <form @submit.prevent="handleSubmitEmail">
            <div class="mb-4">
              <label class="form-label text-dark fw-medium">អុីម៉ែល</label>
              <input v-model="email" type="email" placeholder="បញ្ចូលអុីម៉ែល" class="form-control py-3" required />
            </div>
            <button
              type="submit"
              :disabled="loading"
              class="btn w-100 py-3 shadow-sm text-white fw-bold"
              style="background-color: #5A9688; border: none;"
            >
              {{ loading ? "កំពុងដំណើរការ..." : "បន្ត" }}
            </button>
          </form>
        </div>

        <div v-else-if="step === 'linkSent'">
          <div class="d-flex flex-column align-items-center mb-5 text-center">
            <div class="rounded-circle d-flex align-items-center justify-content-center mb-3 fw-bold"
                 style="width: 70px; height: 70px; background-color: rgba(90, 150, 136, 0.1); color: #5A9688;">
              <span class="fs-2">✓</span>
            </div>
            <h1 class="h3 text-dark mb-2 fw-bold">តំណភ្ជាប់ត្រូវបានផ្ញើ</h1>
            <p class="text-secondary mb-0">ផ្ញើទៅកាន់ <span class="fw-bold" style="color: #5A9688;">{{ email }}</span> រួចរាល់។</p>
          </div>
          <div class="d-grid gap-3">
             <a href="https://mail.google.com/" target="_blank" class="btn py-3 text-white fw-bold" style="background-color: #5A9688;">បើក Gmail</a>
             <button @click="step = 'email'" class="btn btn-link text-secondary text-decoration-none small">ផ្ញើម្តងទៀត</button>
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
import { useToast } from "vue-toastification"; // Use this instead of custom ToastStore

const router = useRouter();
const authStore = useAuthStore();
const toast = useToast();

const step = ref("email");
const email = ref("");
const loading = ref(false);

const handleSubmitEmail = async () => {
  loading.value = true;
  try {
    await authStore.forgotPassword(email.value);
    step.value = "linkSent";
    toast.success("សំណើត្រូវបានផ្ញើ!", { toastClassName: "custom-toast-success" });
  } catch (error) {
    toast.error("មានកំហុសពេលផ្ញើសំណើ។");
  } finally {
    loading.value = false;
  }
};
</script>

<script setup>
import { useRouter } from 'vue-router'; // 1. Import the helper
import { useAuthStore } from '@/stores/useAuth';
import { watch } from 'vue';

const router = useRouter(); // 2. Initialize the router instance
const authStore = useAuthStore();

// Your logic that was causing the error
watch(() => authStore.token, (newToken) => {
  if (!newToken) {
    router.replace({ name: 'Login' }); // Now 'router' is defined!
  }
});
</script>
<template>
  <RouterView />
</template>

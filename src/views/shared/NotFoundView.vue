<template>
  <main class="container py-5">
    <h1 class="h3">Page not found</h1>
    <p class="text-muted">The page you opened does not exist.</p>
    <RouterLink :to="{ name: 'staffDashboard' }" class="btn btn-primary">
      Go to dashboard
    </RouterLink>
  </main>
</template>

<script setup>
import { RouterLink } from 'vue-router'
</script>

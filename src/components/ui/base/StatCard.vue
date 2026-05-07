<template>
  <div class="card border-0 shadow-sm h-100" style="border-radius: 15px;">
    <div class="card-body d-flex justify-content-between align-items-center p-4">
      <div>
        <h6 class="text-muted mb-1 fw-medium">{{ title }}</h6>
        <h3 class="fw-bold mb-0" :style="{ color: valueColor || '#333' }">{{ value }}</h3>
      </div>
      
      <div :class="['rounded-3 p-3 d-flex align-items-center justify-content-center', bgColor]" style="width: 55px; height: 55px;">
        <i :class="[icon, iconColor, 'fs-4']"></i>
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  title: String,
  value: [String, Number],
  valueColor: String,
  icon: String,     // ឧទាហរណ៍: 'bi bi-currency-dollar'
  iconColor: String, // ឧទាហរណ៍: 'text-success'
  bgColor: String    // ឧទាហរណ៍: 'bg-light-success'
});
</script>

<style scoped>
/* បន្ថែមពណ៌បៃតងខ្ចីសម្រាប់ Background icon */
.bg-light-green { background-color: #e8f5e9 !important; }
.bg-light-orange { background-color: #fff3e0 !important; }
.bg-light-blue { background-color: #e3f2fd !important; }
</style>
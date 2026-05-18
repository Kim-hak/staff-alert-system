<template>
  <div class="p-4 border-bottom d-flex gap-3" :class="{ 'bg-light': !item.isRead }">

    <div class="rounded p-3" :class="item.typeClass">
      <i :class="item.icon"></i>
    </div>

    <div class="flex-grow-1">
      <div class="d-flex justify-content-between">
        <h6 class="fw-bold">{{ item.title }}</h6>
        <small>{{ item.time }}</small>
      </div>

      <p class="text-muted mb-0">{{ item.message }}</p>
    </div>

    <div>
      <button class="btn btn-sm btn-link" @click="$emit('toggle')">
        <i :class="item.isRead ? 'bi bi-envelope' : 'bi bi-envelope-open'"></i>
      </button>

      <button class="btn btn-sm btn-link text-danger" @click="$emit('delete')">
        <i class="bi bi-trash"></i>
      </button>
    </div>

  </div>
</template>

<script setup>
defineProps(['item'])
defineEmits(['toggle', 'delete'])
</script>
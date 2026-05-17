<template>
  <div class="card-body p-0">
    <NotificationCard
      v-for="item in items"
      :key="item.id"
      :item="item"
      @toggle="$emit('toggle', item.id)"
      @delete="$emit('delete', item.id)"
    />
  </div>
</template>

<script setup>
import NotificationCard from './NotificationCard.vue'

defineProps(['items'])
defineEmits(['toggle', 'delete'])
</script>
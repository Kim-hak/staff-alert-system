<template>
  <div class="card-header bg-white">
    <ul class="nav nav-tabs border-0">

      <li class="nav-item">
        <button class="nav-link" :class="{active: currentTab==='all'}" @click="$emit('change-tab','all')">
          All ({{ notifications.length }})
        </button>
      </li>

      <li class="nav-item">
        <button class="nav-link" :class="{active: currentTab==='unread'}" @click="$emit('change-tab','unread')">
          Unread ({{ unreadCount }})
        </button>
      </li>

      <li class="nav-item">
        <button class="nav-link" :class="{active: currentTab==='read'}" @click="$emit('change-tab','read')">
          Read ({{ readCount }})
        </button>
      </li>

    </ul>
  </div>
</template>

<script setup>
defineProps([
  'currentTab',
  'notifications',
  'unreadCount',
  'readCount'
])

defineEmits(['change-tab'])
</script>
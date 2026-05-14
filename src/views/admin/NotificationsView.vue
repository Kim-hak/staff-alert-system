<script setup>
import { ref, onMounted, computed } from 'vue';
import { useNotificationStore } from '@/stores/useNotificationStore';
import { useAuthStore } from '@/stores/useAuth';
import Swal from 'sweetalert2';

const notificationStore = useNotificationStore();
const authStore = useAuthStore();


onMounted(async () => {
  await notificationStore.fetchNotifications();
});

const formatTime = (date) => {
  if (!date) return '—';
  return new Date(date).toLocaleString('km-KH', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: true
  });
};

const handleMarkAllAsRead = async () => {
  const success = await notificationStore.markAllAsRead();
  if (success) {
    Swal.fire({
      icon: 'success',
      title: 'ជោគជ័យ',
      text: 'រាល់ការជូនដំណឹងទាំងអស់ត្រូវបានកត់សម្គាល់ថាអានរួច',
      timer: 1500,
      showConfirmButton: false
    });
  }
};

const handleDelete = async (id) => {
  const result = await Swal.fire({
    title: 'តើអ្នកប្រាកដទេ?',
    text: "ការជូនដំណឹងនេះនឹងត្រូវលុបចេញជារៀងរហូត!",
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#2D6A4F',
    cancelButtonColor: '#d33',
    confirmButtonText: 'បាទ លុបវា!',
    cancelButtonText: 'បោះបង់'
  });

  if (result.isConfirmed) {
    await notificationStore.deleteNotification(id);
  }
};
</script>

<template>
  <div class="notif-page p-4">
    <!-- Header Section -->
    <div class="d-flex justify-content-between align-items-start mb-4">
      <div>
        <h2 class="fw-bold text-dark">ការជូនដំណឹង (Notifications)</h2>
        <p class="text-muted">អ្នកមាន <strong class="text-success">{{ notificationStore.unreadCount }}</strong> ការជូនដំណឹងដែលមិនទាន់អាន</p>
      </div>
      <button 
        v-if="notificationStore.unreadCount > 0"
        @click="handleMarkAllAsRead" 
        class="btn btn-mark-read shadow-sm d-flex align-items-center gap-2"
      >
        <i class="bi bi-check-all"></i> កត់សម្គាល់ថាបានអានទាំងអស់
      </button>
    </div>

    <!-- Notification List -->
    <div class="card border-0 shadow-sm rounded-4 overflow-hidden">
      <div v-if="notificationStore.isLoading" class="text-center py-5">
        <div class="spinner-border text-success"></div>
        <p class="mt-2 text-muted">កំពុងទាញទិន្នន័យ...</p>
      </div>

      <div v-else class="list-group list-group-flush">
        <!-- បង្ហាញក្នុងករណីគ្មានការជូនដំណឹង -->
        <div v-if="notificationStore.notifications.length === 0" class="text-center py-5">
          <i class="bi bi-bell-slash display-4 text-light"></i>
          <p class="mt-3 text-muted">មិនទាន់មានការជូនដំណឹងនៅឡើយទេ</p>
        </div>

        <!-- Notification Item -->
        <div 
          v-for="notif in notificationStore.notifications" 
          :key="notif.id" 
          :class="['notif-item p-4 d-flex align-items-center gap-3', { 'unread': !notif.isRead }]"
        >
          <!-- Icon តាមប្រភេទការជូនដំណឹង -->
          <div class="notif-icon-box shadow-sm" :class="notif.isRead ? 'bg-light' : 'bg-success-light'">
            <i :class="['bi', notif.isRead ? 'bi-envelope-open text-muted' : 'bi-envelope-fill text-success']"></i>
          </div>

          <!-- ខ្លឹមសារ -->
          <div class="flex-grow-1">
            <h6 class="mb-1 fw-bold" :class="notif.isRead ? 'text-muted' : 'text-dark'">{{ notif.title }}</h6>
            <div class="text-muted small mb-1">{{ notif.message }}</div>
            <div class="notif-time">{{ formatTime(notif.createdAt) }}</div>
          </div>

          <!-- ប៊ូតុងបញ្ជា -->
          <div class="notif-actions d-flex gap-2">
            <button v-if="!notif.isRead" @click="notificationStore.markAsRead(notif.id)" class="btn-icon" title="អាន">
              <i class="bi bi-envelope-check text-success"></i>
            </button>
            <button @click="handleDelete(notif.id)" class="btn-icon" title="លុប">
              <i class="bi bi-trash text-danger"></i>
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.notif-page { background-color: #f8fbfc; min-height: 100vh; }

.btn-mark-read {
  background-color: #90b4a7;
  color: #2d6a4f;
  border: none;
  padding: 8px 20px;
  border-radius: 8px;
  font-weight: 600;
  font-size: 0.9rem;
}
.btn-mark-read:hover { background-color: #7da596; }

/* Notification Item Styling */
.notif-item {
  border-bottom: 1px solid #f0f2f5;
  transition: 0.2s;
  cursor: pointer;
}
.notif-item:hover { background-color: #f8fafb; }
.notif-item.unread { background-color: #ffffff; border-left: 4px solid #2d6a4f; }

.notif-icon-box {
  width: 45px;
  height: 45px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.2rem;
  flex-shrink: 0;
}
.bg-success-light { background-color: #e8f5f2; }

.notif-time { font-size: 0.75rem; color: #a0aec0; }

.btn-icon {
  background: none;
  border: 1px solid #f0f2f5;
  width: 35px;
  height: 35px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: 0.2s;
}
.btn-icon:hover { background-color: #f8fbfc; transform: scale(1.1); }
</style>
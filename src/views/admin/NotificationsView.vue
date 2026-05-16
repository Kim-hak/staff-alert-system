<script setup>
import { computed, onMounted, ref, watch } from 'vue';
import BasePagination from '@/components/ui/base/BasePagination.vue';
import { useNotificationStore } from '@/stores/useNotificationStore';
import Swal from 'sweetalert2';

const notificationStore = useNotificationStore();

const currentPage = ref(1);
const itemsPerPage = 8;

onMounted(async () => {
  await notificationStore.fetchNotifications();
});

const sortedNotifications = computed(() => {
  const notifications = Array.isArray(notificationStore.notifications)
    ? notificationStore.notifications
    : [];

  return [...notifications].sort((a, b) => {
    const aTime = a.createdAt ? new Date(a.createdAt).getTime() : 0;
    const bTime = b.createdAt ? new Date(b.createdAt).getTime() : 0;
    return bTime - aTime;
  });
});

const totalPages = computed(() => (
  Math.ceil(sortedNotifications.value.length / itemsPerPage) || 1
));

const paginatedNotifications = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage;
  return sortedNotifications.value.slice(start, start + itemsPerPage);
});

const pageStart = computed(() => {
  if (sortedNotifications.value.length === 0) return 0;
  return (currentPage.value - 1) * itemsPerPage + 1;
});

const pageEnd = computed(() => (
  Math.min(currentPage.value * itemsPerPage, sortedNotifications.value.length)
));

watch(
  () => sortedNotifications.value.length,
  () => {
    if (currentPage.value > totalPages.value) {
      currentPage.value = totalPages.value;
    }
  },
);

const formatTime = (date) => {
  if (!date) return '-';

  const parsedDate = new Date(date);
  if (Number.isNaN(parsedDate.getTime())) return '-';

  return parsedDate.toLocaleString('en-US', {
    year: 'numeric',
    month: 'numeric',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
    second: '2-digit',
    hour12: true,
  });
};

const getNotificationTitle = (notification) => (
  notification.title || notification.message || 'Notification'
);

const getNotificationMessage = (notification) => {
  if (!notification.title || notification.title === notification.message) return '';
  return notification.message || '';
};

const handlePageChange = (page) => {
  currentPage.value = page;
  window.scrollTo({ top: 0, behavior: 'smooth' });
};

const handleMarkAsRead = async (notification) => {
  if (notification.isRead) return;
  await notificationStore.markAsRead(notification.id);
};

const handleMarkAllAsRead = async () => {
  const success = await notificationStore.markAllAsRead();
  if (success) {
    Swal.fire({
      icon: 'success',
      title: 'Notifications updated',
      text: 'All notifications have been marked as read.',
      timer: 1500,
      showConfirmButton: false,
    });
  }
};

const handleDelete = async (id) => {
  const result = await Swal.fire({
    title: 'Delete notification?',
    text: 'This notification will be removed permanently.',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#dc3545',
    cancelButtonColor: '#4D7C6E',
    confirmButtonText: 'Delete',
    cancelButtonText: 'Cancel',
    reverseButtons: true,
  });

  if (result.isConfirmed) {
    await notificationStore.deleteNotification(id);
  }
};
</script>

<template>
  <div class="notifications-page">
    <div class="notifications-header">
      <div>
        <h2 class="page-title">Notifications</h2>
        <p class="page-subtitle mb-0">
          You have
          <span class="fw-semibold text-success">{{ notificationStore.unreadCount }}</span>
          unread notification<span v-if="notificationStore.unreadCount !== 1">s</span>
        </p>
      </div>

      <button
        v-if="notificationStore.unreadCount > 0"
        type="button"
        class="btn mark-read-btn"
        @click="handleMarkAllAsRead"
      >
        <i class="bi bi-check2-all"></i>
        <span>Mark all as read</span>
      </button>
    </div>

    <section class="notification-panel">
      <div v-if="notificationStore.isLoading" class="empty-state">
        <div class="spinner-border text-success" role="status"></div>
        <p class="mt-3 mb-0 text-muted">Loading notifications...</p>
      </div>

      <div v-else-if="sortedNotifications.length === 0" class="empty-state">
        <div class="empty-icon">
          <i class="bi bi-bell-slash"></i>
        </div>
        <h3>No notifications yet</h3>
        <p class="mb-0">New updates will appear here.</p>
      </div>

      <template v-else>
        <div
          v-for="notification in paginatedNotifications"
          :key="notification.id"
          class="notification-row"
          :class="{ unread: !notification.isRead }"
        >
          <div class="notification-status">
            <i
              class="bi"
              :class="notification.isRead ? 'bi-envelope-open' : 'bi-envelope-fill'"
            ></i>
          </div>

          <div class="notification-content">
            <h3>{{ getNotificationTitle(notification) }}</h3>
            <p v-if="getNotificationMessage(notification)" class="notification-message">
              {{ getNotificationMessage(notification) }}
            </p>
            <time :datetime="notification.createdAt">
              {{ formatTime(notification.createdAt) }}
            </time>
          </div>

          <div class="notification-actions">
            <button
              type="button"
              class="icon-action"
              :class="{ disabled: notification.isRead }"
              :disabled="notification.isRead"
              :title="notification.isRead ? 'Already read' : 'Mark as read'"
              @click="handleMarkAsRead(notification)"
            >
              <i
                class="bi"
                :class="notification.isRead ? 'bi-envelope-open' : 'bi-envelope-check'"
              ></i>
            </button>
            <button
              type="button"
              class="icon-action delete"
              title="Delete"
              @click="handleDelete(notification.id)"
            >
              <i class="bi bi-trash"></i>
            </button>
          </div>
        </div>
      </template>
    </section>

    <div
      v-if="!notificationStore.isLoading && sortedNotifications.length > itemsPerPage"
      class="pagination-footer"
    >
      <span class="pagination-summary">
        Showing {{ pageStart }}-{{ pageEnd }} of {{ sortedNotifications.length }}
      </span>
      <BasePagination
        :current-page="currentPage"
        :total-pages="totalPages"
        @change-page="handlePageChange"
      />
    </div>
  </div>
</template>

<style scoped>
.notifications-page {
  min-height: calc(100vh - 112px);
  background: #f8fbfc;
}

.notifications-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 1rem;
  margin-bottom: 1.5rem;
}

.page-title {
  margin: 0 0 0.35rem;
  color: #1f2937;
  font-size: 1.65rem;
  font-weight: 800;
}

.page-subtitle {
  color: #718096;
  font-size: 0.95rem;
}

.mark-read-btn {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  min-height: 42px;
  padding: 0.55rem 1.1rem;
  border: 0;
  border-radius: 8px;
  background: #8fb49f;
  color: #ffffff;
  font-weight: 700;
  white-space: nowrap;
}

.mark-read-btn:hover,
.mark-read-btn:focus {
  background: #7aa58e;
  color: #ffffff;
}

.notification-panel {
  overflow: hidden;
  border: 1px solid #e6edf1;
  border-radius: 8px;
  background: #ffffff;
  box-shadow: 0 8px 24px rgba(15, 23, 42, 0.04);
}

.notification-row {
  display: grid;
  grid-template-columns: 32px minmax(0, 1fr) auto;
  align-items: center;
  gap: 0.9rem;
  min-height: 72px;
  padding: 0.9rem 1.1rem;
  border-bottom: 1px solid #edf2f5;
  background: #ffffff;
  transition: background-color 0.16s ease;
}

.notification-row:last-child {
  border-bottom: 0;
}

.notification-row:hover {
  background: #f8faf9;
}

.notification-row.unread {
  background: #f6fbf8;
}

.notification-status {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 28px;
  height: 28px;
  color: #8bb09d;
  font-size: 1.05rem;
}

.notification-row:not(.unread) .notification-status {
  color: #7188a6;
}

.notification-content {
  min-width: 0;
}

.notification-content h3 {
  margin: 0;
  color: #374151;
  font-size: 0.95rem;
  font-weight: 800;
  line-height: 1.35;
}

.notification-row:not(.unread) .notification-content h3 {
  font-weight: 650;
}

.notification-message {
  margin: 0.15rem 0 0;
  color: #6b7280;
  font-size: 0.86rem;
  line-height: 1.4;
}

.notification-content time {
  display: block;
  margin-top: 0.15rem;
  color: #718096;
  font-size: 0.82rem;
  font-weight: 600;
}

.notification-actions {
  display: flex;
  align-items: center;
  gap: 0.45rem;
}

.icon-action {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 34px;
  height: 34px;
  border: 0;
  border-radius: 8px;
  background: transparent;
  color: #759c89;
  transition: background-color 0.16s ease, color 0.16s ease;
}

.icon-action:hover,
.icon-action:focus {
  background: #eef7f2;
  color: #4d7c6e;
}

.icon-action.disabled {
  color: #7188a6;
  cursor: default;
  opacity: 1;
}

.icon-action.disabled:hover,
.icon-action.disabled:focus {
  background: transparent;
  color: #7188a6;
}

.icon-action.delete {
  color: #ff4d5a;
}

.icon-action.delete:hover,
.icon-action.delete:focus {
  background: #fff1f2;
  color: #dc3545;
}

.empty-state {
  display: flex;
  min-height: 260px;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 2.5rem 1rem;
  color: #7a8795;
  text-align: center;
}

.empty-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 58px;
  height: 58px;
  margin-bottom: 1rem;
  border-radius: 50%;
  background: #eef4f1;
  color: #6f9d88;
  font-size: 1.6rem;
}

.empty-state h3 {
  margin: 0 0 0.35rem;
  color: #344054;
  font-size: 1.05rem;
  font-weight: 800;
}

.pagination-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  margin-top: 1.1rem;
}

.pagination-summary {
  color: #718096;
  font-size: 0.9rem;
  font-weight: 600;
}

@media (max-width: 640px) {
  .notifications-header,
  .pagination-footer {
    align-items: stretch;
    flex-direction: column;
  }

  .mark-read-btn {
    justify-content: center;
    width: 100%;
  }

  .notification-row {
    grid-template-columns: 28px minmax(0, 1fr);
    align-items: flex-start;
    gap: 0.75rem;
  }

  .notification-actions {
    grid-column: 2;
    justify-content: flex-start;
  }
}
</style>

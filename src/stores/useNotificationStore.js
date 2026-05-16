import { defineStore } from 'pinia';
import api from '@/api/api';

export const useNotificationStore = defineStore('notification', {
  state: () => ({
    notifications: [],
    isLoading: false,
    unreadCount: 0
  }),

  actions: {
    async fetchNotifications() {
      this.isLoading = true;

      try {
        const response = await api.get('/notifications');
        this.notifications = response.data?.data?.items || [];
        this.unreadCount = this.notifications.filter(n => !n.isRead).length;
      } catch (error) {
        console.error("Fetch Notifications Error:", error);
      } finally {
        this.isLoading = false;
      }
    },

    // មុខងារលុបដែលប្រើបានទាំងពីរ Role
    async deleteNotification(id) {
      try {
        await api.delete(`/notifications/${id}`);
        this.notifications = this.notifications.filter(n => n.id !== id);
        this.unreadCount = this.notifications.filter(n => !n.isRead).length;
      } catch (error) {
        console.error("Delete Error:", error);
      }
    },

    async markAsRead(id) {
      try {
        await api.put(`/notifications/${id}/read`);
        const notification = this.notifications.find(n => n.id === id);
        if (notification) notification.isRead = true;
        this.unreadCount = this.notifications.filter(n => !n.isRead).length;
        return true;
      } catch (error) {
        console.error("Mark Read Error:", error);
        return false;
      }
    },

    async markAllAsRead() {
      try {
        await api.put('/notifications/read-all');
        this.notifications = this.notifications.map(n => ({ ...n, isRead: true }));
        this.unreadCount = 0;
        return true;
      } catch (error) {
        console.error("Mark All Read Error:", error);
        return false;
      }
    },
  }
});

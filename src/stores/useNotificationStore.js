import { defineStore } from 'pinia';
import axios from 'axios';
import { useAuthStore } from './useAuth'; // ទាញយកតួនាទីអ្នកប្រើពី store ផ្ទៀងផ្ទាត់

export const useNotificationStore = defineStore('notification', {
  state: () => ({
    notifications: [],
    isLoading: false,
    unreadCount: 0
  }),

  actions: {
    async fetchNotifications() {
      this.isLoading = true;
      const authStore = useAuthStore();
      const role = authStore.profile?.role?.name?.toUpperCase(); // ឆែកមើលថាជា ADMIN ឬ MANAGER

      try {
        // ប្តូរ Endpoint ទៅតាមតួនាទីរបស់អ្នកប្រើ
        let endpoint = '/notifications';
        if (role === 'ADMIN') {
          endpoint = '/admin/notifications';
        } else if (role === 'MANAGER') {
          endpoint = '/manager/notifications';
        }

        const response = await axios.get(endpoint);
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
        await axios.delete(`/notifications/${id}`);
        this.notifications = this.notifications.filter(n => n.id !== id);
      } catch (error) {
        console.error("Delete Error:", error);
      }
    }
  }
});
import { defineStore } from 'pinia'
import api from '@/api/api'

export const useNotificationStore = defineStore('notification', {
  state: () => ({
    notifications: [],
    isLoading: false,
    unreadCount: 0
  }),

  actions: {
    async fetchNotifications() {
      this.isLoading = true

      try {
        const response = await api.get('/notifications')
        const serverNotifications = response.data?.data?.items || []

        // merge local + server without duplicate
        const localOnly = this.notifications.filter(
          local => !serverNotifications.some(server => server.id === local.id)
        )

        this.notifications = [...localOnly, ...serverNotifications]

        this.unreadCount = this.notifications.filter(n => !n.isRead).length
      } catch (error) {
        console.error('Fetch Notifications Error:', error)
      } finally {
        this.isLoading = false
      }
    },

    addLocalNotification(notification) {
      this.notifications.unshift(notification)
      this.unreadCount++
    },

    async deleteNotification(id) {
      if (String(id).length >= 13) {
        this.notifications = this.notifications.filter(n => n.id !== id)
        this.unreadCount = this.notifications.filter(n => !n.isRead).length
        return
      }

      try {
        await api.delete(`/notifications/${id}`)
        this.notifications = this.notifications.filter(n => n.id !== id)
        this.unreadCount = this.notifications.filter(n => !n.isRead).length
      } catch (error) {
        console.error("Delete Error:", error)
      }
    },

    async markAsRead(id) {
      const notification = this.notifications.find(n => n.id === id)

      // local notification (Date.now id)
      if (String(id).length >= 13) {
        if (notification) notification.isRead = true
        this.unreadCount = this.notifications.filter(n => !n.isRead).length
        return true
      }

      try {
        await api.put(`/notifications/${id}/read`)
        if (notification) notification.isRead = true
        this.unreadCount = this.notifications.filter(n => !n.isRead).length
        return true
      } catch (error) {
        console.error("Mark Read Error:", error)
        return false
      }
    },

    async markAllAsRead() {
      try {
        await api.put('/notifications/read-all')
      } catch (error) {
        console.error('Mark All Read Error:', error)
      }

      this.notifications = this.notifications.map(n => ({
        ...n,
        isRead: true
      }))

      this.unreadCount = 0
    }
  }
})
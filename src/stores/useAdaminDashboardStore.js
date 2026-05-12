import { defineStore } from 'pinia'
import api from '@/api/api'
import { useAuthStore } from '@/stores/useAuth'

export const useAdminDashboardStore = defineStore('adminDashboard', {
  state: () => ({
    stats: {
      totalUsers: 0,
      totalManagers: 0,
      totalStaff: 0,
      totalGroups: 0,
      submittedReports: 0,
      reviewedReports: 0
    },
    recentUsers: [],
    recentReports: [],
    quickStats: {
      activeUsers: 0,
      reportCompletion: 0,
      groupCoverage: 0
    },
    isLoading: false
  }),
  actions: {
    async fetchDashboardData() {
      this.isLoading = true
      const authStore = useAuthStore()
      const roleId = authStore.profile?.role?.id

      try {
        if (roleId === 1) {
          // Fetch all stats in parallel
          const [
            allUsersRes,
            managersRes,
            staffRes,
            groupsRes,
            submittedRes,
            reviewedRes,
            recentUsersRes,
            recentReportsRes
          ] = await Promise.all([
            api.get('/users?_page=1&_per_page=1').catch(() => null),
            api.get('/users?_page=1&_per_page=1&roleId=2').catch(() => null),
            api.get('/users?_page=1&_per_page=1&roleId=3').catch(() => null),
            api.get('/groups?_page=1&_per_page=1').catch(() => null),
            api.get('/performance-reports?_page=1&_per_page=1&status=SUBMITTED').catch(() => null),
            api.get('/performance-reports?_page=1&_per_page=1&status=REVIEWED').catch(() => null),
            api.get('/users?_page=1&_per_page=5&sortBy=createdAt&sortDir=DESC').catch(() => null),
            api.get('/performance-reports?_page=1&_per_page=5&sortBy=createdAt&sortDir=DESC').catch(() => null)
          ])

          const totalUsers   = allUsersRes?.data?.data?.meta?.totalItems || 0
          const totalManagers = managersRes?.data?.data?.meta?.totalItems || 0
          const totalStaff   = staffRes?.data?.data?.meta?.totalItems || 0
          const totalGroups  = groupsRes?.data?.data?.meta?.totalItems || 0
          const submitted    = submittedRes?.data?.data?.meta?.totalItems || 0
          const reviewed     = reviewedRes?.data?.data?.meta?.totalItems || 0

          this.stats = { totalUsers, totalManagers, totalStaff, totalGroups, submittedReports: submitted, reviewedReports: reviewed }

          this.recentUsers   = recentUsersRes?.data?.data?.items || []
          this.recentReports = recentReportsRes?.data?.data?.items || []

          // Compute quick stats percentages
          const activeRes = await api.get('/users?_page=1&_per_page=1&status=ACTIVATED').catch(() => null)
          const activeCount = activeRes?.data?.data?.meta?.totalItems || 0
          const totalReport = submitted + reviewed + (await api.get('/performance-reports?_page=1&_per_page=1').catch(() => null))?.data?.data?.meta?.totalItems || 0

          this.quickStats = {
            activeUsers: totalUsers > 0 ? Math.round((activeCount / totalUsers) * 100) : 0,
            reportCompletion: (submitted + reviewed) > 0 ? Math.round((reviewed / (submitted + reviewed + 1)) * 100) : 0,
            groupCoverage: totalGroups > 0 && totalUsers > 0 ? Math.min(Math.round((totalGroups * 5 / totalUsers) * 100), 100) : 0
          }
        }
      } catch (error) {
        console.error('Dashboard fetch error:', error)
      } finally {
        this.isLoading = false
      }
    }
  }
})

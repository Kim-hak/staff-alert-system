import { defineStore } from 'pinia'
import api from '@/api/api'

export const useReportStore = defineStore('reports', {
  state: () => ({
    reports: [],
    meta: {},
    isLoading: false,
    error: null
  }),
  getters: {
    totalPages: (state) => Math.ceil((state.meta?.totalItems || 0) / 10)
  },
  actions: {
    async fetchReports(params = {}) {
      this.isLoading = true
      this.error = null
      try {
        const res = await api.get('/performance-reports', { params })
        this.reports = res.data?.data?.items || []
        this.meta = res.data?.data?.meta || {}
      } catch (error) {
        this.error = error.response?.data?.message || 'Failed to load reports'
      } finally {
        this.isLoading = false
      }
    },

    async reviewReport(id, payload) {
      try {
        const res = await api.put(`/performance-reports/${id}/review`, payload)
        return res.data
      } catch (error) {
        throw error.response?.data || error
      }
    },

    async deleteReport(id) {
      try {
        await api.delete(`/performance-reports/${id}`)
      } catch (error) {
        throw error.response?.data || error
      }
    }
  }
})

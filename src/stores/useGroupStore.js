import { defineStore } from 'pinia'
import api from '@/api/api'

const normalizeGroups = (payload) => {
  if (Array.isArray(payload?.data?.items)) {
    return payload.data.items
  }

  if (Array.isArray(payload?.data)) {
    return payload.data
  }

  if (Array.isArray(payload?.items)) {
    return payload.items
  }

  return []
}

export const useGroupStore = defineStore('group', {
  state: () => ({
    groups: [],
    loading: false,
    error: null
  }),

  actions: {
    async fetchGroups(params = {}) {
      this.loading = true
      this.error = null

      try {
        const response = await api.get('/groups', {
          params: {
            _page: 1,
            _per_page: 10,
            ...params
          }
        })

        this.groups = normalizeGroups(response.data)
      } catch (error) {
        this.groups = []
        this.error = error.response?.data?.message || 'Failed to load groups'
        console.error('Fetch groups error:', error)
      } finally {
        this.loading = false
      }
    },

    async deleteGroup(id) {
      this.error = null

      try {
        await api.delete(`/groups/${id}`)
        this.groups = this.groups.filter((group) => group.id !== id)
        return true
      } catch (error) {
        this.error = error.response?.data?.message || 'Failed to delete group'
        console.error('Delete group error:', error)
        return false
      }
    }
  }
})

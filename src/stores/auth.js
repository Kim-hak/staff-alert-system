import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useAuthStore = defineStore('auth', () => {
  const token = ref(localStorage.getItem('auth-token') || null)
  const user = ref(JSON.parse(localStorage.getItem('auth-user')) || null)
  const isAuthenticated = computed(() => !!token.value)

  function login(newToken, newUser) {
    token.value = newToken
    user.value = newUser
    localStorage.setItem('auth-token', newToken)
    localStorage.setItem('auth-user', JSON.stringify(newUser))
  }

  function logout() {
    token.value = null
    user.value = null
    localStorage.removeItem('auth-token')
    localStorage.removeItem('auth-user')
  }

  function updateUser(userData) {
    if (user.value) {
      user.value = { ...user.value, ...userData }
      localStorage.setItem('auth-user', JSON.stringify(user.value))
    }
  }

  return {
    token,
    user,
    isAuthenticated,
    login,
    logout,
    updateUser
  }
})
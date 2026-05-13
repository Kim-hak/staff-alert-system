import { defineStore } from "pinia";
import api from "@/api/api";
import { computed, ref } from "vue";
import { useRouter } from 'vue-router';

export const useAuthStore = defineStore('auth', () => {

  // State Management
  const token = ref(localStorage.getItem('token'));
  const message_error = ref('');



  const profile = ref(null);
  const router = useRouter();

  const isLogined = computed(() => {
    return !!token.value;
  });

  // Actions 
  const login = async (data) => {
    try {
      message_error.value = '';
      const res = await api.post('auth/login', data);
      token.value = res.data.data.token;
      localStorage.setItem('token', token.value);
      
      await fetchProfile(); 
    } catch (error) {    
      message_error.value = error.response?.data?.message || 'Login failed';
      throw error; 
    }
  }

  const fetchProfile = async () => {
    try {
      const res = await api.get('auth/profile');
      profile.value = res.data.data;
    } catch (error) {
      // If profile fetch fails (like a 401), we should clear everything
      if (error.response?.status === 401) {
        logoutLocal();
      }
      throw error;
    }
  }

  // Local logout logic (clearing state without necessarily calling the API)
  const logoutLocal = () => {
    localStorage.removeItem('token');
    token.value = null;
    profile.value = null;
  };

  const logout = async () => {
    try {
      await api.delete('auth/logout');
    } catch (error) {
      console.error("Logout error:", error.response);
    } finally {
      logoutLocal();
    }
  }

  const forgotPassword = async (email) => {
    try {
      // The API likely expects { email: "..." }
      return await api.post('auth/forget-password', { email });
    } catch (error) {
      throw error.response?.data || error;
    }
  }

  // UPDATED: Accepting token and newPassword separately to match ResetPasswordView
  const resetPassword = async (tokenValue, newPassword) => {
    try {
      const res = await api.post('auth/reset-password', { 
        token: tokenValue, 
        newPassword: newPassword 
      });
      return res.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  }

  const changePassword = async (payload) => {
    try {
      return await api.put('auth/change-password', payload);
    } catch (error) {
      throw error.response?.data || error;
    }
  }
  

  return {
    token,
    isLogined,
    message_error,
    profile,
    login,
    fetchProfile,
    logout,
    forgotPassword,
    resetPassword,
    changePassword,
    logoutLocal
  }
});
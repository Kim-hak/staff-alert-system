import { defineStore } from "pinia";
import api from "@/api/api";
import { computed, ref } from "vue";
export const useAuthStore = defineStore('auth', () =>{

// Stat management 
let token = ref(localStorage.getItem('token'));
let message_error = ref('');
let profile = ref(null);

let isLogined = computed(()=>{
    return token.value;
});


// Action 
const login = async(data) =>{
    try{
        let res = await api.post('auth/login', data);
        token.value = res.data.data.token;
        localStorage.setItem('token', token.value);
    }catch(error){    
        console.error(error.response)
        message_error.value = error.response.data.message
    }
}

const fetchProfile = async () =>{
    let res = await api.get('auth/profile');
    profile.value = res.data.data
}
const logout = async ()=>{
    try{
        await api.delete('auth/logout');
    }catch(error){
        console.error(error.response)
    } finally {
        localStorage.removeItem('token');// clear item token from localstorage
        token.value = null;// reset variable token to null
        profile.value = null;// reset variable profile to null
    }
}

const forgotPassword = async (email) => {
    try {
        return await api.post('auth/forget-password', { email });
    } catch (error) {
        console.error(error.response || error);
        throw error;
    }
}

const resetPassword = async (payload) => {
    try {
        return await api.post('auth/reset-password', payload);
    } catch (error) {
        console.error(error.response || error);
        throw error;
    }
}

const changePassword = async (payload) => {
    try {
        return await api.put('auth/change-password', payload);
    } catch (error) {
        console.error(error.response || error);
        throw error;
    }
}

// Return 
return {token,isLogined,message_error,profile, login, fetchProfile, logout, forgotPassword, resetPassword, changePassword}
})
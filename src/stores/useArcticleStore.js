import api from "@/api/api";
import { defineStore } from "pinia"
import { reactive, ref } from "vue"
export const useArcticleStore = defineStore('arcticle', () => {
    const allArcticles = ref([]);
    const loading = ref(false); 

     let pagination = reactive({
        totalPages:0
    })
    const fectchAllArcticles = async () => {
        loading.value = true;
        try {
            const res = await api.get(`users?_page=1&_per_page=10&search=&status=ACTIVATED&sortBy=createdAt&sortDir=DESC`);
       
            allArcticles.value = res.data.data.items; 
            // pagination.totalPages = res.data.data.totalPages;
        } catch (error) {
            console.error(error);
        } finally {
            loading.value = false;
        }
    }
  
    return {
        allArcticles, 
        loading,
        fectchAllArcticles,
        pagination
    }
})
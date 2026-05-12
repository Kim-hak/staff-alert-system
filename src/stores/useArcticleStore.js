import api from "@/api/api";
import { defineStore } from "pinia"
import { ref } from "vue"
export const useArcticleStore = defineStore('arcticle', () => {
    const allArcticles = ref([]);
    const loading = ref(false); // បន្ថែម loading state

    const fectchAllArcticles = async () => {
        loading.value = true;
        try {
            const res = await api.get(`users?_page=1&_per_page=10&search=&status=ACTIVATED&sortBy=createdAt&sortDir=DESC`);
            // ត្រូវប្រាកដថា path នៃ data ត្រឹមត្រូវ (res.data.data.items)
            allArcticles.value = res.data.data.items; 
        } catch (error) {
            console.error(error);
        } finally {
            loading.value = false;
        }
    }
  
    return {
        allArcticles, // ហាមភ្លេច return state នេះ
        loading,
        fectchAllArcticles
    }
})
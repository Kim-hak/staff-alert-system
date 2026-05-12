import axios from "axios";
import { useAuthStore } from "@/stores/useAuth";

let api = axios.create({
    baseURL: "https://ant-g2-sas.tt.linkpc.net/api/v1",
    headers: {
        "Content-Type": "application/json",
        "Accept": "application/json",
    },
});

api.interceptors.request.use((config) => {

    const authStore = useAuthStore();
    if (authStore.token){
        config.headers.Authorization = `Bearer ${authStore.token}`;
    }

    return config;
    
})


export default api;
import api from "@/api/api";
import { defineStore } from "pinia";
import { reactive, ref, watch } from "vue";

export const useArcticleStore = defineStore("arcticle", () => {
  const allArcticles = ref([]);
  const loading = ref(false);
  const search = ref("");

  const pagination = reactive({
    currentPage: 1,
    perPage: 10,
    totalPages: 1
  });

  const fectchAllArcticles = async (page = 1) => {
    loading.value = true;

    try {
      pagination.currentPage = page;

      const res = await api.get(
        `users?_page=${page}&_per_page=${pagination.perPage}&search=${search.value}&status=ACTIVATED&sortBy=createdAt&sortDir=DESC`
      );

      allArcticles.value = res.data.data.items;

      pagination.totalPages = res.data.data.pages || 1;

    } catch (error) {
      console.error(error);
    } finally {
      loading.value = false;
    }
  };

  watch(search, () => {
    fectchAllArcticles(1);
  });

  return {
    allArcticles,
    loading,
    pagination,
    search,
    fectchAllArcticles
  };
});
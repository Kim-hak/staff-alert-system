import api from "@/api/api";
import { defineStore } from "pinia";
import { reactive, ref, watch } from "vue";

export const useArcticleStore = defineStore("arcticles", () => {
  const allArcticles = ref([]);
//   const article = ref(null);

  const searchResults = ref([]);
  const loading = ref(false);
  const search = ref("");
  const userDetail = ref(null);
  const pagination = reactive({
    currentPage: 1,
    perPage: 100,
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
      searchResults.value = res.data.data.items;
      pagination.totalPages = res.data.data.pages ?? 1;

    } catch (error) {
      console.error(error);
    } finally {
      loading.value = false;
    }
  };

 const createUser = async (payload) => {
  try {
    const requestBody = {
      fullname: payload.fullname,
      email: payload.email,
      password: payload.password,
      roleId: Number(payload.roleId),
      phone: payload.phone,
      gender: payload.gender,
      birthday: payload.birthday,
      hireDate: payload.hireDate,
      salary: Number(payload.salary),
      managerId: payload.managerId ? Number(payload.managerId) : null,

      // username: payload.email,
      // status: "ACTIVE",
      // confirmPassword: payload.password
    };

    console.log("SEND PAYLOAD:", requestBody);

    const res = await api.post("users", requestBody);

    return res.data;

  } catch (error) {
  console.log("STATUS:", error.response?.status);
  console.log("ERROR DATA:", error.response?.data);
  console.log("FULL:", error.response);
  throw error;
}
};
   const fetchUserDetailById = async (id) => {
  loading.value = true;

  try {
    userDetail.value = null;

    const res = await api.get(`users/${id}`);

    userDetail.value = res.data.data;

  } catch (error) {
    console.log("DETAIL ERROR:", error.response?.data || error);
  } finally {
    loading.value = false;
  }
};

  let timer = null;

  watch(search, () => {
    clearTimeout(timer);

    timer = setTimeout(() => {
      fectchAllArcticles(1);
    }, 400);
  });

  return {
    allArcticles,
    searchResults,
    loading,
    search,
    pagination,
    userDetail,
    fectchAllArcticles,
    createUser,
    fetchUserDetailById
  };
});
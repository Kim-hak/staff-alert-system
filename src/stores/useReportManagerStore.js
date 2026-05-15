import { defineStore } from "pinia";
import api from "@/api/api";
import { useAuthStore } from "./useAuth";

export const useReportStore = defineStore("report", {
  state: () => ({
    reports: [],
    isLoading: false,
    error: null,
    meta: {},
  }),

  actions: {
    async fetchMyReports(params = {}) {
      this.isLoading = true;
      this.error = null;
      try {
        const response = await api.get("/performance-reports/my", { params });
        if (response.data && response.data.data) {
          this.reports = response.data.data.items || [];
          this.meta = response.data.data.meta || {};
        }
      } catch (err) {
        this.error = "មិនអាចទាញទិន្នន័យរបាយការណ៍បានទេ";
        console.error("Fetch My Reports Error:", err);
      } finally {
        this.isLoading = false;
      }
    },

    async fetchReports(page = 1) {
      this.isLoading = true;
      this.error = null;

      const authStore = useAuthStore();
      const role = authStore.profile?.role?.name?.toUpperCase();

      try {
        let endpoint = "/performance-reports";
        let params = {
          _page: page,
          _per_page: 10,
          sortBy: "status",
          sortDir: "DESC",
        };

        if (role === "MANAGER") {
          params.managerId = authStore.profile?.id;
        }

        const response = await api.get(endpoint, { params });

        if (response.data && response.data.data) {
          this.reports = response.data.data.items || [];
          this.meta = response.data.data.meta || {};
        }
      } catch (err) {
        this.error = "មិនអាចទាញទិន្នន័យរបាយការណ៍បានទេ";
        console.error("Fetch Error:", err);
      } finally {
        this.isLoading = false;
      }
    },

    async fetchReportById(id) {
      try {
        const response = await api.get(`/performance-reports/${id}`);
        return response.data.data;
      } catch (error) {
        console.error("Fetch Report Detail Error:", error);
        throw error;
      }
    },

    async createReport(payload) {
      this.isLoading = true;
      try {
        const response = await api.post("/performance-reports", payload);
        return response.data;
      } catch (error) {
        console.error("Create Report Error:", error);
        throw error;
      } finally {
        this.isLoading = false;
      }
    },

    async submitReport(id) {
      this.isLoading = true;
      try {
        const response = await api.put(`/performance-reports/${id}/submit`);
        return response.data;
      } catch (error) {
        console.error("Submit Report Error:", error);
        throw error;
      } finally {
        this.isLoading = false;
      }
    },

    async deleteReport(id) {
      try {
        await api.delete(`/performance-reports/${id}`);
        this.reports = this.reports.filter((r) => r.id !== id);
        return true;
      } catch (err) {
        console.error("Delete Error:", err);
        throw err;
      }
    },

    async updateReport(id, payload) {
      this.isLoading = true;
      this.error = null;
      try {
        const res = await api.put(`/performance-reports/${id}`, payload);
        return res.data;
      } catch (error) {
        this.error = error.response?.data?.message || "Failed to update report";
        throw error;
      } finally {
        this.isLoading = false;
      }
    },
  },
});

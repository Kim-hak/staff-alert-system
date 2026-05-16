import { defineStore } from "pinia";
import api from "@/api/api";
import { useAuthStore } from "./useAuth";
import { getRoleKey } from "@/utils/roles";

export const useReportStore = defineStore("report", {
  state: () => ({
    reports: [],
    isLoading: false,
    error: null,
    meta: {},
  }),

  getters: {
    reportStats: (state) => {
      const reports = Array.isArray(state.reports) ? state.reports : [];
      const reviewed = reports.filter((report) => report.status === "REVIEWED").length;

      return {
        total: reports.length,
        reviewed,
        pending: reports.length - reviewed,
      };
    },
  },

  actions: {
    setReportList(response) {
      const data = response?.data?.data;
      this.reports = data?.items || [];
      this.meta = data?.meta || {};
    },

    async fetchMyReports(params = {}) {
      this.isLoading = true;
      this.error = null;
      try {
        const response = await api.get("/performance-reports/my", { params });
        this.setReportList(response);
      } catch (err) {
        this.error = "មិនអាចទាញទិន្នន័យរបាយការណ៍បានទេ";
        console.error("Fetch My Reports Error:", err);
      } finally {
        this.isLoading = false;
      }
    },

    async fetchReports(params = {}) {
      this.isLoading = true;
      this.error = null;

      const authStore = useAuthStore();
      const roleKey = getRoleKey(authStore.profile);
      const query = typeof params === "number" ? { _page: params } : { ...params };

      try {
        let endpoint = "/performance-reports";
        const requestParams = {
          _page: query._page || 1,
          _per_page: query._per_page || 10,
          sortBy: "status",
          sortDir: "DESC",
          ...query,
        };

        if (roleKey === "manager" && !requestParams.managerId) {
          requestParams.managerId = authStore.profile?.id;
        }

        const response = await api.get(endpoint, { params: requestParams });
        this.setReportList(response);
      } catch (err) {
        this.error = "មិនអាចទាញទិន្នន័យរបាយការណ៍បានទេ";
        console.error("Fetch Error:", err);
      } finally {
        this.isLoading = false;
      }
    },

    async fetchAllReports(params = {}) {
      return this.fetchReports(params);
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

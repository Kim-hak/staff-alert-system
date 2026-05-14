import { defineStore } from "pinia";
import api from "@/api/api";

export const useReportStore = defineStore("reports", {
  state: () => ({
    reports: [],
    meta: {},
    isLoading: false,
    error: null,
  }),
  getters: {
    totalPages: (state) => Math.ceil((state.meta?.totalItems || 0) / 10),
  },
  actions: {
    async fetchReports(params = {}) {
      this.isLoading = true;
      this.error = null;
      try {
        const res = await api.get("/performance-reports", { params });
        this.reports = res.data?.data?.items || [];
        this.meta = res.data?.data?.meta || {};
      } catch (error) {
        this.error = error.response?.data?.message || "Failed to load reports";
      } finally {
        this.isLoading = false;
      }
    },

    async fetchMyReports(params = {}) {
      this.isLoading = true;
      this.error = null;
      try {
        console.log("Fetching my reports with params:", params);
        const res = await api.get("/performance-reports/my", { params });
        console.log("My reports API full response:", res);

        // Flexible data path checking
        const items =
          res.data?.data?.items || res.data?.items || res.data?.data || [];
        this.reports = Array.isArray(items) ? items : [];

        this.meta = res.data?.data?.meta || res.data?.meta || {};
      } catch (error) {
        console.error(
          "Fetch my reports error details:",
          error.response || error,
        );
        this.error =
          error.response?.data?.message ||
          error.message ||
          "Failed to load your reports";
      } finally {
        this.isLoading = false;
      }
    },

    async reviewReport(id, payload) {
      try {
        const res = await api.put(`/performance-reports/${id}/review`, payload);
        return res.data;
      } catch (error) {
        throw error.response?.data || error;
      }
    },

    async deleteReport(id) {
      try {
        await api.delete(`/performance-reports/${id}`);
      } catch (error) {
        throw error.response?.data || error;
      }
    },

    async createReport(payload) {
      this.isLoading = true;
      this.error = null;
      try {
        const res = await api.post("/performance-reports", payload);
        await this.fetchMyReports(); // Refresh list after creation
        return res.data;
      } catch (error) {
        this.error = error.response?.data?.message || "Failed to create report";
        throw error;
      } finally {
        this.isLoading = false;
      }
    },

    async fetchReportById(id) {
      this.isLoading = true;
      this.error = null;
      try {
        console.log("Fetching report by ID:", id);
        const res = await api.get(`/performance-reports/${id}`);
        console.log("Report by ID response:", res.data);
        return res.data?.data || res.data;
      } catch (error) {
        console.error("Fetch report by ID error:", error);
        this.error =
          error.response?.data?.message || "Failed to fetch report details";
        throw error;
      } finally {
        this.isLoading = false;
      }
    },

    async submitReport(id) {
      try {
        const res = await api.put(`/performance-reports/${id}/submit`);
        await this.fetchMyReports();
        return res.data;
      } catch (error) {
        throw error.response?.data || error;
      }
    },
  },
});

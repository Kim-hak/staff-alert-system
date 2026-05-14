import { defineStore } from 'pinia';
import axios from 'axios';
import { useAuthStore } from './useAuth'; // សម្រាប់ឆែកមើល Role របស់អ្នកប្រើ

export const useReportStore = defineStore('report', {
  state: () => ({
    reports: [],    // បញ្ជីរបាយការណ៍
    isLoading: false,
    error: null,
    meta: {}        // សម្រាប់រក្សាទុកព័ត៌មានទំព័រ (Pagination) ដូចក្នុង Postman
  }),

  actions: {
    // មុខងារទាញយករបាយការណ៍ដែលមានភាពបត់បែនតាម Role
    async fetchReports(page = 1) {
      this.isLoading = true;
      this.error = null;
      
      const authStore = useAuthStore();
      const role = authStore.profile?.role?.name?.toUpperCase();

      try {
        let endpoint = '/performance-reports';
        let params = {
          _page: page,
          _per_page: 10,
          sortBy: 'status',
          sortDir: 'DESC'
        };

        // --- កន្លែងបែងចែកសិទ្ធិ (Logic សម្រាប់ Manager) ---
        // ប្រសិនបើជា Manager យើងអាចបន្ថែម managerId ដើម្បី Filter យកតែក្រុមរបស់គាត់
        if (role === 'MANAGER') {
          params.managerId = authStore.profile?.id; 
        }

        const response = await axios.get(endpoint, { params });

        // ចាប់យកទិន្នន័យចេញពី data.items តាមរយៈរូបភាព image_549c1e.png
        if (response.data && response.data.data) {
          this.reports = response.data.data.items || [];
          this.meta = response.data.data.meta || {}; // រក្សាទុកព័ត៌មានទំព័រ
        }
      } catch (err) {
        this.error = "មិនអាចទាញទិន្នន័យរបាយការណ៍បានទេ";
        console.error("Fetch Error:", err);
      } finally {
        this.isLoading = false;
      }
    },

    // មុខងារលុបរបាយការណ៍ (Admin អាចលុបបានទាំងអស់ Manager លុបបានតែរបស់ក្រុមខ្លួន)
    async deleteReport(id) {
      try {
        await axios.delete(`/performance-reports/${id}`);
        this.reports = this.reports.filter(r => r.id !== id);
        return true;
      } catch (err) {
        console.error("Delete Error:", err);
        return false;
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

    async updateReport(id, payload) {
      this.isLoading = true;
      this.error = null;
      try {
        const res = await api.put(`/performance-reports/${id}`, payload);
        await this.fetchMyReports(); // Refresh list after update
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

import { defineStore } from "pinia";
import api from "@/api/api";

export const useGroupStore = defineStore("groups", {
  state: () => ({
    myGroups: [],
    loading: false,
    error: null,
  }),
  actions: {
    async fetchMyGroups() {
      this.loading = true;
      this.error = null;
      try {
        const res = await api.get("/groups/mine");
        this.myGroups = res.data?.data || [];
      } catch (error) {
        this.error = error.response?.data?.message || "Failed to fetch groups";
        console.error("Error fetching groups:", error);
      } finally {
        this.loading = false;
      }
    },
    async createGroup(data) {
      this.loading = true;
      this.error = null;
      try {
        console.log("Creating group with data:", data);
        const res = await api.post("/groups", data);
        console.log("Create response:", res.data);
        await this.fetchMyGroups(); // Refresh list after creation
        return res.data;
      } catch (error) {
        console.error("Create group error details:", error.response || error);
        this.error = error.response?.data?.message || "Failed to create group";
        throw error;
      } finally {
        this.loading = false;
      }
    },
    async updateGroup(id, data) {
      this.loading = true;
      this.error = null;
      try {
        const res = await api.put(`/groups/${id}`, data);
        await this.fetchMyGroups(); // Refresh list after update
        return res.data;
      } catch (error) {
        this.error = error.response?.data?.message || "Failed to update group";
        throw error;
      } finally {
        this.loading = false;
      }
    },
    async updateThumbnail(id, file) {
      const formData = new FormData();
      formData.append("thumbnail", file);
      try {
        const res = await api.post(`/groups/${id}/thumbnail`, formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });
        await this.fetchMyGroups();
        return res.data;
      } catch (error) {
        throw error.response?.data?.message || "Failed to update thumbnail";
      }
    },
    async deleteThumbnail(id) {
      try {
        const res = await api.delete(`/groups/${id}/thumbnail`);
        await this.fetchMyGroups();
        return res.data;
      } catch (error) {
        throw error.response?.data?.message || "Failed to delete thumbnail";
      }
    },
  },
});

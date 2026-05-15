import { defineStore } from "pinia";
import api from "@/api/api";

const normalizeGroups = (payload) => {
  if (Array.isArray(payload?.data?.items)) {
    return payload.data.items;
  }

  if (Array.isArray(payload?.data)) {
    return payload.data;
  }

  if (Array.isArray(payload?.items)) {
    return payload.items;
  }

  return [];
};

const normalizeList = normalizeGroups;

const normalizeCreatedGroup = (payload) => {
  if (payload?.data?.item) {
    return payload.data.item;
  }

  if (payload?.data && !Array.isArray(payload.data)) {
    return payload.data;
  }

  if (payload?.item) {
    return payload.item;
  }

  return payload;
};

const getErrorMessage = (error, fallback) => {
  const message = error.response?.data?.message;
  const details = error.response?.data?.details;

  if (Array.isArray(message)) {
    return message.join(", ");
  }

  if (Array.isArray(details) && details.length > 0) {
    return details.join(", ");
  }

  return message || error.response?.data?.error || fallback;
};

export const useGroupStore = defineStore("group", {
  state: () => ({
    groups: [],
    managers: [],
    staffs: [],
    loading: false,
    managersLoading: false,
    staffsLoading: false,
    error: null,
  }),

  actions: {
    async fetchGroups(params = {}) {
      this.loading = true;
      this.error = null;

      try {
        const response = await api.get("/groups", {
          params: {
            _page: 1,
            _per_page: 10,
            ...params,
          },
        });

        this.groups = normalizeGroups(response.data);
      } catch (error) {
        this.groups = [];
        this.error = getErrorMessage(error, "Failed to load groups");
        console.error("Fetch groups error:", error);
      } finally {
        this.loading = false;
      }
    },

    async fetchManagers(params = {}) {
      this.managersLoading = true;
      this.error = null;

      try {
        const response = await api.get("/users", {
          params: {
            _page: 1,
            _per_page: 100,
            status: "ACTIVATED",
            sortBy: "createdAt",
            sortDir: "DESC",
            ...params,
          },
        });

        const users = normalizeList(response.data);
        this.managers = users.filter((user) => {
          const roleId = Number(user.role?.id ?? user.roleId);
          const roleName = String(user.role?.name || "").toUpperCase();
          return roleId === 2 || roleName === "MANAGER";
        });
      } catch (error) {
        this.managers = [];
        this.error = getErrorMessage(error, "Failed to load managers");
        console.error("Fetch managers error:", error);
      } finally {
        this.managersLoading = false;
      }
    },

    async fetchStaffs(params = {}) {
      this.staffsLoading = true;
      this.error = null;

      try {
        const response = await api.get("/users", {
          params: {
            _page: 1,
            _per_page: 100,
            status: "ACTIVATED",
            sortBy: "createdAt",
            sortDir: "DESC",
            ...params,
          },
        });

        const users = normalizeList(response.data);
        this.staffs = users.filter((user) => {
          const roleId = Number(user.role?.id ?? user.roleId);
          const roleName = String(user.role?.name || "").toUpperCase();
          return roleId === 3 || roleName === "STAFF";
        });
      } catch (error) {
        this.staffs = [];
        this.error = getErrorMessage(error, "Failed to load staff");
        console.error("Fetch staff error:", error);
      } finally {
        this.staffsLoading = false;
      }
    },

    async createGroup(payload) {
      this.error = null;

      try {
        const response = await api.post("/groups", payload);
        const createdGroup = normalizeCreatedGroup(response.data);

        if (createdGroup?.id) {
          this.groups = [createdGroup, ...this.groups];
        } else {
          await this.fetchGroups();
        }

        return createdGroup || true;
      } catch (error) {
        this.error = getErrorMessage(error, "Failed to create group");
        console.error(
          "Create group response:",
          JSON.stringify(error.response?.data, null, 2),
        );
        console.error("Create group error:", error);
        return false;
      }
    },

    async updateGroup(id, payload) {
      this.error = null;

      try {
        const response = await api.put(`/groups/${id}`, payload);
        const updatedGroup = normalizeCreatedGroup(response.data);

        if (updatedGroup?.id) {
          this.groups = this.groups.map((group) =>
            String(group.id) === String(id) ? updatedGroup : group,
          );
        } else {
          await this.fetchGroups();
        }

        return true;
      } catch (error) {
        this.error = getErrorMessage(error, "Failed to update group");
        console.error(
          "Update group response:",
          JSON.stringify(error.response?.data, null, 2),
        );
        console.error("Update group error:", error);
        return false;
      }
    },

    async uploadGroupThumbnail(id, file) {
      this.error = null;

      try {
        const formData = new FormData();
        formData.append("thumbnail", file);

        const response = await api.post(`/groups/${id}/thumbnail`, formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        const updatedGroup = normalizeCreatedGroup(response.data);

        if (updatedGroup?.id) {
          this.groups = this.groups.map((group) =>
            String(group.id) === String(id) ? updatedGroup : group,
          );
        } else {
          await this.fetchGroups();
        }

        return true;
      } catch (error) {
        this.error = getErrorMessage(error, "Failed to upload group thumbnail");
        console.error(
          "Upload group thumbnail response:",
          JSON.stringify(error.response?.data, null, 2),
        );
        console.error("Upload group thumbnail error:", error);
        return false;
      }
    },

    async addGroupMembers(id, userIds) {
      this.error = null;

      try {
        const response = await api.post(`/groups/${id}/members`, { userIds });
        const updatedGroup = normalizeCreatedGroup(response.data);

        if (updatedGroup?.id) {
          this.groups = this.groups.map((group) =>
            String(group.id) === String(id) ? updatedGroup : group,
          );
        } else {
          await this.fetchGroups();
        }

        return true;
      } catch (error) {
        this.error = getErrorMessage(error, "Failed to add members to group");
        console.error(
          "Add group members response:",
          JSON.stringify(error.response?.data, null, 2),
        );
        console.error("Add group members error:", error);
        return false;
      }
    },

    async deleteGroup(id) {
      this.error = null;

      try {
        await api.delete(`/groups/${id}`);
        this.groups = this.groups.filter((group) => group.id !== id);
        return true;
      } catch (error) {
        this.error = getErrorMessage(error, "Failed to delete group");
        console.error("Delete group error:", error);
        return false;
      }
    },
  },
});

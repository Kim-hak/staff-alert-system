<template>
  <div class="page-container">
    <!-- Header Section -->
    <header
      class="page-header d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3 mb-5"
    >
      <div class="header-content">
        <h1 class="page-title text-dark fw-bold mb-1">ក្រុមរបស់ខ្ញុំ</h1>
        <p class="page-subtitle text-muted mb-0">
          គ្រប់គ្រងក្រុម និងសមាជិករបស់អ្នកឱ្យមានប្រសិទ្ធភាព
        </p>
      </div>

      <div class="header-actions">
        <button
          @click="openCreateModal"
          class="btn btn-primary-custom d-flex align-items-center gap-2 px-4 py-2.5 shadow-sm transition-all"
        >
          <i class="bi bi-plus-lg"></i>
          <span>បង្កើតក្រុមថ្មី</span>
        </button>
      </div>
    </header>

    <!-- Create/Edit Group Modal -->
    <BaseModal
      :show="showModal"
      :title="isEditing ? 'កែសម្រួលក្រុម' : 'បង្កើតក្រុមថ្មី'"
      @close="closeModal"
    >
      <form @submit.prevent="handleSubmit">
        <div class="mb-3">
          <label class="form-label fw-medium text-dark"
            >ឈ្មោះក្រុម <span class="text-danger">*</span></label
          >
          <input
            v-model="groupForm.name"
            type="text"
            class="form-control rounded-3"
            placeholder="បញ្ចូលឈ្មោះក្រុម..."
            required
          />
        </div>
        <div class="mb-4">
          <label class="form-label fw-medium text-dark">ការពិពណ៌នា</label>
          <textarea
            v-model="groupForm.description"
            class="form-control rounded-3"
            rows="3"
            placeholder="រៀបរាប់អំពីក្រុមរបស់អ្នក..."
          ></textarea>
        </div>

        <div class="d-flex justify-content-end gap-2">
          <button
            type="button"
            class="btn btn-light rounded-pill px-4"
            @click="closeModal"
          >
            បោះបង់
          </button>
          <button
            type="submit"
            class="btn btn-primary-custom rounded-pill px-4"
            :disabled="isSubmitting"
          >
            <span
              v-if="isSubmitting"
              class="spinner-border spinner-border-sm me-1"
            ></span>
            {{ isEditing ? "រក្សាទុក" : "បង្កើតក្រុម" }}
          </button>
        </div>
      </form>
    </BaseModal>

    <!-- Toolbar Section -->
    <section
      class="toolbar-section bg-white rounded-4 p-3 shadow-sm border border-light-subtle mb-5"
    >
      <div class="row align-items-center g-3">
        <div class="col-12 col-md-6 col-lg-4">
          <div class="search-wrapper position-relative">
            <i
              class="bi bi-search search-icon text-muted position-absolute"
            ></i>
            <input
              v-model="searchQuery"
              type="text"
              placeholder="ស្វែងរកតាមឈ្មោះក្រុម ឬអ្នកគ្រប់គ្រង..."
              class="form-control search-input ps-5 py-2.5 rounded-3 border-light-subtle transition-all"
            />
          </div>
        </div>

        <div
          class="col-12 col-md-6 col-lg-8 d-flex justify-content-md-end gap-2"
        >
          <!-- Future Filter Buttons can go here -->
          <div
            class="badge bg-light text-secondary d-flex align-items-center px-3 py-2 rounded-pill border"
          >
            <span class="fw-medium"
              >សរុប: {{ groupStore.myGroups.length }} ក្រុម</span
            >
          </div>
        </div>
      </div>
    </section>

    <!-- Main Content Area -->
    <div class="content-area min-vh-50">
      <!-- Loading State -->
      <div
        v-if="groupStore.loading"
        class="loading-state d-flex flex-column align-items-center justify-content-center py-5 mt-4"
      >
        <div class="spinner-custom mb-3"></div>
        <p class="text-muted fw-medium animate-pulse">កំពុងទាញយកទិន្នន័យ...</p>
      </div>

      <!-- Error State -->
      <div v-else-if="groupStore.error" class="error-state text-center py-5">
        <div class="error-icon-wrapper mb-3 mx-auto">
          <i class="bi bi-exclamation-triangle text-danger display-4"></i>
        </div>
        <h5 class="text-dark fw-bold">មានបញ្ហាបច្ចេកទេស</h5>
        <p class="text-muted mb-4">{{ groupStore.error }}</p>
        <button
          @click="groupStore.fetchMyGroups()"
          class="btn btn-outline-secondary rounded-pill px-4"
        >
          <i class="bi bi-arrow-clockwise me-1"></i> ព្យាយាមម្តងទៀត
        </button>
      </div>

      <!-- Empty State -->
      <div
        v-else-if="filteredGroups.length === 0"
        class="empty-state text-center py-5 bg-white rounded-4 border border-dashed border-light-subtle shadow-sm"
      >
        <div class="empty-illustration mb-4">
          <div class="icon-circle bg-light-success text-success mx-auto mb-3">
            <i class="bi bi-people display-5"></i>
          </div>
        </div>
        <h5 class="text-dark fw-bold">មិនមានក្រុមត្រូវបានរកឃើញទេ</h5>
        <p class="text-muted mx-auto" style="max-width: 300px">
          {{
            searchQuery
              ? 'មិនមានលទ្ធផលស្វែងរកសម្រាប់ "' + searchQuery + '" ទេ'
              : "ចាប់ផ្តើមបង្កើតក្រុមដំបូងរបស់អ្នកឥឡូវនេះ!"
          }}
        </p>
        <button
          v-if="!searchQuery"
          class="btn btn-primary-custom px-4 rounded-pill mt-2"
        >
          បង្កើតក្រុមឥឡូវនេះ
        </button>
      </div>

      <!-- Group Cards Grid -->
      <div v-else class="row g-4 animate-fade-in">
        <div
          v-for="(group, index) in filteredGroups"
          :key="group.id"
          class="col-12 col-md-6 col-lg-4"
          :style="{ animationDelay: `${index * 50}ms` }"
        >
          <GroupCard
            :name="group.name"
            :description="group.description"
            :thumbnail="group.thumbnail"
            :manager-name="group.manager?.fullname"
            :members-count="group.memberCount"
            :created-at="formatDate(group.createdAt)"
            @edit="openEditModal(group)"
            @update-thumbnail="(file) => handleUpdateThumbnail(group.id, file)"
            @delete-thumbnail="handleDeleteThumbnail(group.id)"
            class="h-100 hover-lift shadow-sm-hover"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed, reactive } from "vue";
import { useGroupStore } from "@/stores/useGroupStore";
import GroupCard from "@/components/ui/base/GroupCard.vue";
import BaseModal from "@/components/ui/base/BaseModal.vue";
import { useToast } from "vue-toastification";

const groupStore = useGroupStore();
const toast = useToast();
const searchQuery = ref("");
const showModal = ref(false);
const isEditing = ref(false);
const currentGroupId = ref(null);
const isSubmitting = ref(false);

const groupForm = reactive({
  name: "",
  description: "",
});

const openCreateModal = () => {
  isEditing.value = false;
  currentGroupId.value = null;
  groupForm.name = "";
  groupForm.description = "";
  showModal.value = true;
};

const openEditModal = (group) => {
  isEditing.value = true;
  currentGroupId.value = group.id;
  groupForm.name = group.name;
  groupForm.description = group.description;
  showModal.value = true;
};

const closeModal = () => {
  showModal.value = false;
};

const handleSubmit = async () => {
  if (!groupForm.name) return;

  isSubmitting.value = true;
  try {
    if (isEditing.value) {
      await groupStore.updateGroup(currentGroupId.value, {
        name: groupForm.name,
        description: groupForm.description,
      });
      toast.success("បានកែសម្រួលក្រុមដោយជោគជ័យ!");
    } else {
      await groupStore.createGroup({
        name: groupForm.name,
        description: groupForm.description,
      });
      toast.success("បានបង្កើតក្រុមដោយជោគជ័យ!");
    }
    closeModal();
  } catch (error) {
    toast.error(error.response?.data?.message || "ប្រតិបត្តិការបរាជ័យ");
  } finally {
    isSubmitting.value = false;
  }
};

const filteredGroups = computed(() => {
  if (!searchQuery.value) return groupStore.myGroups;
  const query = searchQuery.value.toLowerCase();
  return groupStore.myGroups.filter(
    (group) =>
      group.name.toLowerCase().includes(query) ||
      (group.manager?.fullname &&
        group.manager.fullname.toLowerCase().includes(query)),
  );
});

const formatDate = (dateString) => {
  if (!dateString) return "";
  const date = new Date(dateString);
  return new Intl.DateTimeFormat("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(date);
};

const handleUpdateThumbnail = async (id, file) => {
  try {
    await groupStore.updateThumbnail(id, file);
    toast.success("បានប្តូររូបភាពដោយជោគជ័យ!");
  } catch (error) {
    toast.error(error);
  }
};

const handleDeleteThumbnail = async (id) => {
  try {
    await groupStore.deleteThumbnail(id);
    toast.success("បានលុបរូបភាពដោយជោគជ័យ!");
  } catch (error) {
    toast.error(error);
  }
};

onMounted(async () => {
  await groupStore.fetchMyGroups();
});
</script>

<style scoped>
.page-container {
  max-width: 1400px;
  margin: 0 auto;
}

.page-title {
  font-size: 1.75rem;
  letter-spacing: -0.01em;
  color: #2d3436;
}

.page-subtitle {
  font-size: 0.95rem;
  opacity: 0.8;
}

.btn-primary-custom {
  background-color: #52796f;
  border: none;
  color: white;
  font-weight: 500;
  border-radius: 12px;
}

.btn-primary-custom:hover {
  background-color: #354f52;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(82, 121, 111, 0.25);
}

.search-wrapper .search-icon {
  left: 1.25rem;
  top: 50%;
  transform: translateY(-50%);
  z-index: 4;
}

.search-input {
  background-color: #f8f9fa;
  border-color: #e9ecef;
}

.search-input:focus {
  background-color: white;
  border-color: #52796f;
  box-shadow: 0 0 0 4px rgba(82, 121, 111, 0.1);
}

.bg-light-success {
  background-color: rgba(82, 121, 111, 0.1);
}

.icon-circle {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.spinner-custom {
  width: 40px;
  height: 40px;
  border: 3px solid rgba(82, 121, 111, 0.1);
  border-top-color: #52796f;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

.animate-pulse {
  animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}

@keyframes pulse {
  0%,
  100% {
    opacity: 1;
  }
  50% {
    opacity: 0.5;
  }
}

.animate-fade-in {
  animation: fadeIn 0.5s ease-out forwards;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.transition-all {
  transition: all 0.25s ease;
}

.hover-lift:hover {
  transform: translateY(-5px);
}

.shadow-sm-hover:hover {
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.08) !important;
}

.min-vh-50 {
  min-height: 50vh;
}
</style>

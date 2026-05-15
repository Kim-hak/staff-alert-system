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

    <!-- Members Management Modal -->
    <BaseModal
      :show="showMembersModal"
      :title="'គ្រប់គ្រងសមាជិក - ' + (selectedGroup?.name || '')"
      @close="closeMembersModal"
      size="lg"
    >
      <div class="members-management">
        <!-- Add Member Section -->
        <div class="mb-5">
          <label class="form-label fw-bold text-dark mb-3"
            >បន្ថែមសមាជិកថ្មី</label
          >

          <div v-if="availableStaff.length > 0" class="row g-3 mb-4">
            <div
              v-for="staff in availableStaff"
              :key="staff.id"
              class="col-12 col-md-6"
            >
              <div
                class="member-selection-card d-flex align-items-center justify-content-between p-3 rounded-4 border transition-all cursor-pointer"
                :class="{ selected: selectedStaffIds.includes(staff.id) }"
                @click="toggleStaffSelection(staff.id)"
              >
                <div class="d-flex align-items-center gap-3">
                  <div
                    class="member-avatar-mini bg-light-success text-success rounded-circle d-flex align-items-center justify-content-center fw-bold"
                  >
                    {{
                      (staff.fullname || staff.name || staff.username)?.charAt(
                        0,
                      )
                    }}
                  </div>
                  <div class="overflow-hidden">
                    <h6 class="mb-0 fw-bold text-dark text-truncate">
                      {{ staff.fullname || staff.name || staff.username }}
                    </h6>
                    <small class="text-muted text-truncate d-block">{{
                      staff.email || staff.username
                    }}</small>
                  </div>
                </div>
                <div class="selection-indicator">
                  <i
                    class="bi"
                    :class="
                      selectedStaffIds.includes(staff.id)
                        ? 'bi-check-circle-fill text-success'
                        : 'bi-circle text-muted opacity-25'
                    "
                  ></i>
                </div>
              </div>
            </div>
          </div>

          <div
            v-else-if="!groupStore.staffsLoading"
            class="text-center py-4 bg-light rounded-4 border border-dashed mb-4"
          >
            <p class="text-muted mb-0 small">មិនមានបុគ្គលិកសម្រាប់បន្ថែមទេ</p>
          </div>

          <button
            class="btn btn-primary-custom w-100 py-3 rounded-4 shadow-sm transition-all d-flex align-items-center justify-content-center gap-2"
            @click="handleAddMembers"
            :disabled="selectedStaffIds.length === 0 || isSubmittingMember"
          >
            <span
              v-if="isSubmittingMember"
              class="spinner-border spinner-border-sm"
            ></span>
            <span
              >បន្ថែមសមាជិកដែលបានជ្រើសរើសចំនួន
              {{ selectedStaffIds.length }}</span
            >
          </button>

          <p
            v-if="groupStore.staffsLoading"
            class="text-center mt-3 text-muted small"
          >
            <span class="spinner-border spinner-border-sm me-1"></span>
            កំពុងទាញយកបញ្ជីបុគ្គលិក...
          </p>
        </div>

        <!-- Current Members List -->
        <div>
          <label class="form-label fw-bold text-dark mb-3">
            សមាជិកបច្ចុប្បន្ន ({{ selectedGroup?.members?.length || 0 }})
          </label>

          <div v-if="selectedGroup?.members?.length > 0" class="row g-3">
            <div
              v-for="member in selectedGroup.members"
              :key="member.id"
              class="col-12 col-md-6"
            >
              <div
                class="member-display-card d-flex align-items-center justify-content-between p-3 rounded-4 border bg-light-subtle transition-all"
              >
                <div class="d-flex align-items-center gap-3">
                  <div
                    class="member-avatar-mini bg-white shadow-sm border rounded-circle d-flex align-items-center justify-content-center fw-bold text-muted"
                  >
                    {{
                      (
                        member.fullname ||
                        member.name ||
                        member.username
                      )?.charAt(0)
                    }}
                  </div>
                  <div class="overflow-hidden">
                    <h6 class="mb-0 fw-bold text-dark text-truncate">
                      {{ member.fullname || member.name || member.username }}
                    </h6>
                    <small class="text-muted text-truncate d-block">{{
                      member.email || member.username
                    }}</small>
                  </div>
                </div>
                <button
                  class="btn btn-link text-danger p-1 rounded-circle hover-bg-danger-light"
                  @click="handleRemoveMember(member.id)"
                  :disabled="isSubmittingMember"
                  title="លុបសមាជិក"
                >
                  <i class="bi bi-x-circle-fill fs-5"></i>
                </button>
              </div>
            </div>
          </div>

          <div
            v-else
            class="text-center py-5 bg-light rounded-4 border border-dashed"
          >
            <div class="text-muted mb-2">
              <i class="bi bi-people display-6 opacity-25"></i>
            </div>
            <p class="text-muted mb-0">
              មិនទាន់មានសមាជិកនៅក្នុងក្រុមនេះនៅឡើយទេ
            </p>
          </div>
        </div>
      </div>
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
            @members="openMembersModal(group)"
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
import { useGroupManagerStore } from "@/stores/useGroupManagerStore";
import GroupCard from "@/components/ui/base/GroupCard.vue";
import BaseModal from "@/components/ui/base/BaseModal.vue";
import { useToast } from "vue-toastification";

const groupStore = useGroupManagerStore();
const toast = useToast();
const searchQuery = ref("");
const showModal = ref(false);
const isEditing = ref(false);
const currentGroupId = ref(null);
const isSubmitting = ref(false);

// Members management state
const showMembersModal = ref(false);
const selectedGroup = ref(null);
const selectedStaffIds = ref([]);
const isSubmittingMember = ref(false);

const groupForm = reactive({
  name: "",
  description: "",
});

const toggleStaffSelection = (id) => {
  const index = selectedStaffIds.value.indexOf(id);
  if (index === -1) {
    selectedStaffIds.value.push(id);
  } else {
    selectedStaffIds.value.splice(index, 1);
  }
};

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

const openMembersModal = async (group) => {
  selectedGroup.value = group;
  showMembersModal.value = true;
  selectedStaffIds.value = [];

  try {
    // Fetch fresh group details to get full members list
    const details = await groupStore.fetchGroupById(group.id);
    if (details) {
      selectedGroup.value = details;
    }

    // Always fetch staffs to ensure the list is fresh
    await groupStore.fetchMyStaffs();
  } catch (error) {
    toast.error("មិនអាចទាញយកព័ត៌មានសមាជិកបានទេ");
  }
};

const closeMembersModal = () => {
  showMembersModal.value = false;
  selectedGroup.value = null;
  selectedStaffIds.value = [];
};

const availableStaff = computed(() => {
  if (!selectedGroup.value) return [];
  const memberIds =
    selectedGroup.value.members?.map((m) =>
      String(m.id || m.userId || m.staffId),
    ) || [];
  return groupStore.myStaffs.filter(
    (staff) => !memberIds.includes(String(staff.id)),
  );
});

const handleAddMembers = async () => {
  if (selectedStaffIds.value.length === 0 || !selectedGroup.value) return;

  isSubmittingMember.value = true;
  try {
    // API: POST {{baseUrl}}/groups/{{groupId}}/members
    // Body: { "userIds": [selectedStaffIds] }
    await groupStore.addGroupMembers(
      selectedGroup.value.id,
      selectedStaffIds.value,
    );
    // Update local selectedGroup reference
    selectedGroup.value = groupStore.myGroups.find(
      (g) => g.id === selectedGroup.value.id,
    );
    selectedStaffIds.value = [];
    toast.success("បានបន្ថែមសមាជិកដោយជោគជ័យ!");
  } catch (error) {
    toast.error(error.response?.data?.message || "បរាជ័យក្នុងការបន្ថែមសមាជិក");
  } finally {
    isSubmittingMember.value = false;
  }
};

const handleRemoveMember = async (userId) => {
  if (!selectedGroup.value) return;

  isSubmittingMember.value = true;
  try {
    // API: DELETE {{baseUrl}}/groups/{{groupId}}/members
    // Body: { "userIds": [userId] }
    await groupStore.removeGroupMembers(selectedGroup.value.id, [userId]);
    // Update local selectedGroup reference
    selectedGroup.value = groupStore.myGroups.find(
      (g) => g.id === selectedGroup.value.id,
    );
    toast.success("បានលុបសមាជិកដោយជោគជ័យ!");
  } catch (error) {
    toast.error(error.response?.data?.message || "បរាជ័យក្នុងការលុបសមាជិក");
  } finally {
    isSubmittingMember.value = false;
  }
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
    toast.error(groupStore.error || "បរាជ័យក្នុងការប្តូររូបភាព");
  }
};

const handleDeleteThumbnail = async (id) => {
  try {
    await groupStore.deleteThumbnail(id);
    toast.success("បានលុបរូបភាពដោយជោគជ័យ!");
  } catch (error) {
    toast.error(groupStore.error || "បរាជ័យក្នុងការលុបរូបភាព");
  }
};

onMounted(async () => {
  await groupStore.fetchMyGroups();
  if (groupStore.error) {
    toast.error(groupStore.error);
  }
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

/* Members Management Styles */
.member-selection-card,
.member-display-card {
  border-color: #e9ecef !important;
  background-color: white;
  height: 100%;
}

.member-selection-card:hover {
  border-color: #52796f !important;
  background-color: #f4faf9;
}

.member-selection-card.selected {
  border-color: #52796f !important;
  background-color: #f4faf9;
  box-shadow: 0 4px 12px rgba(82, 121, 111, 0.08);
}

.member-avatar-mini {
  width: 42px;
  height: 42px;
  flex-shrink: 0;
  font-size: 1rem;
}

.bg-light-success {
  background-color: rgba(82, 121, 111, 0.1);
}

.cursor-pointer {
  cursor: pointer;
}

.hover-bg-danger-light:hover {
  background-color: rgba(220, 53, 69, 0.1);
  color: #dc3545 !important;
}

.selection-indicator i {
  font-size: 1.25rem;
}

.member-display-card {
  background-color: #f8f9fa;
}
</style>

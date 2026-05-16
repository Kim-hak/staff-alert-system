<script setup>
import { ref, reactive, onMounted, computed, watch } from 'vue';
import { useGroupStore } from '@/stores/useGroupStore';
import GroupCard from '@/components/ui/base/GroupCard.vue';
import BasePagination from '@/components/ui/base/BasePagination.vue';
import Swal from 'sweetalert2';

const groupStore = useGroupStore();
const searchQuery = ref('');
const currentPage = ref(1);
const showGroupModal = ref(false);
const showMembersModal = ref(false);
const editingGroup = ref(null);
const selectedGroupForMembers = ref(null);
const isSubmitting = ref(false);
const isAddingMembers = ref(false);
const isLoadingMembers = ref(false);
const itemsPerPage = 6;

const groupForm = reactive({
  name: '',
  managerId: '',
  description: '',
  avatar: null,
  avatarPreview: ''
});

const formErrors = reactive({
  name: '',
  managerId: '',
  avatar: ''
});

const memberForm = reactive({
  selectedIds: []
});

onMounted(async () => {
  await Promise.all([
    groupStore.fetchGroups(),
    groupStore.fetchManagers(),
    groupStore.fetchStaffs()
  ]);
});

const filteredGroups = computed(() => {
  const allGroups = Array.isArray(groupStore.groups) ? groupStore.groups : [];
  const query = searchQuery.value.toLowerCase();

  return allGroups.filter((group) => {
    const name = getGroupName(group).toLowerCase();
    const description = String(group.description || '').toLowerCase();
    const managerName = getManagerName(group).toLowerCase();
    return name.includes(query) || description.includes(query) || managerName.includes(query);
  });
});

const totalPages = computed(() => Math.ceil(filteredGroups.value.length / itemsPerPage) || 1);

watch(totalPages, (pages) => {
  if (currentPage.value > pages) {
    currentPage.value = pages;
  }
});

const paginatedGroups = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage;
  return filteredGroups.value.slice(start, start + itemsPerPage);
});

const modalTitle = computed(() => editingGroup.value ? 'Edit Group' : 'Create New Group');
const submitLabel = computed(() => editingGroup.value ? 'Update Group' : 'Create Group');
const selectedGroupName = computed(() => selectedGroupForMembers.value ? getGroupName(selectedGroupForMembers.value) : '');

const handlePageChange = (page) => {
  currentPage.value = Math.min(Math.max(page, 1), totalPages.value);
  window.scrollTo({ top: 0, behavior: 'smooth' });
};

function getUserName(user) {
  return user.fullname
    || user.name
    || user.username
    || `${user.firstName || ''} ${user.lastName || ''}`.trim()
    || user.email
    || 'Unnamed user';
}

function getMemberUser(member) {
  return member?.user || member?.staff || member;
}

function getMemberUserId(member) {
  return member?.user?.id
    ?? member?.staff?.id
    ?? member?.userId
    ?? member?.staffId
    ?? member?.id;
}

function getGroupName(group) {
  return String(group.name || group.groupName || group.group_name || '');
}

function getGroupImage(group) {
  return group.thumbnail || group.avatar || group.image || group.photo || '';
}

function getManagerId(group) {
  return group.managerId || group.manager?.id || group.manager_id || '';
}

function getManagerName(group) {
  return group.managerName
    || group.manager?.fullname
    || group.manager?.name
    || group.manager?.email
    || 'Unassigned';
}

function getMembersCount(group) {
  if (typeof group.membersCount === 'number') return group.membersCount;
  if (typeof group.memberCount === 'number') return group.memberCount;
  if (Array.isArray(group.members)) return group.members.length;
  if (Array.isArray(group.staffs)) return group.staffs.length;
  return 0;
}

function getGroupMembers(group) {
  if (!group) return [];
  if (Array.isArray(group.members)) return group.members;
  if (Array.isArray(group.staffs)) return group.staffs;
  if (Array.isArray(group.users)) return group.users;
  return [];
}

function getGroupMemberIds(group) {
  return [...new Set(
    getGroupMembers(group)
      .map(getMemberUserId)
      .filter((id) => id !== undefined && id !== null)
      .map(String)
  )];
}

const selectedGroupMemberIds = computed(() => (
  selectedGroupForMembers.value ? getGroupMemberIds(selectedGroupForMembers.value) : []
));

const selectedGroupMemberIdSet = computed(() => new Set(selectedGroupMemberIds.value));

const staffMemberOptions = computed(() => {
  const currentMemberIds = selectedGroupMemberIdSet.value;
  const optionsById = new Map();

  const addOption = (userLike) => {
    const user = getMemberUser(userLike);
    const id = getMemberUserId(userLike);

    if (!user || id === undefined || id === null) return;

    optionsById.set(String(id), {
      ...user,
      id: String(id)
    });
  };

  groupStore.staffs.forEach(addOption);
  getGroupMembers(selectedGroupForMembers.value).forEach(addOption);

  return Array.from(optionsById.values()).sort((a, b) => {
    const aIsMember = currentMemberIds.has(String(a.id));
    const bIsMember = currentMemberIds.has(String(b.id));

    if (aIsMember !== bIsMember) {
      return aIsMember ? -1 : 1;
    }

    return getUserName(a).localeCompare(getUserName(b));
  });
});

const newSelectedMemberIds = computed(() => (
  memberForm.selectedIds.filter((id) => !selectedGroupMemberIdSet.value.has(String(id)))
));

function setMemberSelectionFromGroup(group) {
  memberForm.selectedIds = getGroupMemberIds(group);
}

function isCurrentGroupMember(staff) {
  const id = getMemberUserId(staff);
  return id !== undefined && id !== null && selectedGroupMemberIdSet.value.has(String(id));
}

function isSelectedMember(staff) {
  const id = getMemberUserId(staff);
  return id !== undefined && id !== null && memberForm.selectedIds.includes(String(id));
}

function toApiUserId(id) {
  const numericId = Number(id);
  return Number.isNaN(numericId) ? id : numericId;
}

const formatDate = (date) => {
  if (!date) return '-';

  const parsedDate = new Date(date);
  if (Number.isNaN(parsedDate.getTime())) return '-';

  return parsedDate.toLocaleDateString('en-US');
};

const revokePreview = () => {
  if (groupForm.avatarPreview && groupForm.avatarPreview.startsWith('blob:')) {
    URL.revokeObjectURL(groupForm.avatarPreview);
  }
};

const resetGroupForm = () => {
  revokePreview();
  groupForm.name = '';
  groupForm.managerId = '';
  groupForm.description = '';
  groupForm.avatar = null;
  groupForm.avatarPreview = '';
  clearFormErrors();
  editingGroup.value = null;
};

const openCreateModal = () => {
  resetGroupForm();
  showGroupModal.value = true;
};

const openEditModal = (group) => {
  resetGroupForm();
  editingGroup.value = group;
  groupForm.name = getGroupName(group);
  groupForm.managerId = getManagerId(group) ? String(getManagerId(group)) : '';
  groupForm.description = group.description || '';
  groupForm.avatarPreview = getGroupImage(group);
  showGroupModal.value = true;
};

const closeGroupModal = () => {
  if (isSubmitting.value) return;
  showGroupModal.value = false;
  resetGroupForm();
};

const openMembersModal = async (group) => {
  selectedGroupForMembers.value = group;
  setMemberSelectionFromGroup(group);
  showMembersModal.value = true;

  isLoadingMembers.value = true;
  const staffPromise = groupStore.staffs.length > 0 ? Promise.resolve() : groupStore.fetchStaffs();

  try {
    const [details] = await Promise.all([
      groupStore.fetchGroupById(group.id),
      staffPromise
    ]);

    if (details) {
      selectedGroupForMembers.value = details;
      setMemberSelectionFromGroup(details);
    }
  } finally {
    isLoadingMembers.value = false;
  }
};

const closeMembersModal = () => {
  if (isAddingMembers.value) return;
  showMembersModal.value = false;
  isLoadingMembers.value = false;
  selectedGroupForMembers.value = null;
  memberForm.selectedIds = [];
};

const selectedManager = computed(() => {
  return groupStore.managers.find((manager) => String(manager.id) === String(groupForm.managerId));
});

const clearFormErrors = () => {
  formErrors.name = '';
  formErrors.managerId = '';
  formErrors.avatar = '';
};

const validateGroupForm = () => {
  clearFormErrors();
  const name = groupForm.name.trim();

  if (!name) {
    formErrors.name = 'Group name is required.';
  } else if (name.length > 100) {
    formErrors.name = 'Group name must not exceed 100 characters.';
  }

  if (!groupForm.managerId) {
    formErrors.managerId = 'Please select a manager.';
  }

  if (groupForm.avatar) {
    const isImage = groupForm.avatar.type.startsWith('image/');
    const maxSize = 2 * 1024 * 1024;

    if (!isImage) {
      formErrors.avatar = 'Avatar must be an image file.';
    } else if (groupForm.avatar.size > maxSize) {
      formErrors.avatar = 'Avatar must be 2MB or smaller.';
    }
  }

  return !formErrors.name && !formErrors.managerId && !formErrors.avatar;
};

const handleAvatarChange = (event) => {
  const file = event.target.files?.[0] || null;
  revokePreview();
  groupForm.avatar = file;
  groupForm.avatarPreview = file ? URL.createObjectURL(file) : (editingGroup.value ? getGroupImage(editingGroup.value) : '');
  formErrors.avatar = '';
};

const buildGroupPayload = () => {
  const name = groupForm.name.trim();
  const description = groupForm.description.trim();
  const managerId = Number(groupForm.managerId);

  const payload = {
    name,
    managerId
  };

  if (description) {
    payload.description = description;
  }

  return payload;
};

const handleSubmitGroup = async () => {
  if (!validateGroupForm()) {
    return;
  }

  isSubmitting.value = true;
  const payload = buildGroupPayload();
  const result = editingGroup.value
    ? await groupStore.updateGroup(editingGroup.value.id, payload)
    : await groupStore.createGroup(payload);
  const savedGroupId = editingGroup.value?.id || result?.id || result?.data?.id;
  const thumbnailUploaded = groupForm.avatar && savedGroupId
    ? await groupStore.uploadGroupThumbnail(savedGroupId, groupForm.avatar)
    : true;
  isSubmitting.value = false;

  if (result && thumbnailUploaded) {
    const successTitle = editingGroup.value ? 'Group updated!' : 'Group created!';
    closeGroupModal();
    currentPage.value = 1;
    Swal.fire({
      title: successTitle,
      icon: 'success',
      timer: 1500,
      showConfirmButton: false
    });
  } else {
    Swal.fire({
      title: editingGroup.value ? 'Update failed' : 'Create failed',
      text: groupStore.error || 'Could not save group. Please try again.',
      icon: 'error',
      confirmButtonColor: '#2D6A4F'
    });
  }
};

const handleAddMembers = async () => {
  if (!selectedGroupForMembers.value) return;

  if (newSelectedMemberIds.value.length === 0) {
    Swal.fire({
      title: 'No new members selected',
      text: 'Please select staff who are not already in this group.',
      icon: 'warning',
      confirmButtonColor: '#2D6A4F'
    });
    return;
  }

  isAddingMembers.value = true;
  const userIds = newSelectedMemberIds.value.map(toApiUserId);
  const success = await groupStore.addGroupMembers(selectedGroupForMembers.value.id, userIds);
  isAddingMembers.value = false;

  if (success) {
    closeMembersModal();
    Swal.fire({
      title: 'Members added!',
      icon: 'success',
      timer: 1500,
      showConfirmButton: false
    });
  } else {
    Swal.fire({
      title: 'Add members failed',
      text: groupStore.error || 'Could not add members. Please try again.',
      icon: 'error',
      confirmButtonColor: '#2D6A4F'
    });
  }
};

const handleDelete = async (id) => {
  const result = await Swal.fire({
    title: 'Are you sure?',
    text: 'This group will be deleted from the system.',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#2D6A4F',
    confirmButtonText: 'Yes, delete it',
    cancelButtonText: 'Cancel',
    reverseButtons: true
  });

  if (result.isConfirmed) {
    const success = await groupStore.deleteGroup(id);
    if (success) {
      Swal.fire({ title: 'Deleted!', icon: 'success', timer: 1500, showConfirmButton: false });
    }
  }
};
</script>

<template>
  <div class="container-fluid p-4">
    <div class="d-flex justify-content-between align-items-center mb-4">
      <div>
        <h2 class="fw-bold">Group Management</h2>
        <p class="text-muted">Manage all groups in the system</p>
      </div>
      <button
        class="btn btn-success shadow-sm"
        style="background-color: #2D6A4F; border: none;"
        @click="openCreateModal"
      >
        <i class="bi bi-plus-lg"></i> Create Group
      </button>
    </div>

    <div class="row mb-4">
      <div class="col-12">
        <div class="input-group bg-white shadow-sm rounded">
          <span class="input-group-text bg-white border-0 ps-3">
            <i class="bi bi-search text-muted"></i>
          </span>
          <input
            v-model="searchQuery"
            type="text"
            class="form-control border-0 py-2"
            placeholder="Search groups by name, manager, or description..."
            @input="currentPage = 1"
          >
        </div>
      </div>
    </div>

    <div class="row group-card-grid">
      <div v-if="groupStore.loading" class="text-center py-5">
        <div class="spinner-border text-success" role="status"></div>
        <p class="mt-2 text-muted">Loading groups...</p>
      </div>

      <template v-else>
        <div
          v-for="group in paginatedGroups"
          :key="group.id"
          class="col-md-6 col-lg-4 mb-4"
        >
          <GroupCard
            :thumbnail="getGroupImage(group)"
            :name="getGroupName(group) || 'Untitled Group'"
            :description="group.description"
            :manager-name="getManagerName(group)"
            :members-count="getMembersCount(group)"
            :created-at="formatDate(group.createdAt)"
            @members="openMembersModal(group)"
            @edit="openEditModal(group)"
            @delete="handleDelete(group.id)"
          />
        </div>

        <div v-if="filteredGroups.length === 0" class="col-12 text-center py-5">
          <p class="text-muted">No groups found.</p>
        </div>
      </template>
    </div>

    <div v-if="totalPages > 1" class="d-flex justify-content-center mt-3">
      <BasePagination
        :total-pages="totalPages"
        :current-page="currentPage"
        @change-page="handlePageChange"
      />
    </div>

    <div v-if="showGroupModal" class="modal-backdrop-custom">
      <div class="group-modal shadow-lg">
        <div class="modal-header-panel d-flex justify-content-between align-items-center">
          <h5 class="text-white fw-bold mb-0">{{ modalTitle }}</h5>
          <button class="btn modal-close-btn" type="button" @click="closeGroupModal">
            <i class="bi bi-x-lg"></i>
          </button>
        </div>

        <form class="modal-body-panel" @submit.prevent="handleSubmitGroup">
          <div class="avatar-field mb-3">
            <div class="avatar-preview bg-light">
              <img v-if="groupForm.avatarPreview" :src="groupForm.avatarPreview" alt="Group avatar">
              <i v-else class="bi bi-image text-muted"></i>
            </div>
            <div class="flex-grow-1">
              <label for="groupAvatar" class="form-label fw-semibold">Avatar</label>
              <input
                id="groupAvatar"
                type="file"
                :class="['form-control bordered-field', { 'is-invalid': formErrors.avatar }]"
                accept="image/*"
                :disabled="isSubmitting"
                @change="handleAvatarChange"
              >
              <div v-if="formErrors.avatar" class="invalid-feedback d-block">{{ formErrors.avatar }}</div>
            </div>
          </div>

          <div class="mb-3">
            <label for="groupName" class="form-label fw-semibold">Group Name *</label>
            <input
              id="groupName"
              v-model="groupForm.name"
              type="text"
              :class="['form-control form-control-lg bordered-field', { 'is-invalid': formErrors.name }]"
              placeholder="Enter group name"
              maxlength="100"
              :disabled="isSubmitting"
              @input="formErrors.name = ''"
            >
            <div class="d-flex justify-content-between mt-1">
              <div v-if="formErrors.name" class="invalid-feedback d-block">{{ formErrors.name }}</div>
              <small class="text-muted ms-auto">{{ groupForm.name.length }}/100</small>
            </div>
          </div>

          <div class="mb-3">
            <label for="managerId" class="form-label fw-semibold">Manager *</label>
            <select
              id="managerId"
              v-model="groupForm.managerId"
              :class="['form-select form-select-lg bordered-field', { 'is-invalid': formErrors.managerId }]"
              :disabled="isSubmitting || groupStore.managersLoading"
              @change="formErrors.managerId = ''"
            >
              <option value="" disabled>
                {{ groupStore.managersLoading ? 'Loading managers...' : 'Select manager' }}
              </option>
              <option v-for="manager in groupStore.managers" :key="manager.id" :value="String(manager.id)">
                {{ getUserName(manager) }}
              </option>
            </select>
            <div v-if="formErrors.managerId" class="invalid-feedback d-block">{{ formErrors.managerId }}</div>
          </div>

          <div class="mb-4">
            <label for="groupDescription" class="form-label fw-semibold">Description</label>
            <textarea
              id="groupDescription"
              v-model="groupForm.description"
              class="form-control bordered-field"
              rows="3"
              placeholder="Enter group description"
              :disabled="isSubmitting"
            ></textarea>
          </div>

          <div class="d-flex justify-content-end gap-3">
            <button
              type="button"
              class="btn btn-secondary px-4"
              :disabled="isSubmitting"
              @click="closeGroupModal"
            >
              Cancel
            </button>
            <button
              type="submit"
              class="btn btn-create px-4"
              :disabled="isSubmitting"
            >
              <span v-if="isSubmitting" class="spinner-border spinner-border-sm me-2" role="status"></span>
              {{ submitLabel }}
            </button>
          </div>
        </form>
      </div>
    </div>

    <div v-if="showMembersModal" class="modal-backdrop-custom">
      <div class="group-modal shadow-lg">
        <div class="modal-header-panel d-flex justify-content-between align-items-center">
          <div>
            <h5 class="text-white fw-bold mb-0">Add Members</h5>
            <p class="text-white-50 small mb-0">{{ selectedGroupName }}</p>
          </div>
          <button class="btn modal-close-btn" type="button" @click="closeMembersModal">
            <i class="bi bi-x-lg"></i>
          </button>
        </div>

        <form class="modal-body-panel" @submit.prevent="handleAddMembers">
          <div class="mb-3">
            <div class="members-label-row">
              <label class="form-label fw-semibold mb-0">Staff Members</label>
              <span class="member-count-badge">{{ selectedGroupMemberIds.length }} in group</span>
            </div>

            <div v-if="isLoadingMembers" class="members-refreshing">
              <span class="spinner-border spinner-border-sm me-2" role="status"></span>
              Refreshing group members...
            </div>

            <div v-if="groupStore.staffsLoading && staffMemberOptions.length === 0" class="text-muted py-3">
              <span class="spinner-border spinner-border-sm me-2" role="status"></span>
              Loading staff...
            </div>

            <div v-else-if="staffMemberOptions.length === 0" class="empty-members-state">
              No staff members found.
            </div>

            <div v-else class="member-picker">
              <label
                v-for="staff in staffMemberOptions"
                :key="staff.id"
                class="member-option"
                :class="{
                  'member-option-selected': isSelectedMember(staff),
                  'member-option-existing': isCurrentGroupMember(staff)
                }"
              >
                <input
                  v-model="memberForm.selectedIds"
                  class="form-check-input"
                  type="checkbox"
                  :value="String(staff.id)"
                  :disabled="isAddingMembers || isCurrentGroupMember(staff)"
                >
                <span class="member-avatar">
                  <img v-if="staff.avatar" :src="staff.avatar" alt="">
                  <span v-else>{{ getUserName(staff).charAt(0).toUpperCase() }}</span>
                </span>
                <span class="member-info">
                  <span class="member-name">{{ getUserName(staff) }}</span>
                  <span class="member-email">{{ staff.email || staff.phone || 'Staff' }}</span>
                </span>
                <span v-if="isCurrentGroupMember(staff)" class="member-status-badge">In group</span>
              </label>
            </div>
          </div>

          <div class="d-flex justify-content-end gap-3">
            <button
              type="button"
              class="btn btn-secondary px-4"
              :disabled="isAddingMembers"
              @click="closeMembersModal"
            >
              Cancel
            </button>
            <button
              type="submit"
              class="btn btn-create px-4"
              :disabled="isAddingMembers || newSelectedMemberIds.length === 0"
            >
              <span v-if="isAddingMembers" class="spinner-border spinner-border-sm me-2" role="status"></span>
              Add Members
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<style scoped>
.modal-backdrop-custom {
  position: fixed;
  inset: 0;
  z-index: 1050;
  display: flex;
  align-items: flex-start;
  justify-content: center;
  padding: 48px 16px 24px;
  overflow-y: auto;
  background: rgba(0, 0, 0, 0.42);
}

.group-card-grid {
  margin-top: 1.25rem;
}

.group-modal {
  width: min(520px, 100%);
  border-radius: 6px;
  overflow: hidden;
  background: #ffffff;
}

.modal-header-panel {
  padding: 22px 24px;
  background: #4d7c6e;
}

.modal-body-panel {
  padding: 24px;
  background: #ffffff;
}

.modal-body-panel .form-label {
  color: #1f2937;
}

.modal-close-btn {
  color: #ffffff;
  border: 0;
}

.modal-close-btn:hover,
.modal-close-btn:focus {
  color: #e9f5ef;
}

.avatar-field {
  display: flex;
  align-items: center;
  gap: 16px;
}

.avatar-preview {
  width: 92px;
  height: 92px;
  display: grid;
  flex: 0 0 92px;
  place-items: center;
  overflow: hidden;
  border-radius: 8px;
}

.avatar-preview img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.avatar-preview i {
  font-size: 2rem;
}

.modal-body-panel .form-control,
.modal-body-panel .form-select {
  border: 1px solid #5d9aa6;
  border-radius: 6px;
}

.bordered-field {
  border-color: #5d9aa6 !important;
  box-shadow: none;
}

.bordered-field:focus {
  border-color: #2d6a73 !important;
  box-shadow: 0 0 0 0.18rem rgba(93, 154, 166, 0.18);
}

.bordered-field.is-invalid {
  border-color: #dc3545 !important;
}

.invalid-feedback {
  font-size: 0.82rem;
}

.members-label-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  margin-bottom: 10px;
}

.member-count-badge,
.member-status-badge {
  flex: 0 0 auto;
  border-radius: 999px;
  color: #2d6a4f;
  background: #e9f5ef;
  font-size: 0.75rem;
  font-weight: 700;
  line-height: 1;
  white-space: nowrap;
}

.member-count-badge {
  padding: 7px 10px;
}

.members-refreshing {
  display: flex;
  align-items: center;
  margin-bottom: 10px;
  color: #6b7280;
  font-size: 0.86rem;
}

.member-picker {
  display: grid;
  gap: 10px;
  max-height: 320px;
  overflow-y: auto;
  padding-right: 4px;
}

.member-option {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 10px 12px;
  border: 1px solid #5d9aa6;
  border-radius: 6px;
  cursor: pointer;
}

.member-option .form-check-input {
  width: 20px;
  height: 20px;
  flex: 0 0 20px;
  margin: 0;
}

.member-option .form-check-input:checked {
  border-color: #0d6efd;
  background-color: #0d6efd;
}

.member-option .form-check-input:disabled {
  opacity: 1;
  pointer-events: none;
}

.member-option:hover {
  background: #f4faf9;
}

.member-option-selected {
  border-color: #3b82f6;
  background: #f8fbff;
}

.member-option-existing {
  cursor: default;
  box-shadow: 0 0 0 1px rgba(59, 130, 246, 0.14);
}

.member-option-existing:hover {
  background: #f8fbff;
}

.member-avatar {
  width: 38px;
  height: 38px;
  display: grid;
  flex: 0 0 38px;
  place-items: center;
  overflow: hidden;
  border-radius: 50%;
  color: #ffffff;
  background: #4d7c6e;
  font-weight: 700;
}

.member-avatar img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.member-info {
  display: grid;
  min-width: 0;
}

.member-name {
  color: #1f2937;
  font-weight: 600;
}

.member-email {
  overflow: hidden;
  color: #6b7280;
  font-size: 0.84rem;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.member-status-badge {
  margin-left: auto;
  padding: 6px 9px;
}

.empty-members-state {
  padding: 18px;
  border: 1px dashed #9bbdc4;
  border-radius: 6px;
  color: #6b7280;
  text-align: center;
}

.form-control-lg,
.form-select-lg {
  min-height: 40px;
  font-size: 1rem;
}

.btn-create {
  color: #ffffff;
  background: #4d7c6e;
  border: 0;
  font-weight: 600;
}

.btn-create:hover,
.btn-create:focus {
  color: #ffffff;
  background: #3f665b;
}

@media (max-width: 575.98px) {
  .modal-backdrop-custom {
    align-items: center;
    padding-top: 24px;
  }

  .avatar-field {
    align-items: stretch;
    flex-direction: column;
  }
}
</style>

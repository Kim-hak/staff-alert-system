<script setup>
import { ref, reactive, onMounted, computed, watch } from 'vue';
import { useGroupStore } from '@/stores/useGroupStore';
import GroupCard from '@/components/ui/base/GroupCard.vue';
import BasePagination from '@/components/ui/base/BasePagination.vue';
import BaseModal from '@/components/ui/base/BaseModal.vue';
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
const removingMemberId = ref('');
const isLoadingGroupMembers = ref(false);
const itemsPerPage = 6;

const emptyGroupForm = {
  name: '',
  managerId: '',
  description: '',
  avatar: null,
  avatarPreview: ''
};

const groupForm = reactive({ ...emptyGroupForm });

const formErrors = reactive({
  name: '',
  managerId: '',
  avatar: ''
});

const memberForm = reactive({
  selectedIds: []
});

const notifySuccess = (title) => Swal.fire({
  title,
  icon: 'success',
  timer: 1500,
  showConfirmButton: false
});

const notifyError = (title, text) => Swal.fire({
  title,
  text,
  icon: 'error',
  confirmButtonColor: '#2D6A4F'
});

const firstArray = (source, keys) => keys.map((key) => source?.[key]).find(Array.isArray) || [];
const toId = (value) => String(value ?? '');
const getUserSource = (user) => user?.user || user?.staff?.user || user?.staff || user || {};
const getUserId = (user) => user?.user?.id
  ?? user?.staff?.user?.id
  ?? user?.userId
  ?? user?.staffId
  ?? user?.user_id
  ?? user?.staff_id
  ?? user?.staff?.id
  ?? user?.id;

const uniqueUsers = (users) => {
  const ids = new Set();
  return users.filter((user) => {
    const id = toId(getUserId(user));
    if (!id || ids.has(id)) return false;
    ids.add(id);
    return true;
  });
};

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
const memberModalTitle = computed(() => selectedGroupName.value ? `Manage Members - ${selectedGroupName.value}` : 'Manage Members');

const handlePageChange = (page) => {
  currentPage.value = Math.min(Math.max(page, 1), totalPages.value);
  window.scrollTo({ top: 0, behavior: 'smooth' });
};

const getUserName = (user) => {
  const source = getUserSource(user);
  return source.fullname
    || source.name
    || `${source.firstName || ''} ${source.lastName || ''}`.trim()
    || source.email
    || 'Unnamed user';
};

const getUserAvatar = (user) => {
  const source = getUserSource(user);
  return source.avatar || source.photo || source.image || source.thumbnail || '';
};

const getUserContact = (user) => {
  const source = getUserSource(user);
  return source.email || source.phone || 'Staff';
};

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
  return firstArray(group, ['members', 'staffs', 'users']);
}

function getGroupMemberIds(group) {
  return getGroupMembers(group).map((member) => toId(getUserId(member))).filter(Boolean);
}

const existingMemberIds = computed(() => selectedGroupForMembers.value ? getGroupMemberIds(selectedGroupForMembers.value) : []);
const staffOptions = computed(() => {
  const existingIds = existingMemberIds.value;
  return uniqueUsers([...groupStore.staffs, ...getGroupMembers(selectedGroupForMembers.value)])
    .sort((first, second) => {
      const firstIsExisting = existingIds.includes(toId(getUserId(first)));
      const secondIsExisting = existingIds.includes(toId(getUserId(second)));
      return Number(secondIsExisting) - Number(firstIsExisting);
    });
});
const newSelectedIds = computed(() => memberForm.selectedIds.filter((id) => !existingMemberIds.value.includes(String(id))));
const addMembersLabel = computed(() => {
  const count = newSelectedIds.value.length;
  return count ? `Add ${count} Member${count > 1 ? 's' : ''}` : 'Add Members';
});

const isExistingMember = (staff) => existingMemberIds.value.includes(toId(getUserId(staff)));
const toPayloadId = (id) => (Number.isNaN(Number(id)) ? id : Number(id));
const isMemberModalBusy = computed(() => isLoadingGroupMembers.value || isAddingMembers.value || Boolean(removingMemberId.value));
const isRemovingMember = (staff) => removingMemberId.value === toId(getUserId(staff));

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
  Object.assign(groupForm, emptyGroupForm);
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
  memberForm.selectedIds = [...existingMemberIds.value];
  showMembersModal.value = true;
  isLoadingGroupMembers.value = true;

  const groupId = group.id;
  const loadedGroup = await groupStore.fetchGroupWithMembers(groupId);

  if (toId(selectedGroupForMembers.value?.id) !== toId(groupId)) {
    return;
  }

  isLoadingGroupMembers.value = false;

  if (loadedGroup) {
    selectedGroupForMembers.value = loadedGroup;
    memberForm.selectedIds = [...existingMemberIds.value];
  } else {
    notifyError('Load members failed', groupStore.error || 'Could not load group members. Please try again.');
  }
};

const closeMembersModal = () => {
  if (isMemberModalBusy.value) return;
  showMembersModal.value = false;
  selectedGroupForMembers.value = null;
  memberForm.selectedIds = [];
  removingMemberId.value = '';
};

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
    notifySuccess(successTitle);
  } else {
    notifyError(editingGroup.value ? 'Update failed' : 'Create failed', groupStore.error || 'Could not save group. Please try again.');
  }
};

const handleAddMembers = async () => {
  if (!selectedGroupForMembers.value) return;

  if (newSelectedIds.value.length === 0) {
    Swal.fire({
      title: 'No new members selected',
      text: 'Please select at least one staff member who is not already in this group.',
      icon: 'warning',
      confirmButtonColor: '#2D6A4F'
    });
    return;
  }

  isAddingMembers.value = true;
  const userIds = newSelectedIds.value.map(toPayloadId);
  const success = await groupStore.addGroupMembers(selectedGroupForMembers.value.id, userIds);
  isAddingMembers.value = false;

  if (success) {
    closeMembersModal();
    notifySuccess('Members added!');
  } else {
    notifyError('Add members failed', groupStore.error || 'Could not add members. Please try again.');
  }
};

const syncSelectedGroupForMembers = () => {
  if (!selectedGroupForMembers.value) return;

  const currentGroupId = selectedGroupForMembers.value.id;
  const freshGroup = groupStore.groups.find((group) => String(group.id) === String(currentGroupId));

  if (freshGroup) {
    selectedGroupForMembers.value = freshGroup;
  }
};

const handleRemoveMember = async (staff) => {
  if (!selectedGroupForMembers.value) return;

  const memberId = toId(getUserId(staff));
  if (!memberId) {
    notifyError('Remove member failed', 'Could not identify this staff member.');
    return;
  }

  const result = await Swal.fire({
    title: 'Remove member?',
    text: `${getUserName(staff)} will be removed from ${selectedGroupName.value}.`,
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#2D6A4F',
    confirmButtonText: 'Yes, remove',
    cancelButtonText: 'Cancel',
    reverseButtons: true
  });

  if (!result.isConfirmed) return;

  removingMemberId.value = memberId;
  const success = await groupStore.removeGroupMember(selectedGroupForMembers.value.id, toPayloadId(memberId));
  removingMemberId.value = '';

  if (success) {
    memberForm.selectedIds = memberForm.selectedIds.filter((id) => String(id) !== memberId);
    syncSelectedGroupForMembers();
    notifySuccess('Member removed!');
  } else {
    notifyError('Remove member failed', groupStore.error || 'Could not remove member. Please try again.');
  }
};

const handleUploadThumbnail = async (group, file) => {
  const success = await groupStore.uploadGroupThumbnail(group.id, file);

  if (success) {
    notifySuccess('Thumbnail updated!');
  } else {
    notifyError('Upload failed', groupStore.error || 'Could not upload thumbnail. Please try again.');
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
      notifySuccess('Deleted!');
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
            @upload-thumbnail="handleUploadThumbnail(group, $event)"
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

    <BaseModal :show="showGroupModal" :title="modalTitle" @close="closeGroupModal">
      <form class="modal-form" @submit.prevent="handleSubmitGroup">
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
          <button type="button" class="btn btn-secondary px-4" :disabled="isSubmitting" @click="closeGroupModal">
            Cancel
          </button>
          <button type="submit" class="btn btn-create px-4" :disabled="isSubmitting">
            <span v-if="isSubmitting" class="spinner-border spinner-border-sm me-2" role="status"></span>
            {{ submitLabel }}
          </button>
        </div>
      </form>
    </BaseModal>

    <BaseModal :show="showMembersModal" :title="memberModalTitle" @close="closeMembersModal">
      <form class="modal-form" @submit.prevent="handleAddMembers">
        <div class="mb-3">
          <label class="form-label fw-semibold">Staff Members</label>
          <div v-if="groupStore.staffsLoading || isLoadingGroupMembers" class="text-muted py-3">
            <span class="spinner-border spinner-border-sm me-2" role="status"></span>
            {{ isLoadingGroupMembers ? 'Loading group members...' : 'Loading staff...' }}
          </div>

          <div v-else-if="staffOptions.length === 0" class="empty-members-state">
            No staff found.
          </div>

          <div v-else class="member-picker">
            <label
              v-for="staff in staffOptions"
              :key="toId(getUserId(staff))"
              :class="['member-option', { 'is-existing': isExistingMember(staff) }]"
            >
              <input
                v-model="memberForm.selectedIds"
                class="form-check-input"
                type="checkbox"
                :value="toId(getUserId(staff))"
                :disabled="isMemberModalBusy || isExistingMember(staff)"
              >
              <span class="member-avatar">
                <img v-if="getUserAvatar(staff)" :src="getUserAvatar(staff)" alt="">
                <span v-else>{{ getUserName(staff).charAt(0).toUpperCase() }}</span>
              </span>
              <span class="member-info">
                <span class="member-title-row">
                  <span class="member-name">{{ getUserName(staff) }}</span>
                  <span v-if="isExistingMember(staff)" class="member-badge">In group</span>
                </span>
                <span class="member-email">{{ getUserContact(staff) }}</span>
              </span>
              <button
                v-if="isExistingMember(staff)"
                class="btn member-remove-btn"
                type="button"
                title="Remove member"
                :disabled="isMemberModalBusy"
                @click.prevent.stop="handleRemoveMember(staff)"
              >
                <span v-if="isRemovingMember(staff)" class="spinner-border spinner-border-sm" role="status"></span>
                <i v-else class="bi bi-trash"></i>
              </button>
            </label>
          </div>
        </div>

        <div class="d-flex justify-content-end gap-3">
          <button type="button" class="btn btn-secondary px-4" :disabled="isMemberModalBusy" @click="closeMembersModal">
            Cancel
          </button>
          <button type="submit" class="btn btn-create px-4" :disabled="isMemberModalBusy || newSelectedIds.length === 0">
            <span v-if="isAddingMembers" class="spinner-border spinner-border-sm me-2" role="status"></span>
            {{ addMembersLabel }}
          </button>
        </div>
      </form>
    </BaseModal>
  </div>
</template>

<style scoped>
.group-card-grid {
  margin-top: 1.25rem;
}

.modal-form .form-label {
  color: #1f2937;
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

.modal-form .form-control,
.modal-form .form-select {
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

.member-option:hover {
  background: #f4faf9;
}

.member-option.is-existing {
  cursor: default;
  background: #f4faf9;
  border-color: #b7d6d0;
}

.member-option .form-check-input:disabled {
  opacity: 1;
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
  flex: 1 1 auto;
  min-width: 0;
}

.member-title-row {
  display: flex;
  align-items: center;
  gap: 8px;
  min-width: 0;
}

.member-name {
  overflow: hidden;
  color: #1f2937;
  font-weight: 600;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.member-badge {
  flex: 0 0 auto;
  padding: 2px 8px;
  border-radius: 999px;
  color: #2d6a4f;
  background: #e5f4ed;
  font-size: 0.72rem;
  font-weight: 700;
}

.member-email {
  overflow: hidden;
  color: #6b7280;
  font-size: 0.84rem;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.member-remove-btn {
  display: grid;
  width: 36px;
  height: 36px;
  flex: 0 0 36px;
  place-items: center;
  padding: 0;
  border: 1px solid #f3c4c4;
  border-radius: 6px;
  color: #b42318;
  background: #fff5f5;
  line-height: 1;
}

.member-remove-btn .bi,
.member-remove-btn .spinner-border {
  display: block;
  grid-area: 1 / 1;
  line-height: 1;
}

.member-remove-btn:hover:not(:disabled),
.member-remove-btn:focus:not(:disabled) {
  color: #ffffff;
  background: #dc3545;
  border-color: #dc3545;
}

.member-remove-btn:disabled {
  opacity: 0.7;
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
  .avatar-field {
    align-items: stretch;
    flex-direction: column;
  }
}
</style>

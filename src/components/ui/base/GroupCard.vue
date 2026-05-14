<template>
  <BaseCard>
    <div class="d-flex flex-column h-100">
      <div class="group-thumbnail bg-light d-flex justify-content-center align-items-center mb-4 mx-auto position-relative">
        <img v-if="thumbnail" :src="thumbnail" alt="Group" class="w-100 h-100 object-fit-cover" />
        <i v-else class="bi bi-image text-muted placeholder-icon"></i>

        <button
          class="btn btn-light btn-sm position-absolute top-0 end-0 m-2 shadow-sm upload-btn"
          type="button"
          title="Upload thumbnail"
          @click="$refs.fileInput.click()"
        >
          <i class="bi bi-upload"></i>
        </button>
        <input
          ref="fileInput"
          type="file"
          class="d-none"
          accept="image/*"
          @change="onFileSelected"
        >
      </div>

      <div class="flex-grow-1 text-start">
        <h5 class="fw-bold text-dark mb-2">{{ name }}</h5>
        <p v-if="description" class="group-description text-muted small mb-2">{{ description }}</p>
        <p class="text-muted small mb-1">Manager: <span class="text-secondary">{{ managerName }}</span></p>
        <p class="text-muted small mb-2"><i class="bi bi-people me-1"></i> {{ membersCount }} members</p>
        <p class="text-muted small mb-0 created-text">Created: {{ createdAt }}</p>
      </div>

      <div class="d-flex justify-content-between align-items-center mt-3 pt-3 border-top border-light">
        <button
          class="btn btn-light text-secondary flex-grow-1 me-2 fw-medium btn-members"
          type="button"
          @click="$emit('members')"
        >
          <i class="bi bi-people me-1"></i> Members
        </button>
        <div class="d-flex gap-1">
          <button class="btn btn-light text-success btn-action" type="button" @click="$emit('edit')">
            <i class="bi bi-pencil-square"></i>
          </button>
          <button class="btn btn-light text-danger btn-action" type="button" @click="$emit('delete')">
            <i class="bi bi-trash"></i>
          </button>
        </div>
      </div>
    </div>
  </BaseCard>
</template>

<script setup>
import BaseCard from './BaseCard.vue';

defineProps({
  thumbnail: String,
  name: { type: String, required: true },
  description: String,
  managerName: String,
  membersCount: { type: Number, default: 0 },
  createdAt: String
});

const emit = defineEmits(['edit', 'delete', 'members', 'upload-thumbnail']);

const onFileSelected = (event) => {
  const file = event.target.files?.[0];
  if (!file) return;

  emit('upload-thumbnail', file);
  event.target.value = '';
};
</script>

<style scoped>
.group-thumbnail {
  width: 100%;
  height: 160px;
  overflow: hidden;
  border-radius: 6px 6px 0 0;
}

.placeholder-icon {
  font-size: 3rem;
}

.upload-btn {
  color: #4d7c6e;
  border: 1px solid #e6ecea;
  border-radius: 8px;
}

.btn-members {
  background-color: #eef6f5;
  border: none;
  color: #4d7c6e !important;
  transition: all 0.2s;
}

.btn-members:hover {
  background-color: #e2efed;
}

.btn-action {
  border: none;
  background: transparent;
}

.btn-action:hover {
  background-color: #f1f3f5;
}

.group-description {
  display: -webkit-box;
  overflow: hidden;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
}

.created-text {
  font-size: 0.8rem;
}
</style>

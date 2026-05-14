<template>
  <BaseCard>
    <div class="d-flex flex-col flex-column h-100">
      <div class="group-thumbnail bg-light rounded-4 d-flex justify-content-center align-items-center mb-4 mx-auto position-relative">
        <img v-if="thumbnail" :src="thumbnail" alt="Group" class="w-100 h-100 rounded-4 object-fit-cover" />
        <i v-else class="bi bi-image text-muted" style="font-size: 3rem;"></i>
        
        <button class="btn btn-light btn-sm position-absolute top-0 end-0 m-2 shadow-sm upload-btn">
          <i class="bi bi-upload"></i>
        </button>
      </div>

      <div class="flex-grow-1 text-start">
        <h5 class="fw-bold text-dark mb-1">{{ name }}</h5>
        <p v-if="description" class="group-description text-muted small mb-2">{{ description }}</p>
        <p class="text-muted small mb-1">Manager: <span class="text-secondary">{{ managerName }}</span></p>
        <p class="text-muted small mb-0"><i class="bi bi-people me-1"></i> {{ membersCount }} members</p>
        <p class="text-muted small mt-2" style="font-size: 0.8rem;">Created: {{ createdAt }}</p>
      </div>

      <div class="d-flex justify-content-between align-items-center mt-3 pt-3 border-top border-light">
        <button class="btn btn-light text-secondary flex-grow-1 me-2 fw-medium btn-members" @click="$emit('members')">
          <i class="bi bi-people me-1"></i> Members
        </button>
        <div class="d-flex gap-1">
          <button class="btn btn-light text-success btn-action" @click="$emit('edit')"><i class="bi bi-pencil-square"></i></button>
          <button class="btn btn-light text-danger btn-action" @click="$emit('delete')"><i class="bi bi-trash"></i></button>
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
defineEmits(['edit', 'delete', 'members']);
</script>

<style scoped>
.group-thumbnail {
  width: 100%;
  height: 160px;
  overflow: hidden;
}
.upload-btn {
  opacity: 0;
  transition: opacity 0.3s;
}
.group-thumbnail:hover .upload-btn {
  opacity: 1;
}
.btn-members {
  background-color: #f8f9fa;
  border: none;
  transition: all 0.2s;
}
.btn-members:hover {
  background-color: #e2e6ea;
  color: #4D7C6E !important;
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
  -webkit-box-orient: vertical;
}
</style>

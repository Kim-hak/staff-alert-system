<template>
  <BaseCard class="group-card-wrapper border-0 overflow-hidden transition-all">
    <div class="d-flex flex-column h-100">
      <!-- Thumbnail Section -->
      <div
        class="group-image-container position-relative overflow-hidden rounded-4 mb-3"
      >
        <img
          v-if="thumbnail"
          :src="thumbnail"
          alt="Group"
          class="w-100 h-100 object-fit-cover group-img transition-all"
        />
        <div
          v-else
          class="image-placeholder w-100 h-100 d-flex align-items-center justify-content-center bg-light text-muted"
        >
          <i class="bi bi-image display-6 opacity-25"></i>
        </div>

        <!-- Floating Badge -->
        <div
          class="member-badge position-absolute top-0 start-0 m-3 px-2 py-1 rounded-pill bg-white shadow-sm d-flex align-items-center gap-1"
        >
          <i class="bi bi-people-fill text-primary-custom small"></i>
          <span class="fw-bold text-dark extra-small">{{ membersCount }}</span>
        </div>

        <!-- Thumbnail Actions (Always visible or on hover) -->
        <div
          class="thumbnail-actions position-absolute top-0 end-0 m-2 d-flex gap-2"
        >
          <button
            class="btn btn-white-glass rounded-circle p-2 shadow-sm action-btn"
            @click.stop="$refs.fileInput.click()"
            title="Change thumbnail"
          >
            <i class="bi bi-camera-fill"></i>
          </button>
          <button
            v-if="thumbnail"
            class="btn btn-danger-glass rounded-circle p-2 shadow-sm action-btn"
            @click.stop="$emit('delete-thumbnail')"
            title="Delete thumbnail"
          >
            <i class="bi bi-trash-fill"></i>
          </button>
        </div>

        <input
          type="file"
          ref="fileInput"
          class="d-none"
          accept="image/*"
          @change="onFileSelected"
        />
      </div>

      <!-- Info Section -->
      <div class="group-info-body flex-grow-1 px-1">
        <div class="d-flex justify-content-between align-items-start mb-2">
          <h5 class="group-name fw-bold text-dark mb-0 line-clamp-1">
            {{ name }}
          </h5>
          <button
            class="btn btn-light-custom btn-sm rounded-circle p-2 shadow-sm"
            @click="$emit('edit')"
            title="Edit group"
          >
            <i class="bi bi-pencil-square"></i>
          </button>
        </div>

        <p
          v-if="description"
          class="group-description text-muted small mb-3 line-clamp-2"
        >
          {{ description }}
        </p>

        <div class="manager-info d-flex align-items-center gap-2 mb-3">
          <div
            class="manager-avatar-mini bg-primary-subtle text-primary-custom rounded-circle d-flex align-items-center justify-content-center fw-bold"
          >
            {{ managerName?.charAt(0) }}
          </div>
          <div class="manager-details">
            <p class="mb-0 text-dark fw-medium extra-small">Manager</p>
            <p class="mb-0 text-muted small">{{ managerName }}</p>
          </div>
        </div>
      </div>

      <!-- Footer Section -->
      <div
        class="group-card-footer mt-auto pt-3 border-top border-light-subtle d-flex align-items-center justify-content-between"
      >
        <div class="created-date d-flex align-items-center gap-1 text-muted">
          <i class="bi bi-calendar3 extra-small"></i>
          <span class="extra-small">{{ createdAt }}</span>
        </div>

        <button
          class="btn btn-light-custom btn-sm rounded-pill px-3 fw-medium transition-all"
        >
          View members <i class="bi bi-arrow-right ms-1"></i>
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

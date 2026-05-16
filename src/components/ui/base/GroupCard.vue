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
            @click.stop="fileInput.click()"
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
          @click="$emit('members')"
        >
          View members <i class="bi bi-arrow-right ms-1"></i>
        </button>
      </div>
    </div>
  </BaseCard>
</template>

<script setup>
import { ref } from "vue";
import BaseCard from "./BaseCard.vue";

defineProps({
  thumbnail: String,
  name: { type: String, required: true },
  description: String,
  managerName: String,
  membersCount: { type: Number, default: 0 },
  createdAt: String,
});
const emit = defineEmits([
  "edit",
  "delete-thumbnail",
  "members",
  "update-thumbnail",
]);

const fileInput = ref(null);

const onFileSelected = (event) => {
  const file = event.target.files[0];
  if (file) {
    emit("update-thumbnail", file);
    // Reset the input value so the same file can be selected again if needed
    event.target.value = "";
  }
};
</script>

<style scoped>
.group-image-container {
  height: 200px;
  background-color: #f8f9fa;
}

.group-img {
  object-position: center;
}

.image-placeholder {
  background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
}

.btn-white-glass {
  background: rgba(255, 255, 255, 0.8);
  backdrop-filter: blur(4px);
  border: 1px solid rgba(255, 255, 255, 0.3);
  color: #52796f;
}

.btn-white-glass:hover {
  background: white;
  color: #354f52;
  transform: scale(1.1);
}

.btn-danger-glass {
  background: rgba(220, 53, 69, 0.1);
  backdrop-filter: blur(4px);
  border: 1px solid rgba(220, 53, 69, 0.2);
  color: #dc3545;
}

.btn-danger-glass:hover {
  background: #dc3545;
  color: white;
  transform: scale(1.1);
}

.action-btn {
  width: 38px;
  height: 38px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
}

.member-badge {
  z-index: 2;
  font-size: 0.75rem;
}

.extra-small {
  font-size: 0.7rem;
}

.line-clamp-1 {
  display: -webkit-box;
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.btn-light-custom {
  background-color: #f8f9fa;
  border: 1px solid #e9ecef;
  color: #6c757d;
  transition: all 0.2s ease;
}

.btn-light-custom:hover {
  background-color: #e9ecef;
  color: #52796f;
  border-color: #52796f;
}

.manager-avatar-mini {
  width: 32px;
  height: 32px;
  font-size: 0.85rem;
}

.transition-all {
  transition: all 0.3s ease;
}

.group-card-wrapper:hover {
  transform: translateY(-5px);
  box-shadow: 0 12px 24px rgba(0, 0, 0, 0.1) !important;
}
</style>

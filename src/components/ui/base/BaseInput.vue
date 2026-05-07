<template>
  <div class="mb-3 text-start">
    <label v-if="label" class="form-label text-muted fw-medium small mb-1">
      {{ label }} <span v-if="required" class="text-danger">*</span>
    </label>
    <input
      :type="type"
      :value="modelValue"
      @input="$emit('update:modelValue', $event.target.value)"
      v-bind="$attrs"
      class="form-control custom-input"
      :class="{ 'is-invalid': error }"
    />
    <div v-if="error" class="invalid-feedback">{{ error }}</div>
  </div>
</template>

<script setup>
defineProps({
  label: String,
  type: { type: String, default: 'text' },
  modelValue: [String, Number],
  error: String,
  required: Boolean
});
defineEmits(['update:modelValue']);
</script>

<style scoped>
.custom-input {
  padding: 0.6rem 1rem;
  border-radius: 8px;
  border: 1px solid #e0e0e0;
  background-color: #fdfdfd;
  transition: all 0.2s ease-in-out;
}
.custom-input:focus {
  border-color: #4D7C6E;
  box-shadow: 0 0 0 0.25rem rgba(77, 124, 110, 0.15);
  background-color: #ffffff;
}
.custom-input::placeholder {
  color: #adb5bd;
  font-size: 0.9rem;
}
</style>
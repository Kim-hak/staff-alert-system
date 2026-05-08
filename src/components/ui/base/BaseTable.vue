<template>
  <div class="table-responsive bg-white rounded-4 border border-light shadow-sm">
    <table class="table table-hover align-middle custom-table mb-0">
      <thead class="table-header">
        <tr>
          <th v-for="col in columns" :key="col.key" class="text-uppercase fw-semibold text-muted py-3 px-4" style="font-size: 0.75rem; letter-spacing: 0.5px;">
            {{ col.label }}
          </th>
          <th v-if="$slots.actions" class="py-3 px-4 text-end text-uppercase fw-semibold text-muted" style="font-size: 0.75rem;">
            Actions
          </th>
        </tr>
      </thead>
      
      <tbody>
        <tr v-if="loading">
          <td :colspan="columns.length + ($slots.actions ? 1 : 0)" class="text-center py-5 text-muted">
            <div class="spinner-border spinner-border-sm text-success me-2" role="status"></div> Loading...
          </td>
        </tr>
        <tr v-else-if="!data || data.length === 0">
          <td :colspan="columns.length + ($slots.actions ? 1 : 0)" class="text-center py-5 text-muted">
            <i class="bi bi-inbox fs-2 d-block mb-2 text-light-muted"></i> No data available
          </td>
        </tr>
        <tr v-else v-for="(item, index) in data" :key="item.id || index" class="custom-row">
          <td v-for="col in columns" :key="col.key" class="py-3 px-4">
            <slot :name="col.key" :item="item">
              <span class="text-dark fw-medium">{{ item[col.key] }}</span>
            </slot>
          </td>
          <td v-if="$slots.actions" class="py-3 px-4 text-end">
            <slot name="actions" :item="item" />
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup>
defineProps({
  columns: { type: Array, required: true }, // ឧ: [{ key: 'fullname', label: 'Full Name' }, ...]
  data: { type: Array, required: true },
  loading: Boolean
});
</script>

<style scoped>
.custom-table th {
  background-color: #f8fbfc;
  border-bottom: 2px solid #eef2f5;
}
.custom-row td {
  border-bottom: 1px solid #f1f5f4;
  transition: background-color 0.2s;
}
.custom-row:last-child td {
  border-bottom: none;
}
.custom-row:hover td {
  background-color: #fcfdfd;
}
</style>
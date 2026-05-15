<template>
  <nav aria-label="...">
    <!-- {{ totalPages }} -->
    <ul class="pagination">
      <li class="page-item">
        <a class="page-link" href="#" @click.prevent="previousPage">←</a>
      </li>

      <li class="page-item" v-for="value in totalPages" :key="value">
        <a class="page-link" href="#" @click.prevent="goToPage(value)">
          {{ value }}
        </a>
      </li>

      <li class="page-item">
        <a class="page-link" href="#" @click.prevent="nextPage">→</a>
      </li>
    </ul>
  </nav>
</template>

<script setup>
let prop = defineProps({
  totalPages: Number
})
const goToPage = (value) => {
  console.log(value)
}
</script>
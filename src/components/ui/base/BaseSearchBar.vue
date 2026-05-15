<template>
  <div class="position-relative w-100">

    <!-- Input -->
    <input
      v-model="searchText"
      type="text"
      class="form-control"
      :placeholder="placeholder"
      @focus="showDropdown = true"
    />

    <!-- Dropdown Suggestions -->
    <ul
      v-if="showDropdown && filteredItems.length"
      class="list-group position-absolute w-100 mt-1 shadow-sm"
      style="z-index: 999"
    >
      <li
        v-for="(item, index) in filteredItems"
        :key="index"
        class="list-group-item list-group-item-action"
        @click="selectItem(item)"
      >
        {{ item[labelKey] }}
      </li>
    </ul>

  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted } from "vue";

const props = defineProps({
  modelValue: String,
  items: {
    type: Array,
    default: () => []
  },
  labelKey: {
    type: String,
    default: "name"
  },
  placeholder: {
    type: String,
    default: "Search..."
  }
});

const emit = defineEmits(["update:modelValue", "select"]);

const searchText = ref(props.modelValue || "");
const showDropdown = ref(false);

// sync v-model
watch(searchText, (val) => {
  emit("update:modelValue", val);
});

// filter logic
const filteredItems = computed(() => {
  if (!searchText.value) return props.items;

  return props.items.filter((item) =>
    item[props.labelKey]
      ?.toLowerCase()
      .includes(searchText.value.toLowerCase())
  );
});

// select item
const selectItem = (item) => {
  searchText.value = item[props.labelKey];
  showDropdown.value = false;
  emit("select", item);
};

// close dropdown when click outside
const handleClickOutside = (e) => {
  if (!e.target.closest(".position-relative")) {
    showDropdown.value = false;
  }
};

onMounted(() => {
  document.addEventListener("click", handleClickOutside);
});
</script>
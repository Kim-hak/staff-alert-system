<template>
  <div class="position-relative w-100">

    <input
      v-model="searchText"
      type="text"
      class="form-control "
      :placeholder="placeholder"
      @focus="showDropdown = true" 
    />

    <ul
      v-if="showDropdown && items.length"
      class="list-group position-absolute w-100 mt-1 shadow-sm"
      style="z-index:999"
    >
      <!-- <li
        v-for="(item, index) in items"
        :key="index"
        class="list-group-item list-group-item-action"
        @click="selectItem(item)"
      >
        {{ item[labelKey] }}
      </li> -->
    </ul>

  </div>
</template>

<script setup>
import { ref, watch, onMounted, onUnmounted } from "vue";

const props = defineProps({
  modelValue: String,
  items: Array,
  labelKey: {
    type: String,
    default: "fullname"
  },
  placeholder: String
});

const emit = defineEmits(["update:modelValue", "select"]);

const searchText = ref(props.modelValue || "");
const showDropdown = ref(false);

watch(() => props.modelValue, (val) => {
  searchText.value = val;
});

watch(searchText, (val) => {
  emit("update:modelValue", val);
});

// const selectItem = (item) => {
//   searchText.value = item[props.labelKey];
//   showDropdown.value = false;
//   emit("select", item);
// };

const handleClickOutside = (e) => {
  if (!e.target.closest(".position-relative")) {
    showDropdown.value = false;
  }
};

onMounted(() => {
  document.addEventListener("click", handleClickOutside);
});

onUnmounted(() => {
  document.removeEventListener("click", handleClickOutside);
});
</script>
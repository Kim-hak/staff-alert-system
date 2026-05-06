<template>
  <div class="dashboard-wrapper">
    <Sidebar :isOpen="sidebarOpen" :isMobile="isMobile" />

    <div id="main-content" :class="{ expanded: !sidebarOpen && !isMobile }">
      <Navbar @toggle="toggleSidebar" />

      <main class="p-4">
     
        <h2></h2>
      </main>
    </div>

   
    <div
      v-if="isMobile && sidebarOpen"
      class="overlay"
      @click="toggleSidebar"
    ></div>
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue'
import Sidebar from '@/components/comment/Sidebar.vue'
import Navbar from '@/components/comment/Navbar.vue'





const sidebarOpen = ref(true)
const isMobile = ref(false)

const checkScreen = () => {
  isMobile.value = window.innerWidth < 992
  sidebarOpen.value = !isMobile.value 
}

const toggleSidebar = () => {
  sidebarOpen.value = !sidebarOpen.value
}

onMounted(() => {
  checkScreen()
  window.addEventListener('resize', checkScreen)
})

onBeforeUnmount(() => {
  window.removeEventListener('resize', checkScreen)
})
</script>

<style>

:root {
  --sidebar-bg: #4a7c6f;
  --topbar-bg: #5a9688;
  --sidebar-width: 260px;
}

#main-content {
  margin-left: var(--sidebar-width);
  transition: 0.3s;
  min-height: 100vh;
}

#main-content.expanded {
  margin-left: 0;
}

.overlay {
  position: fixed;
  inset: 0;
  background: rgba(0,0,0,0.5);
  z-index: 1040;
}

@media (max-width: 991px) {
  #main-content {
    margin-left: 0;
  }
}
</style>
<template>
  <div class="space-y-8">
    <!-- Header -->
    <div class="mb-8">
      <h1 class="text-3xl font-normal text-gray-900 mb-2">Dashboard</h1>
      <p class="text-gray-500 font-normal">
        Welcome back, Manager!
      </p>
    </div>

    <!-- Manager Stats Cards -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">

      <!-- Staff -->
      <div
        class="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm"
      >
        <p class="text-sm text-gray-400 mb-1 uppercase">
          My Staff
        </p>
        <h2 class="text-3xl text-gray-900">24</h2>
      </div>

      <!-- Groups -->
      <div
        class="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm"
      >
        <p class="text-sm text-gray-400 mb-1 uppercase">
          My Groups
        </p>
        <h2 class="text-3xl text-gray-900">3</h2>
      </div>

      <!-- Reports -->
      <div
        class="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm"
      >
        <p class="text-sm text-gray-400 mb-1 uppercase">
          Reports
        </p>
        <h2 class="text-3xl text-gray-900">12</h2>
      </div>

      <!-- Notifications -->
      <div
        class="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm"
      >
        <p class="text-sm text-gray-400 mb-1 uppercase">
          Notifications
        </p>
        <h2 class="text-3xl text-gray-900">5</h2>
      </div>

    </div>
  </div>
</template>
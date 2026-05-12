<template>
  <div class="space-y-6">
    <!-- Header -->
    <div
      class="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8"
    >
      <div>
        <h1 class="text-3xl font-normal text-gray-900 mb-2">
          របាយការណ៍របស់ខ្ញុំ
        </h1>
        <p class="text-gray-500 font-normal">
          បង្កើត និងគ្រប់គ្រងរបាយការណ៍លទ្ធផលការងារសម្រាប់បុគ្គលិករបស់អ្នក
        </p>
      </div>

      <button
        class="flex items-center justify-center gap-2 px-6 py-2.5 bg-[#84A98C] text-white rounded-lg shadow-md"
      >
        បង្កើតរបាយការណ៍ថ្មី
      </button>
    </div>

    <!-- Search -->
    <div class="bg-white border border-gray-100 rounded-xl p-4 shadow-sm">
      <input
        type="text"
        placeholder="ស្វែងរករបាយការណ៍..."
        class="w-full md:w-96 px-4 py-2.5 bg-gray-50 border border-gray-100 rounded-xl focus:outline-none"
      />
    </div>

    <!-- Static Table -->
    <div class="bg-white rounded-xl shadow-sm border border-gray-100">
      <table class="w-full">
        <thead class="border-b border-gray-100">
          <tr class="text-left">
            <th class="p-4">ចំណងជើង</th>
            <th class="p-4">បុគ្គលិក</th>
            <th class="p-4">រយៈពេល</th>
            <th class="p-4">ស្ថានភាព</th>
            <th class="p-4">សកម្មភាព</th>
          </tr>
        </thead>

        <tbody>
          <tr class="border-b border-gray-50">
            <td class="p-4">Q1 Performance Review</td>
            <td class="p-4">John Doe</td>
            <td class="p-4">Q1 2026</td>
            <td class="p-4">
              <span
                class="px-3 py-1 text-sm bg-yellow-100 text-yellow-700 rounded-full"
              >
                Draft
              </span>
            </td>
            <td class="p-4">Edit / Submit</td>
          </tr>

          <tr class="border-b border-gray-50">
            <td class="p-4">Q2 Performance Review</td>
            <td class="p-4">Sarah Smith</td>
            <td class="p-4">Q2 2026</td>
            <td class="p-4">
              <span
                class="px-3 py-1 text-sm bg-green-100 text-green-700 rounded-full"
              >
                Submitted
              </span>
            </td>
            <td class="p-4">View</td>
          </tr>

          <tr>
            <td class="p-4">Monthly Staff Evaluation</td>
            <td class="p-4">David Lee</td>
            <td class="p-4">April 2026</td>
            <td class="p-4">
              <span
                class="px-3 py-1 text-sm bg-blue-100 text-blue-700 rounded-full"
              >
                Reviewed
              </span>
            </td>
            <td class="p-4">View</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>
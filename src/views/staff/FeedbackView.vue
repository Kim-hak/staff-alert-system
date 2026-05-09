<template>
  <div class="fade-in">

    <!-- Page Header -->
    <div class="mb-4">
      <h2 class="mb-1">មតិយោបល់របស់ខ្ញុំ</h2>
      <p class="text-muted mb-0">ការពិនិត្យឡើងវិញ និងមតិយោបល់ពីអ្នកគ្រប់គ្រង</p>
    </div>

    <!-- Review Card -->
    <div class="card border rounded-3 shadow-sm">
      <div class="card-body p-4">

        <!-- Header Row -->
        <div class="d-flex align-items-start justify-content-between mb-4">
          <div>
            <h5 class="fw-semibold mb-1">ការវាយតម្លៃលទ្ធផលការងារ ប្រចាំត្រីមាសទី ១ ឆ្នាំ ២០២៥</h5>
            <p class="text-muted small mb-0">ពិនិត្យដោយអ្នកគ្រប់គ្រង</p>
          </div>
          <span class="badge text-bg-primary px-3 py-2" style="font-size: 11px; letter-spacing: 0.05em;">
            បានបញ្ចប់
          </span>
        </div>

        <!-- Metric Cards -->
        <div class="row g-3 mb-4">

          <div class="col-md-6">
            <div class="rounded-3 p-3 bg-body-secondary">
              <p class="text-muted small mb-2">កម្រិតវាយតម្លៃលទ្ធផល</p>
              <div class="d-flex align-items-center gap-1">
                <span v-for="i in 5" :key="i" :style="{ color: i <= rating ? '#f59e0b' : '#d1d5db' }">★</span>
                <span class="text-muted small ms-1">{{ rating }} / 5</span>
              </div>
            </div>
          </div>

          <div class="col-md-6">
            <div class="rounded-3 p-3 bg-body-secondary">
              <p class="text-muted small mb-2">កាលបរិច្ឆេទនៃការវាយតម្លៃ</p>
              <p class="fw-semibold mb-0 small">១ មករា – ៣១ មីនា ២០២៥</p>
            </div>
          </div>

        </div>

        <hr class="my-4" />

        <!-- Performance Summary -->
        <div class="mb-3">
          <div class="d-flex align-items-center gap-2 mb-2">
            <div class="section-icon bg-body-secondary text-secondary">
              <i class="bi bi-file-text"></i>
            </div>
            <span class="fw-semibold small">សេចក្តីសង្ខេបនៃលទ្ធផលការងារ</span>
          </div>
          <p class="text-muted small mb-0 ps-1">
            {{ feedback.summary }}
          </p>
        </div>

        <!-- Achievements -->
        <div class="mb-3">
          <div class="d-flex align-items-center gap-2 mb-2">
            <div class="section-icon bg-success bg-opacity-10 text-success">
              <i class="bi bi-trophy"></i>
            </div>
            <span class="fw-semibold small text-success">សមិទ្ធផលសម្រេចបាន</span>
          </div>
          <p class="text-muted small mb-0 ps-1">
            {{ feedback.achievements }}
          </p>
        </div>

        <!-- Areas for Improvement -->
        <div class="mb-3">
          <div class="d-flex align-items-center gap-2 mb-2">
            <div class="section-icon bg-warning bg-opacity-10 text-warning">
              <i class="bi bi-graph-up-arrow"></i>
            </div>
            <span class="fw-semibold small text-warning">ចំណុចដែលត្រូវកែលម្អ</span>
          </div>
          <p class="text-muted small mb-0 ps-1">
            {{ feedback.improvement }}
          </p>
        </div>

        <hr class="my-4" />

        <!-- Admin Comment -->
        <div class="d-flex align-items-center gap-3">
          <div class="avatar-circle bg-primary bg-opacity-10 text-primary fw-semibold">
            AD
          </div>
          <div class="flex-grow-1">
            <p class="fw-semibold small mb-0">អ្នកគ្រប់គ្រង</p>
            <p class="text-muted small mb-0">{{ feedback.adminComment }}</p>
          </div>
          <i class="bi bi-chat-dots text-muted"></i>
        </div>

      </div>
    </div>

  </div>
</template>

<script setup>
import { ref } from 'vue'

const rating = ref(4)

const feedback = ref({
  summary:      'លោក John តែងតែបំពេញការងារបានតាមការរំពឹងទុក និងផ្តល់នូវលទ្ធផលការងារដែលមានគុណភាពខ្ពស់លើគ្រប់ភារកិច្ច និងគម្រោងដែលបានចាត់តាំង។',
  achievements: 'បានដឹកនាំការបញ្ជូន Sprint ចំនួន ៣ តាមកាលកំណត់ និងកាត់បន្ថយបញ្ហាបច្ចេកទេសដែលនៅសេសសល់ (bug backlog) បាន ៤០% ដែលជួយបង្កើនល្បឿនការងារក្រុម និងស្ថេរភាពនៃផលិតផលយ៉ាងខ្លាំង។',
  improvement:  'គុណភាពនៃការរៀបចំឯកសារ និងភាពច្បាស់លាស់ក្នុងការប្រស្រ័យទាក់ទងគ្នាក្នុងកិច្ចប្រជុំអន្តរក្រុម គឺជាចំណុចអាទិភាពដែលត្រូវផ្តោតលើសម្រាប់ត្រីមាសបន្ទាប់។',
  adminComment: 'ការរីកចម្រើនជារួមគឺល្អណាស់។ សូមបន្តកិច្ចខិតខំប្រឹងប្រែងនេះទៀត!',
})
</script>

<style scoped>
/* Keeping your existing styles */
.section-icon {
  width: 28px;
  height: 28px;
  border-radius: 6px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
  flex-shrink: 0;
}

.avatar-circle {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 13px;
  flex-shrink: 0;
}

/* Optional: Adding a font-family for better Khmer rendering */
.fade-in {
  font-family: 'Kantumruy Pro', 'Hanuman', sans-serif;
}
</style>
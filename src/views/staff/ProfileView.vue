<template>
  <div class="fade-in">
    <div class="row g-4">

      <!-- Profile Card -->
      <div class="col-lg-4">
        <div class="card border-0 shadow-sm">
          <div class="card-body text-center p-4">

            <img src="https://ant-g2-sas.tt.linkpc.net/api/v1/uploads/avatars/default-avatar.png"
              class="rounded-circle border mb-3" width="100" height="100" />

            <h4 class="fw-bold mb-1">{{ form.fullName }}</h4>
            <p class="text-muted mb-2">ronaldo@gmail.com</p>

            <span class="badge bg-info mb-4">STAFF</span>

            <div class="d-grid gap-2">

              <!-- Edit button -->
              <button v-if="!isEditing" class="btn btn-success" @click="enableEdit">
                កែប្រែព័ត៌មាន
              </button>

              <!-- Show only in edit mode -->
              <template v-else>
                <button class="btn btn-outline-primary">
                  ប្តូរពាក្យសម្ងាត់
                </button>

                <button class="btn btn-outline-secondary">
                  ប្តូររូបភាព
                </button>

                <button class="btn btn-outline-warning">
                  លុបរូបភាព
                </button>
              </template>

            </div>

          </div>
        </div>
      </div>

      <!-- Detail Card -->
      <div class="col-lg-8">
        <div class="card border-0 shadow-sm">

          <div class="card-header bg-white">
            <h5 class="fw-bold mb-0">ព័ត៌មានលម្អិត</h5>
          </div>

          <div class="card-body">
            <div class="row g-4">

              <!-- Editable: Full Name -->
              <div class="col-md-6">
                <small class="text-muted d-block mb-1">ឈ្មោះពេញ</small>

                <input v-if="isEditing" v-model="form.fullName" class="form-control" />

                <p v-else class="fw-semibold mb-0">
                  {{ form.fullName }}
                </p>
              </div>

              <!-- Read only: Email -->
              <div class="col-md-6">
                <small class="text-muted d-block mb-1">អ៊ីមែល</small>
                <p class="fw-semibold mb-0">
                  {{ form.email }}
                </p>
              </div>

              <!-- Editable: Phone -->
              <div class="col-md-6">
                <small class="text-muted d-block mb-1">លេខទូរស័ព្ទ</small>

                <input v-if="isEditing" v-model="form.phone" class="form-control" />

                <p v-else class="fw-semibold mb-0">
                  {{ form.phone }}
                </p>
              </div>

              <!-- Read only: Gender -->
              <div class="col-md-6">
                <small class="text-muted d-block mb-1">ភេទ</small>
                <p class="fw-semibold mb-0">
                  {{ form.gender }}
                </p>
              </div>

              <!-- Editable: Birth Date -->
              <div class="col-md-6">
                <small class="text-muted d-block mb-1">ថ្ងៃកំណើត</small>

                <input v-if="isEditing" type="date" v-model="form.birthDate" class="form-control" />

                <p v-else class="fw-semibold mb-0">
                  {{ form.birthDate }}
                </p>
              </div>

              <!-- Read only: Join Date -->
              <div class="col-md-6">
                <small class="text-muted d-block mb-1">ថ្ងៃចូលធ្វើការ</small>
                <p class="fw-semibold mb-0">
                  {{ form.joinDate }}
                </p>
              </div>

              <!-- Read only: Salary -->
              <div class="col-md-6">
                <small class="text-muted d-block mb-1">ប្រាក់ខែ</small>
                <p class="fw-semibold text-success mb-0">
                  ${{ form.salary }}
                </p>
              </div>

              <!-- Read only: Status -->
              <div class="col-md-6">
                <small class="text-muted d-block mb-1">ស្ថានភាព</small>
                <span class="badge bg-success">
                  {{ form.status }}
                </span>
              </div>

            </div>
          </div>

        </div>

        <!-- Save button only in edit mode -->
        <div v-if="isEditing" class="d-flex gap-2 mt-3">
          <button class="btn btn-success" @click="saveProfile">
            រក្សាទុក
          </button>

          <button class="btn btn-secondary" @click="isEditing = false">
            បោះបង់
          </button>
        </div>

      </div>

    </div>
  </div>
</template>

<script setup>
import { ref } from "vue"

const isEditing = ref(false)

const form = ref({
  // Editable fields
  fullName: "Ronaldo",
  phone: "0133456789",
  birthDate: "2026-05-07",

  // Read-only fields
  email: "ronaldo@gmail.com",
  gender: "Male",
  joinDate: "2026-05-07",
  salary: "332.00",
  status: "ACTIVATED",
  role: "STAFF"
})

const enableEdit = () => {
  isEditing.value = true
}

const saveProfile = () => {
  console.log("Saved:", form.value)

  // API update here

  isEditing.value = false
}
</script>